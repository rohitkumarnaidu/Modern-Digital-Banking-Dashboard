from datetime import date

from sqlalchemy.orm import Query, Session

from app.models.transaction import Transaction
from app.models.user import User


def _admin_transaction_base_query(db: Session) -> Query:
    return (
        db.query(
            Transaction.id,
            User.name.label("user_name"),
            User.email,
            Transaction.txn_type,
            Transaction.amount,
            Transaction.category,
            Transaction.txn_date,
        )
        .join(User, User.id == Transaction.user_id)
        .order_by(Transaction.txn_date.desc())
    )


def _apply_admin_transaction_filters(
    query: Query,
    *,
    category: str | None,
    txn_type: str | None,
    start_date: date | None,
    end_date: date | None,
) -> Query:
    if category:
        query = query.filter(Transaction.category == category)
    if txn_type:
        query = query.filter(Transaction.txn_type == txn_type)
    if start_date:
        query = query.filter(Transaction.txn_date >= start_date)
    if end_date:
        query = query.filter(Transaction.txn_date <= end_date)
    return query


def fetch_admin_transactions(
    db: Session,
    category: str | None = None,
    txn_type: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
):
    query = _admin_transaction_base_query(db)
    query = _apply_admin_transaction_filters(
        query,
        category=category,
        txn_type=txn_type,
        start_date=start_date,
        end_date=end_date,
    )
    return query.all()
