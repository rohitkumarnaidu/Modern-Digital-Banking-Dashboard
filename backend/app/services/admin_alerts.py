from sqlalchemy.orm import Query, Session

from app.models.alert import Alert
from app.models.audit_log import AuditLog
from app.models.user import User


def _admin_alerts_base_query(db: Session) -> Query:
    return (
        db.query(Alert, User)
        .join(User, Alert.user_id == User.id)
        .order_by(Alert.created_at.desc())
    )


def _admin_logs_base_query(db: Session) -> Query:
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc())


def _serialize_alert_item(alert: Alert, user: User) -> dict:
    return {
        "created_at": alert.created_at,
        "user_name": user.name,
        "type": alert.type,
        "message": alert.message,
    }


def _serialize_log_item(log: AuditLog) -> dict:
    return {
        "timestamp": log.timestamp,
        "admin_name": log.admin_name,
        "action": log.action,
        "target_type": log.target_type,
        "target_id": log.target_id,
        "details": log.details,
    }


def fetch_admin_alerts(db: Session, alert_type: str | None = None):
    query = _admin_alerts_base_query(db)
    if alert_type:
        query = query.filter(Alert.type == alert_type)

    return {
        "items": [_serialize_alert_item(alert, user) for alert, user in query.all()]
    }


def fetch_admin_logs(db: Session, action: str | None = None):
    query = _admin_logs_base_query(db)
    if action:
        query = query.filter(AuditLog.action == action)

    return {
        "items": [_serialize_log_item(log) for log in query.all()]
    }
