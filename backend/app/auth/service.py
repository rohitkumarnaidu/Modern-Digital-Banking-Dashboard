import random
from datetime import datetime, timedelta
from typing import Iterable

import jwt
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.alerts.service import create_alert
from app.firebase.firebase import send_push_notification
from app.models.otp import OTP
from app.models.user import User
from app.models.user_device import UserDevice
from app.models.user_settings import UserSettings
from app.utils.email_utils import send_email
from app.utils.hashing import Hash
from app.utils.validators import is_strong_password

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "replace_this_with_env_secret"  # move to backend/app/config.py or env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 30
OTP_MIN_VALUE = 100000
OTP_MAX_VALUE = 999999
OTP_EMAIL_SUBJECT = "Your OTP Code"
OTP_EMAIL_BODY_TEMPLATE = "Your OTP is {otp_code}. It is valid for 2 minutes."
LOGIN_ALERT_TITLE = "New Login Alert"
LOGIN_ALERT_BODY = "A new device login to your account was detected."
LOGIN_ALERT_MESSAGE = "New device login detected"


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def _build_user(
    *,
    name: str,
    email: str,
    password: str,
    phone: str | None = None,
    dob=None,
    pin: str | None = None,
    address: str | None = None,
) -> User:
    return User(
        name=name,
        email=email,
        password=hash_password(password),
        phone=phone,
        dob=dob,
        pin_code=pin,
        address=address,
    )


# Basic DB helpers (synchronous for simplicity)
def create_user(
    db_session: Session,
    *,
    name: str,
    email: str,
    password: str,
    phone: str | None = None,
    dob=None,
    pin: str | None = None,
    address: str | None = None,
    kyc_authorize: bool = False,
) -> User:
    user = _build_user(
        name=name,
        email=email,
        password=password,
        phone=phone,
        dob=dob,
        pin=pin,
        address=address,
    )
    try:
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
        return user
    except IntegrityError:
        db_session.rollback()
        raise


def get_user_by_email(db_session: Session, email: str) -> User | None:
    return db_session.query(User).filter(User.email == email).first()


def reset_password(db: Session, email: str, new_password: str) -> bool:
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return False

    # New password must not be same as old password.
    if Hash.verify(user.password, new_password):
        raise ValueError("New password cannot be the same as old password")

    # Password strength validation.
    if not is_strong_password(new_password):
        raise ValueError(
            "Password must be at least 8 characters long and include "
            "uppercase, lowercase, number, and special character"
        )

    user.password = Hash.bcrypt(new_password)
    db.commit()
    return True


def _generate_otp_code() -> str:
    return str(random.randint(OTP_MIN_VALUE, OTP_MAX_VALUE))


def send_otp(db: Session, identifier: str) -> None:
    otp_code = _generate_otp_code()

    otp = OTP(
        identifier=identifier,
        otp=otp_code,
        expires_at=OTP.expiry(),
    )
    db.add(otp)
    db.commit()

    # Email OTP for email-based identifiers.
    if "@" in identifier:
        send_email(
            to_email=identifier,
            subject=OTP_EMAIL_SUBJECT,
            body=OTP_EMAIL_BODY_TEMPLATE.format(otp_code=otp_code),
        )


def _send_login_push_notifications(device_tokens: Iterable[str]) -> None:
    for token in device_tokens:
        try:
            send_push_notification(
                token=token,
                title=LOGIN_ALERT_TITLE,
                body=LOGIN_ALERT_BODY,
            )
        except Exception as exc:
            print("Push notification failed:", exc)


def _load_user_settings(db: Session, user_id: int) -> UserSettings | None:
    return db.query(UserSettings).filter(UserSettings.user_id == user_id).first()


def _get_user_device_tokens(db: Session, user_id: int) -> list[str]:
    rows = db.query(UserDevice.device_token).filter(UserDevice.user_id == user_id).all()
    return [token for (token,) in rows if token]


def _handle_login_alerts(db: Session, user: User, settings: UserSettings) -> None:
    create_alert(
        db=db,
        user_id=user.id,
        alert_type="login",
        message=LOGIN_ALERT_MESSAGE,
    )

    if settings.email_alerts:
        send_email(
            to_email=user.email,
            subject=LOGIN_ALERT_TITLE,
            body=LOGIN_ALERT_BODY,
        )

    _send_login_push_notifications(_get_user_device_tokens(db, user.id))


def _mark_last_login(db: Session, user: User) -> None:
    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)


def authenticate_user(db: Session, identifier: str, password: str):
    user = get_user_by_email(db, identifier)

    if not user or not Hash.verify(user.password, password):
        return None

    # Load settings.
    settings = _load_user_settings(db, user.id)

    # Login alert.
    if settings and settings.login_alerts:
        _handle_login_alerts(db, user, settings)

    # Two-factor auth.
    if settings and settings.two_factor_enabled:
        send_otp(db, user.email)
        return {"otp_required": True, "user_id": user.id}

    _mark_last_login(db, user)
    return user
