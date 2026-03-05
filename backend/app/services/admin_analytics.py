from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.reward import Reward
from app.models.transaction import Transaction
from app.models.user import KYCStatus, User


def _count_users(db: Session):
    return db.query(func.count(User.id)).scalar()


def _count_users_by_kyc_status(db: Session, status: KYCStatus):
    return db.query(func.count(User.id)).filter(User.kyc_status == status).scalar()


def _count_transactions(db: Session):
    return db.query(func.count(Transaction.id)).scalar()


def _count_rewards(db: Session):
    return db.query(func.count(Reward.id)).scalar()


def get_admin_analytics_summary(db: Session):
    return {
        "totalUsers": _count_users(db),
        "kycApproved": _count_users_by_kyc_status(db, KYCStatus.verified),
        "kycPending": _count_users_by_kyc_status(db, KYCStatus.unverified),
        "kycRejected": _count_users_by_kyc_status(db, KYCStatus.rejected),
        "totalTransactions": _count_transactions(db),
        "rewardsIssued": _count_rewards(db),
    }


def get_top_users_by_activity(db: Session, limit: int = 5):
    results = (
        db.query(
            User.name.label("name"),
            func.count(Transaction.id).label("transaction_count"),
            func.coalesce(func.sum(Transaction.amount), 0).label("total_amount"),
            User.kyc_status.label("kyc_status"),
        )
        .join(Transaction, Transaction.user_id == User.id)
        .group_by(User.id)
        .order_by(func.count(Transaction.id).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "name": row.name,
            "transaction_count": row.transaction_count,
            "total_amount": float(row.total_amount),
            "kyc_status": row.kyc_status.value,
        }
        for row in results
    ]
