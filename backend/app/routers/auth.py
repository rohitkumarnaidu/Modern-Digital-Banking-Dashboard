from datetime import datetime, timedelta
import traceback
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app import models
from app.database import get_db
from app.models.user import User
from app.utils.hash_password import hash_password, verify_password
from app.utils.jwt_handler import create_access_token, create_refresh_token, verify_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

INVALID_CREDENTIALS_DETAIL = "Could not validate credentials"
INVALID_LOGIN_DETAIL = "Invalid credentials"
SIGNUP_FAILED_DETAIL = "Signup failed"
GENERIC_FORGOT_PASSWORD_MESSAGE = "If the email exists, an OTP has been sent"
INVALID_OTP_DETAIL = "Invalid OTP"
OTP_REQUIRED_DETAIL = "OTP is required to reset password"
USER_NOT_FOUND_DETAIL = "User not found"
INVALID_OR_EXPIRED_OTP_DETAIL = "Invalid or expired OTP"
RESET_FAILED_DETAIL = "Failed to reset password"
OTP_VERIFIED_RESPONSE = {"message": "OTP verified", "valid": True}


class UserLogin(BaseModel):
    email: str
    password: str
    role: str = "user"


class UserRegister(BaseModel):
    email: str
    password: str
    name: str = None


class ForgotPassword(BaseModel):
    email: str


class VerifyOTP(BaseModel):
    email: str
    otp: str


class ResetPassword(BaseModel):
    email: str
    new_password: str
    otp: str = None


def _credentials_exception() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=INVALID_CREDENTIALS_DETAIL,
        headers={"WWW-Authenticate": "Bearer"},
    )


def _extract_nested_value(value: Any, key: str) -> Any:
    if isinstance(value, dict):
        return value.get(key)
    return value


def _generic_forgot_password_response() -> dict:
    return {"message": GENERIC_FORGOT_PASSWORD_MESSAGE}


def _get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def _create_token_pair(user_id: int) -> tuple[str, str]:
    access_token = create_access_token(data={"user_id": str(user_id)})
    refresh_token = create_refresh_token(data={"user_id": str(user_id)})
    return access_token, refresh_token


def _load_send_otp_email():
    from app.utils.email_service import send_otp_email

    return send_otp_email


def _load_verify_otp_logic():
    from app.utils.email_service import verify_otp_logic

    return verify_otp_logic


def _load_password_reset_model():
    from app.auth.models import PasswordReset

    return PasswordReset


def _get_latest_unused_password_reset(db: Session, email: str, password_reset_model):
    return (
        db.query(password_reset_model)
        .filter(
            password_reset_model.email == email,
            password_reset_model.is_used == False,
        )
        .order_by(password_reset_model.created_at.desc())
        .first()
    )


def _normalize_utc_naive(value: datetime) -> datetime:
    if getattr(value, "tzinfo", None):
        return value.replace(tzinfo=None)
    return value


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = _credentials_exception()
    try:
        user_id = verify_token(token, credentials_exception)
    except Exception:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user


@router.post("/signup")
def register(user: UserRegister, db: Session = Depends(get_db)):
    try:
        user_exist = _get_user_by_email(db, user.email)
        if user_exist:
            raise HTTPException(status_code=400, detail="User already exists")

        new_user = models.User(
            email=user.email,
            password=hash_password(user.password),
            name=user.name,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        access_token, refresh_token = _create_token_pair(new_user.id)
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {"email": new_user.email, "name": new_user.name},
        }
    except HTTPException:
        raise
    except Exception as exc:
        print(f"SIGNUP ERROR: {exc}")
        raise HTTPException(status_code=500, detail=SIGNUP_FAILED_DETAIL)


@router.post("/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    try:
        print(f"Login attempt for: {user_credentials.email}")
        user = db.query(User).filter(User.email == user_credentials.email).first()
        print(f"User found: {user is not None}")

        if not user:
            print("User not found in database")
            raise HTTPException(status_code=401, detail=INVALID_LOGIN_DETAIL)

        print("Verifying password...")
        password_valid = verify_password(user_credentials.password, user.password)
        print(f"Password valid: {password_valid}")

        if not password_valid:
            print("Password verification failed")
            raise HTTPException(status_code=401, detail=INVALID_LOGIN_DETAIL)

        access_token, refresh_token = _create_token_pair(user.id)
        print(f"Login successful for user: {user.email}")
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": getattr(user, "full_name", "User") or getattr(user, "name", "User"),
            },
        }
    except HTTPException as http_ex:
        raise http_ex
    except Exception as exc:
        print(f"Login error: {exc}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/forgot-password")
def forgot_password(request: ForgotPassword, db: Session = Depends(get_db)):
    email_val = _extract_nested_value(request.email, "email")

    if not email_val or not isinstance(email_val, str):
        print(f"forgot-password received invalid payload: {request}")
        return _generic_forgot_password_response()

    user = _get_user_by_email(db, email_val)
    if not user:
        return _generic_forgot_password_response()

    try:
        send_otp_email = _load_send_otp_email()
        PasswordReset = _load_password_reset_model()

        otp = send_otp_email(user.email)
        pr = PasswordReset(email=user.email, otp=str(otp))
        db.add(pr)
        db.commit()

        print(f"Password reset OTP created and email queued for {user.email}")
        return _generic_forgot_password_response()
    except Exception as exc:
        print(f"Forgot-password error: {exc}")
        return _generic_forgot_password_response()


@router.post("/verify-otp")
def verify_otp_endpoint(request: VerifyOTP, db: Session = Depends(get_db)):
    verify_otp_logic = _load_verify_otp_logic()
    PasswordReset = _load_password_reset_model()

    email_val = _extract_nested_value(request.email, "email")
    otp_val = _extract_nested_value(request.otp, "otp")

    if not email_val or not otp_val:
        raise HTTPException(status_code=400, detail=INVALID_OTP_DETAIL)

    if verify_otp_logic(email_val, otp_val):
        return OTP_VERIFIED_RESPONSE

    pr = _get_latest_unused_password_reset(db, email_val, PasswordReset)
    if pr and pr.otp == otp_val:
        return OTP_VERIFIED_RESPONSE

    raise HTTPException(status_code=400, detail=INVALID_OTP_DETAIL)


@router.post("/reset-password")
def reset_password(request: ResetPassword, db: Session = Depends(get_db)):
    try:
        masked_new_password = "***" if request.new_password else None
        print(
            "Reset-password request payload: "
            f"email={request.email}, otp={request.otp}, new_password={masked_new_password}"
        )
    except Exception:
        print(f"Reset-password request payload parsing failed: {request}")

    if not request.otp:
        raise HTTPException(status_code=400, detail=OTP_REQUIRED_DETAIL)

    user = _get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND_DETAIL)

    verify_otp_logic = _load_verify_otp_logic()
    PasswordReset = _load_password_reset_model()
    from app.config import settings

    try:
        valid = verify_otp_logic(request.email, request.otp)

        if not valid:
            pr = _get_latest_unused_password_reset(db, request.email, PasswordReset)
            if not pr or pr.otp != request.otp:
                raise HTTPException(status_code=400, detail=INVALID_OR_EXPIRED_OTP_DETAIL)

            expiry_minutes = getattr(settings, "OTP_EXPIRY_MINUTES", 15)
            pr_time = pr.created_at
            if pr_time is None:
                raise HTTPException(status_code=400, detail=INVALID_OR_EXPIRED_OTP_DETAIL)

            pr_time = _normalize_utc_naive(pr_time)
            now = datetime.utcnow()
            if pr_time < (now - timedelta(minutes=expiry_minutes)):
                raise HTTPException(status_code=400, detail=INVALID_OR_EXPIRED_OTP_DETAIL)

            pr.is_used = True
            db.add(pr)

        user.password = hash_password(request.new_password)
        db.commit()
        return {"message": "Password reset successfully"}
    except HTTPException as http_ex:
        raise http_ex
    except Exception as exc:
        print(f"Reset-password error: {exc}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=RESET_FAILED_DETAIL)


@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": getattr(current_user, "full_name", None) or getattr(current_user, "name", None),
        "email": current_user.email,
        "kyc_status": getattr(current_user, "kyc_status", "unverified"),
    }
