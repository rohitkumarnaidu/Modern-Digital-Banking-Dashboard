from datetime import date, datetime, timedelta

from sqlalchemy import case, func
from sqlalchemy.orm import Query, Session

from app.models.account import Account
from app.models.transaction import Transaction, TransactionType

DEFAULT_CATEGORY = "Others"
DEFAULT_DAILY_INSIGHT_DAYS = 15


def _user_transactions_query(db: Session, user_id: int) -> Query:
    return db.query(Transaction).filter(Transaction.user_id == user_id)


def _debit_transactions_query(db: Session, user_id: int) -> Query:
    return _user_transactions_query(db, user_id).filter(Transaction.txn_type == TransactionType.debit)


def _monthly_debit_transactions_query(db: Session, user_id: int, month: int, year: int) -> Query:
    return _debit_transactions_query(db, user_id).filter(
        func.extract("month", Transaction.txn_date) == month,
        func.extract("year", Transaction.txn_date) == year,
    )


def _daily_aggregate_rows(db: Session, user_id: int, start_date: datetime):
    return (
        db.query(
            func.date(Transaction.txn_date).label("date"),
            func.sum(
                case(
                    (Transaction.txn_type == "credit", Transaction.amount),
                    else_=0,
                )
            ).label("income"),
            func.sum(
                case(
                    (Transaction.txn_type == "debit", Transaction.amount),
                    else_=0,
                )
            ).label("expense"),
        )
        .join(Account, Account.id == Transaction.account_id)
        .filter(
            Account.user_id == user_id,
            Transaction.txn_date >= start_date,
        )
        .group_by(func.date(Transaction.txn_date))
        .order_by(func.date(Transaction.txn_date))
        .all()
    )


def _days_window(days: int) -> list[date]:
    today = date.today()
    return [today - timedelta(days=i) for i in reversed(range(days))]


def _rows_to_daily_data_map(rows) -> dict:
    return {
        row.date: {
            "income": float(row.income or 0),
            "expense": float(row.expense or 0),
        }
        for row in rows
    }


def get_insights_summary(db: Session, user_id: int):
    income = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter(
            Transaction.user_id == user_id,
            Transaction.txn_type == TransactionType.credit,
        )
        .scalar()
    )

    expense = (
        db.query(func.coalesce(func.sum(Transaction.amount), 0))
        .filter(
            Transaction.user_id == user_id,
            Transaction.txn_type == TransactionType.debit,
        )
        .scalar()
    )

    return {
        "total_income": float(income),
        "total_expense": float(expense),
        "savings": float(income - expense),
    }


def get_monthly_spending(db: Session, user_id: int, month: int, year: int):
    rows = (
        _monthly_debit_transactions_query(db, user_id, month, year)
        .with_entities(
            Transaction.txn_date.label("date"),
            func.coalesce(func.sum(Transaction.amount), 0).label("amount"),
        )
        .group_by(Transaction.txn_date)
        .order_by(Transaction.txn_date)
        .all()
    )

    return [{"date": str(row.date), "amount": float(row.amount)} for row in rows]


def get_category_breakdown(db: Session, user_id: int, month: int, year: int):
    rows = (
        _monthly_debit_transactions_query(db, user_id, month, year)
        .with_entities(
            Transaction.category,
            func.coalesce(func.sum(Transaction.amount), 0).label("amount"),
        )
        .group_by(Transaction.category)
        .all()
    )

    return [
        {
            "category": row.category or DEFAULT_CATEGORY,
            "amount": float(row.amount),
        }
        for row in rows
    ]


def get_dashboard_daily_insights(db: Session, user_id: int, days: int = DEFAULT_DAILY_INSIGHT_DAYS):
    start_date = datetime.utcnow() - timedelta(days=days)
    rows = _daily_aggregate_rows(db, user_id, start_date)
    data_map = _rows_to_daily_data_map(rows)

    result = []
    for day in _days_window(days):
        entry = data_map.get(day, {"income": 0, "expense": 0})
        result.append(
            {
                "date": day.isoformat(),
                "income": entry["income"],
                "expense": entry["expense"],
            }
        )
    return result
