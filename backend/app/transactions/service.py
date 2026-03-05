"""
Transaction Service

What:
- Core transaction logic
- Validates account
- Enforces budget limits
- Creates transaction record
- Updates account balance
- Updates budget spent amount

Backend Connections:
- Called by transactions.router
- Uses Account, Transaction, Budget models
"""

from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.alerts.utils import notify_transaction
from app.budgets.models import Budget
from app.models.account import Account
from app.models.transaction import Transaction, TransactionType
from app.models.user_settings import UserSettings
from app.transactions.schemas import TransactionCreate

BUDGET_EXCEEDED_DETAIL = "Budget limit exceeded for this category"
DEFAULT_TRANSACTION_CATEGORY = "Others"


def _get_user_account(db: Session, user_id: int, account_id: int):
    return db.query(Account).filter(Account.id == account_id, Account.user_id == user_id).first()


def _current_utc_datetime() -> datetime:
    return datetime.utcnow()


def _get_current_month_year() -> tuple[int, int]:
    now = _current_utc_datetime()
    return now.month, now.year


def _get_active_budget(db: Session, user_id: int, category: str):
    month, year = _get_current_month_year()
    return (
        db.query(Budget)
        .filter(
            Budget.user_id == user_id,
            Budget.category == category,
            Budget.month == month,
            Budget.year == year,
            Budget.is_active == True,
        )
        .first()
    )


def _validate_budget_limit(budget: Budget | None, amount: float) -> None:
    if budget and budget.spent_amount + amount > budget.limit_amount:
        raise HTTPException(status_code=400, detail=BUDGET_EXCEEDED_DETAIL)


def _transaction_date(txn_date):
    return txn_date or datetime.now(timezone.utc).date()


def _apply_balance_update(account: Account, txn_type: TransactionType, amount: float) -> None:
    if txn_type == TransactionType.debit:
        account.balance -= amount
    else:
        account.balance += amount


def _get_user_settings(db: Session, user_id: int):
    return db.query(UserSettings).filter(UserSettings.user_id == user_id).first()


def _transaction_alert_message(txn_type: TransactionType, amount: float) -> str:
    if txn_type == TransactionType.credit:
        return f"₹{amount} credited to your account"
    return f"₹{amount} debited from your account"


def _notify_if_enabled(
    *,
    db: Session,
    user_id: int,
    settings: UserSettings | None,
    txn_type: TransactionType,
    amount: float,
) -> None:
    if not settings:
        return
    notify_transaction(
        db=db,
        user_id=user_id,
        settings=settings,
        message=_transaction_alert_message(txn_type, amount),
    )


def create_transaction(
    db: Session,
    user_id: int,
    data: TransactionCreate,
):
    account = _get_user_account(db, user_id, data.account_id)
    if not account:
        return None

    category = detect_transaction_category(data.description)
    if data.txn_type == TransactionType.debit:
        budget = _get_active_budget(db, user_id, category)
        _validate_budget_limit(budget, data.amount)

    transaction = Transaction(
        user_id=user_id,
        account_id=data.account_id,
        amount=data.amount,
        txn_type=data.txn_type,
        category=category,
        description=data.description,
        txn_date=_transaction_date(data.txn_date),
    )
    _apply_balance_update(account, data.txn_type, data.amount)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    if data.txn_type == TransactionType.debit:
        update_budget_on_transaction(
            db=db,
            user_id=user_id,
            category=category,
            amount=data.amount,
        )

    settings = _get_user_settings(db, user_id)
    _notify_if_enabled(
        db=db,
        user_id=user_id,
        settings=settings,
        txn_type=data.txn_type,
        amount=data.amount,
    )
    return transaction


def update_budget_on_transaction(
    db: Session,
    user_id: int,
    category: str,
    amount: float,
):
    budget = _get_active_budget(db, user_id, category)
    if budget:
        budget.spent_amount += amount
        db.commit()


def get_account_transactions(
    db: Session,
    user_id: int,
    account_id: int,
):
    return (
        db.query(Transaction)
        .join(Account)
        .filter(Transaction.account_id == account_id, Account.user_id == user_id)
        .order_by(Transaction.txn_date.desc())
        .all()
    )


def detect_transaction_category(description: str):
    desc = description.lower()

    if "food" in desc or "restaurant" in desc or "hotel" in desc:
        return "Food"
    if "uber" in desc or "ola" in desc:
        return "Travel"
    if "electricity" in desc or "bill" in desc:
        return "Bills"
    return DEFAULT_TRANSACTION_CATEGORY
