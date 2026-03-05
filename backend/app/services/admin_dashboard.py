from datetime import date

from sqlalchemy import Date, cast, func
from sqlalchemy.orm import Session

from app.models.alert import Alert
from app.models.transaction import Transaction
from app.models.user import KYCStatus, User


def _count_users(db: Session):
    return db.query(func.count(User.id)).scalar()


def _count_pending_kyc(db: Session):
    return (
        db.query(func.count(User.id))
        .filter(User.kyc_status == KYCStatus.unverified)
        .scalar()
    )


def _count_today_transactions(db: Session):
    return (
        db.query(func.count(Transaction.id))
        .filter(cast(Transaction.txn_date, Date) == date.today())
        .scalar()
    )


def _count_unread_alerts(db: Session):
    return db.query(func.count(Alert.id)).filter(Alert.is_read == False).scalar()


def get_admin_dashboard_summary(db: Session):
    return {
        "total_users": _count_users(db),
        "kyc_pending": _count_pending_kyc(db),
        "today_transactions": _count_today_transactions(db),
        "active_alerts": _count_unread_alerts(db),
    }
