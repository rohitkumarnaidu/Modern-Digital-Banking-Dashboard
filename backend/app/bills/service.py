"""
Bills Service

What:
- Handles bill & recharge payments
- Reuses existing transaction engine
- Applies bill categories
- Performs strict validation
"""

from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.bills.categories import BILL_CATEGORIES
from app.bills.schemas import BillCreate, BillUpdate
from app.models.account import Account
from app.models.bill import Bill
from app.models.transaction import TransactionType
from app.rewards.service import add_reward_points
from app.transactions.schemas import TransactionCreate
from app.transactions.service import create_transaction
from app.utils.hashing import Hash

INVALID_BILL_TYPE_DETAIL = "Invalid bill type"
ACCOUNT_NOT_FOUND_DETAIL = "Account not found"
INVALID_PIN_DETAIL = "Invalid PIN"
INSUFFICIENT_BALANCE_DETAIL = "Insufficient balance"
TRANSACTION_FAILED_DETAIL = "Transaction failed"
BILL_NOT_FOUND_DETAIL = "Bill not found"
REWARD_POINTS_FOR_BILL_PAYMENT = 5


def _get_bill_meta(bill_type: str):
    if bill_type not in BILL_CATEGORIES:
        raise HTTPException(status_code=400, detail=INVALID_BILL_TYPE_DETAIL)
    return BILL_CATEGORIES[bill_type]


def _get_user_account(db: Session, user_id: int, account_id: int):
    return db.query(Account).filter(Account.id == account_id, Account.user_id == user_id).first()


def _validate_account_pin(account: Account, pin: str) -> None:
    if not Hash.verify(account.pin_hash, pin):
        raise HTTPException(status_code=400, detail=INVALID_PIN_DETAIL)


def _validate_account_balance(account: Account, amount: float) -> None:
    if account.balance < amount:
        raise HTTPException(status_code=400, detail=INSUFFICIENT_BALANCE_DETAIL)


def _build_bill_transaction_description(
    *,
    base_description: str,
    provider: str | None,
    reference_id: str,
) -> str:
    description = base_description
    if provider:
        description += f" | Provider: {provider}"
    description += f" | Ref: {reference_id}"
    return description


def _build_bill_transaction_payload(data, bill_meta: dict) -> TransactionCreate:
    return TransactionCreate(
        account_id=data.account_id,
        amount=data.amount,
        txn_type=TransactionType.debit,
        description=_build_bill_transaction_description(
            base_description=bill_meta["description"],
            provider=data.provider,
            reference_id=data.reference_id,
        ),
        txn_date=date.today(),
        category=bill_meta["category"],
    )


def _mark_bill_paid_if_exists(db: Session, *, bill_id: int | None, user_id: int) -> None:
    if not bill_id:
        return
    bill = db.query(Bill).filter(Bill.id == bill_id, Bill.user_id == user_id).first()
    if bill:
        bill.status = "paid"
        db.commit()


def _bill_to_dict_data(data: BillUpdate) -> dict:
    if hasattr(data, "model_dump"):
        return data.model_dump(exclude_unset=True)
    return data.dict(exclude_unset=True)


def _get_user_bill(db: Session, bill_id: int, user_id: int):
    return db.query(Bill).filter(Bill.id == bill_id, Bill.user_id == user_id).first()


def pay_bill(db: Session, current_user, data):
    bill_meta = _get_bill_meta(data.bill_type)

    account = _get_user_account(db, current_user.id, data.account_id)
    if not account:
        raise HTTPException(status_code=404, detail=ACCOUNT_NOT_FOUND_DETAIL)

    _validate_account_pin(account, data.pin)
    _validate_account_balance(account, data.amount)

    txn_data = _build_bill_transaction_payload(data, bill_meta)
    transaction = create_transaction(db, current_user.id, txn_data)
    if not transaction:
        raise HTTPException(status_code=500, detail=TRANSACTION_FAILED_DETAIL)

    add_reward_points(
        db=db,
        user_id=current_user.id,
        program_name=f"{data.bill_type.title()} Rewards",
        points=REWARD_POINTS_FOR_BILL_PAYMENT,
    )
    _mark_bill_paid_if_exists(db, bill_id=data.bill_id, user_id=current_user.id)
    return transaction


def create_bill(db: Session, user_id: int, data: BillCreate):
    bill = Bill(
        user_id=user_id,
        biller_name=data.biller_name,
        due_date=data.due_date,
        amount_due=data.amount_due,
        account_id=data.account_id,
        auto_pay=data.auto_pay,
    )
    db.add(bill)
    db.commit()
    db.refresh(bill)
    return bill


def get_user_bills(db: Session, user_id: int):
    return db.query(Bill).filter(Bill.user_id == user_id).all()


def update_bill(db: Session, bill_id: int, user_id: int, data: BillUpdate):
    bill = _get_user_bill(db, bill_id, user_id)
    if not bill:
        raise HTTPException(status_code=404, detail=BILL_NOT_FOUND_DETAIL)

    for key, value in _bill_to_dict_data(data).items():
        setattr(bill, key, value)

    db.commit()
    db.refresh(bill)
    return bill


def delete_bill(db: Session, bill_id: int, user_id: int):
    bill = _get_user_bill(db, bill_id, user_id)
    if not bill:
        raise HTTPException(status_code=404, detail=BILL_NOT_FOUND_DETAIL)

    db.delete(bill)
    db.commit()
