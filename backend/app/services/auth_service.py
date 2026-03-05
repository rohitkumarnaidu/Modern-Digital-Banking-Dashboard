import jwt
from datetime import datetime, timedelta

from ..config import settings

ALGORITHM = "HS256"


def _encode_token(data: dict, *, secret_key: str, expires_delta: timedelta) -> str:
    to_encode = data.copy()
    to_encode["exp"] = datetime.utcnow() + expires_delta
    return jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)


def create_access_token(data: dict):
    return _encode_token(
        data,
        secret_key=settings.JWT_SECRET_KEY,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(data: dict):
    return _encode_token(
        data,
        secret_key=settings.JWT_REFRESH_SECRET_KEY,
        expires_delta=timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES),
    )
