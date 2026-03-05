from datetime import datetime, timedelta, timezone
from typing import Union

from jose import JWTError, jwt

from app.config import settings

ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS
ALGORITHM = settings.JWT_ALGORITHM

# Keep existing key semantics for backward compatibility.
JWT_SECRET_KEY = settings.JWT_SECRET_KEY
JWT_REFRESH_SECRET_KEY = settings.JWT_REFRESH_SECRET_KEY


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def _encode_token(
    data: dict,
    *,
    secret_key: str,
    default_expiry: timedelta,
    expires_delta: Union[timedelta, None] = None,
) -> str:
    to_encode = data.copy()
    expire = _now_utc() + (expires_delta or default_expiry)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)


def _decode_access_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])


def _extract_user_id(payload: dict) -> str | None:
    user_id = payload.get("sub")
    if user_id is None:
        user_id = payload.get("user_id")
    return user_id


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None) -> str:
    return _encode_token(
        data,
        secret_key=JWT_SECRET_KEY,
        default_expiry=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        expires_delta=expires_delta,
    )


def create_refresh_token(data: dict, expires_delta: Union[timedelta, None] = None) -> str:
    return _encode_token(
        data,
        secret_key=JWT_REFRESH_SECRET_KEY,
        default_expiry=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        expires_delta=expires_delta,
    )


def verify_token(token: str, credential_exception):
    try:
        payload = _decode_access_token(token)
        user_id = _extract_user_id(payload)
        if user_id is None:
            raise credential_exception
        return user_id
    except JWTError:
        raise credential_exception


def decode_jwt(token: str) -> dict:
    try:
        return _decode_access_token(token)
    except JWTError as exc:
        raise JWTError(f"Invalid token: {exc}")
