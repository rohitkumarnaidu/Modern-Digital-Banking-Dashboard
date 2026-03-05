from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user_settings import UserSettings

router = APIRouter(prefix="/settings", tags=["Settings"])

SETTINGS_NOT_FOUND_RESPONSE = {"error": "Settings not found"}


class SettingsUpdate(BaseModel):
    push_notifications: bool | None = None
    email_alerts: bool | None = None
    login_alerts: bool | None = None
    two_factor_enabled: bool | None = None


def _get_user_settings(db: Session, user_id: int):
    return db.query(UserSettings).filter_by(user_id=user_id).first()


def _ensure_user_settings(db: Session, user_id: int):
    settings = _get_user_settings(db, user_id)
    if settings:
        return settings

    settings = UserSettings(user_id=user_id)
    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings


def _settings_update_payload(data: SettingsUpdate) -> dict:
    if hasattr(data, "model_dump"):
        return data.model_dump(exclude_unset=True)
    return data.dict(exclude_unset=True)


@router.get("")
def get_settings(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return _ensure_user_settings(db, user.id)


@router.put("")
def update_settings(
    data: SettingsUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    settings = _get_user_settings(db, user.id)
    if not settings:
        return SETTINGS_NOT_FOUND_RESPONSE

    for key, value in _settings_update_payload(data).items():
        setattr(settings, key, value)

    db.commit()
    db.refresh(settings)
    return settings
