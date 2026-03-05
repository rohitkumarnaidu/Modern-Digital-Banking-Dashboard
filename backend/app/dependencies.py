"""
Shared route dependencies.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.utils.jwt import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def _credentials_exception(detail: str = "Could not validate credentials") -> HTTPException:
    return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)


def _decode_valid_access_payload(token: str) -> dict:
    try:
        payload = decode_access_token(token)
    except Exception as exc:
        raise _credentials_exception() from exc

    if payload.get("type") != "access":
        raise _credentials_exception("Invalid token type")

    return payload


def _get_user_id_from_payload(payload: dict) -> int:
    subject = payload.get("sub")
    if subject is None:
        raise _credentials_exception()

    try:
        return int(subject)
    except (TypeError, ValueError) as exc:
        raise _credentials_exception() from exc


def _get_user_or_401(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise _credentials_exception("User not found")
    return user


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    payload = _decode_valid_access_payload(token)
    user_id = _get_user_id_from_payload(payload)
    return _get_user_or_401(db, user_id)


def get_current_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
