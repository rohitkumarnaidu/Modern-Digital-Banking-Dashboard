from fastapi import APIRouter, Depends
from sqlalchemy.orm import Query, Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.alert import Alert
from app.models.user import User

router = APIRouter(prefix="/alerts", tags=["Alerts"])


def _user_alerts_query(db: Session, user_id: int) -> Query:
    return db.query(Alert).filter(Alert.user_id == user_id)


def _unread_alerts_query(db: Session, user_id: int) -> Query:
    return _user_alerts_query(db, user_id).filter(Alert.is_read == False)


@router.get("/")
def get_user_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return _user_alerts_query(db, current_user.id).order_by(Alert.created_at.desc()).all()


@router.get("/notifications")
def get_unread_alert_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return {"count": _unread_alerts_query(db, current_user.id).count()}


@router.post("/mark-read")
def mark_alerts_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _unread_alerts_query(db, current_user.id).update({"is_read": True})
    db.commit()
    return {"message": "Alerts marked as read"}
