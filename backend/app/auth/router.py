import logging
import traceback
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.schemas import ForgotPasswordRequest, VerifyOtpSchema
from app.auth.service import authenticate_user, send_otp
from app.database import get_db
from app.models.otp import OTP
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.utils.hashing import Hash
from app.utils.jwt import create_access_token, create_refresh_token

router = APIRouter(prefix="/auth", tags=["Auth"])
logger = logging.getLogger("uvicorn.error")

REFRESH_COOKIE_NAME = "refresh_token"
REFRESH_COOKIE_PARAMS = {
    "httponly": True,
    "samesite": "lax",
    "secure": False,
}
MISSING_CREDENTIALS_DETAIL = "Missing credentials"
INVALID_CREDENTIALS_DETAIL = "Invalid credentials"


def _make_user_dict(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": getattr(user, "phone", None),
        "is_admin": user.is_admin,
    }


def _issue_token_pair(user_id: int) -> tuple[str, str]:
    return create_access_token(subject=user_id), create_refresh_token(subject=user_id)


def _set_refresh_cookie(response: JSONResponse, refresh_token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        **REFRESH_COOKIE_PARAMS,
    )


def _build_auth_response(user: User, access_token: str, refresh_token: str) -> JSONResponse:
    response = JSONResponse(content={"access_token": access_token, "user": _make_user_dict(user)})
    _set_refresh_cookie(response, refresh_token)
    return response


def _require_credentials(identifier: str | None, password: str | None) -> tuple[str, str]:
    if not identifier or not password:
        raise HTTPException(status_code=400, detail=MISSING_CREDENTIALS_DETAIL)
    return identifier, password


def _send_otp_response(db: Session, email: str, message: str) -> dict:
    send_otp(db, email)
    return {"message": message}


@router.post("/register", response_model=UserResponse, status_code=201)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        if db.query(User).filter(User.email == user.email).first():
            raise HTTPException(status_code=400, detail="Email already registered")

        new_user = User(
            name=user.name,
            email=user.email,
            password=Hash.bcrypt(user.password),
        )

        for attr in ("phone", "dob", "address", "pin_code", "kyc_status"):
            if hasattr(user, attr) and getattr(user, attr, None) is not None:
                setattr(new_user, attr, getattr(user, attr))

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email conflict")
    except Exception as exc:
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/login")
def login_oauth(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    result = authenticate_user(db, form_data.username, form_data.password)

    if not result or isinstance(result, dict):
        raise HTTPException(status_code=401, detail=INVALID_CREDENTIALS_DETAIL)

    access_token = create_access_token(subject=result.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": _make_user_dict(result),
    }


@router.post("/login/cookie")
def login_cookie(payload: dict, db: Session = Depends(get_db)):
    identifier, password = _require_credentials(payload.get("identifier"), payload.get("password"))
    result = authenticate_user(db, identifier, password)

    if result is None:
        raise HTTPException(status_code=401, detail=INVALID_CREDENTIALS_DETAIL)

    if isinstance(result, dict) and result.get("otp_required"):
        return {
            "otp_required": True,
            "user_id": result["user_id"],
            "message": "OTP sent to registered email",
        }

    access_token, refresh_token = _issue_token_pair(result.id)
    return _build_auth_response(result, access_token, refresh_token)


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return _send_otp_response(db, data.email, "OTP sent")


@router.post("/verify-otp")
def verify_otp(data: VerifyOtpSchema, db: Session = Depends(get_db)):
    otp = db.query(OTP).filter(OTP.identifier == data.email, OTP.otp == data.otp).first()
    if not otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if otp.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired")

    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(otp)
    db.commit()

    access_token, refresh_token = _issue_token_pair(user.id)
    return _build_auth_response(user, access_token, refresh_token)


@router.post("/resend-login-otp")
def resend_login_otp(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    return _send_otp_response(db, data.email, "OTP resent")


@router.post("/resend-pin-otp")
def resend_pin_otp(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    return _send_otp_response(db, data.email, "OTP resent for PIN change")
