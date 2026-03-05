from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user_device import UserDevice

router = APIRouter(prefix="/devices", tags=["Devices"])


def _get_device_by_token(db: Session, token: str):
    return db.query(UserDevice).filter_by(device_token=token).first()


def _create_user_device(user_id: int, token: str, platform: str | None) -> UserDevice:
    return UserDevice(
        user_id=user_id,
        device_token=token,
        platform=platform,
    )


@router.post("/register")
def register_device(
    payload: dict,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    token = payload.get("device_token")
    platform = payload.get("platform")

    if not token:
        return {"error": "Device token required"}

    existing = _get_device_by_token(db, token)
    if existing:
        return {"message": "Device already registered"}

    db.add(_create_user_device(user.id, token, platform))
    db.commit()
    return {"message": "Device registered successfully"}
