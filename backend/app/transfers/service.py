from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.account import Account
from app.models.transaction import Transaction, TransactionType
from app.models.user import User
from app.transactions.service import update_budget_on_transaction
from app.transfers.schemas import TransferCreate
from app.utils.hashing import Hash

SENDER_NOT_FOUND_DETAIL = "Sender account not found"
INVALID_PIN_DETAIL = "Invalid PIN"
INSUFFICIENT_BALANCE_DETAIL = "Insufficient balance"
ACCOUNT_NUMBER_REQUIRED_DETAIL = "Account number required"
RECEIVER_NOT_FOUND_DETAIL = "Receiver account not found"
TARGET_ACCOUNT_REQUIRED_DETAIL = "Target account required"
TARGET_ACCOUNT_NOT_FOUND_DETAIL = "Target account not found"
SAME_ACCOUNT_TRANSFER_DETAIL = "Cannot transfer to same account"
UPI_ID_REQUIRED_DETAIL = "UPI ID required"
INVALID_UPI_DETAIL = "Invalid UPI ID or Mobile Number"
INVALID_TRANSFER_TYPE_DETAIL = "Invalid transfer type"
TRANSFER_SUCCESS_MESSAGE = "Transfer completed successfully"
INTERNAL_TRANSFER_TYPES = {"bank", "self"}


def get_transfer_category(transfer_type: str):
    if transfer_type == "upi":
        return "Payments"
    if transfer_type == "bank":
        return "Transfers"
    if transfer_type == "self":
        return "Self Transfer"
    return "Others"


def _get_sender_account(db: Session, user_id: int, from_account_id: int):
    return db.query(Account).filter(Account.id == from_account_id, Account.user_id == user_id).first()


def _validate_sender_pin(sender: Account, pin: str) -> None:
    if not Hash.verify(sender.pin_hash, pin):
        raise HTTPException(status_code=401, detail=INVALID_PIN_DETAIL)


def _validate_sender_balance(sender: Account, amount: float) -> None:
    if sender.balance < amount:
        raise HTTPException(status_code=400, detail=INSUFFICIENT_BALANCE_DETAIL)


def _resolve_bank_receiver(db: Session, to_account_number: str | None):
    if not to_account_number:
        raise HTTPException(status_code=400, detail=ACCOUNT_NUMBER_REQUIRED_DETAIL)

    receiver = db.query(Account).filter(Account.masked_account.like(f"%{to_account_number[-4:]}")).first()
    if not receiver:
        raise HTTPException(status_code=404, detail=RECEIVER_NOT_FOUND_DETAIL)
    return receiver


def _resolve_self_receiver(db: Session, user_id: int, sender: Account, to_account_id: int | None):
    if not to_account_id:
        raise HTTPException(status_code=400, detail=TARGET_ACCOUNT_REQUIRED_DETAIL)

    receiver = db.query(Account).filter(Account.id == to_account_id, Account.user_id == user_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail=TARGET_ACCOUNT_NOT_FOUND_DETAIL)

    if receiver.id == sender.id:
        raise HTTPException(status_code=400, detail=SAME_ACCOUNT_TRANSFER_DETAIL)
    return receiver


def _validate_upi_target(upi_id: str | None) -> None:
    if not upi_id:
        raise HTTPException(status_code=400, detail=UPI_ID_REQUIRED_DETAIL)
    if "@" not in upi_id and not upi_id.isdigit():
        raise HTTPException(status_code=400, detail=INVALID_UPI_DETAIL)


def _apply_transfer_balances(sender: Account, amount: float, receiver: Account | None = None) -> None:
    sender.balance -= amount
    if receiver is not None:
        receiver.balance += amount


def _resolve_transfer_flow(db: Session, user: User, sender: Account, payload: TransferCreate):
    if payload.transfer_type == "bank":
        receiver = _resolve_bank_receiver(db, payload.to_account_number)
        _apply_transfer_balances(sender, payload.amount, receiver)
        return receiver, "Bank transfer sent", "Bank transfer received"

    if payload.transfer_type == "self":
        receiver = _resolve_self_receiver(db, user.id, sender, payload.to_account_id)
        _apply_transfer_balances(sender, payload.amount, receiver)
        return receiver, "Self transfer sent", "Self transfer received"

    if payload.transfer_type == "upi":
        _validate_upi_target(payload.upi_id)
        _apply_transfer_balances(sender, payload.amount)
        return None, f"UPI payment to {payload.upi_id}", None

    raise HTTPException(status_code=400, detail=INVALID_TRANSFER_TYPE_DETAIL)


def _build_debit_transaction(user_id: int, account_id: int, description: str, amount: float, category: str):
    return Transaction(
        user_id=user_id,
        account_id=account_id,
        description=description,
        amount=amount,
        txn_type=TransactionType.debit,
        category=category,
        txn_date=date.today(),
    )


def _build_credit_transaction(user_id: int, account_id: int, description: str, amount: float, category: str):
    return Transaction(
        user_id=user_id,
        account_id=account_id,
        description=description,
        amount=amount,
        txn_type=TransactionType.credit,
        category=category,
        txn_date=date.today(),
    )


def _create_transfer_transactions(
    *,
    db: Session,
    user: User,
    sender: Account,
    receiver: Account | None,
    payload: TransferCreate,
    debit_desc: str,
    credit_desc: str | None,
    category: str,
) -> None:
    db.add(
        _build_debit_transaction(
            user_id=user.id,
            account_id=sender.id,
            description=debit_desc,
            amount=payload.amount,
            category=category,
        )
    )

    if payload.transfer_type in INTERNAL_TRANSFER_TYPES:
        db.add(
            _build_credit_transaction(
                user_id=receiver.user_id,
                account_id=receiver.id,
                description=credit_desc,
                amount=payload.amount,
                category=category,
            )
        )


def send_money(
    db: Session,
    user: User,
    payload: TransferCreate,
):
    sender = _get_sender_account(db, user.id, payload.from_account_id)
    if not sender:
        raise HTTPException(status_code=404, detail=SENDER_NOT_FOUND_DETAIL)

    _validate_sender_pin(sender, payload.pin)
    _validate_sender_balance(sender, payload.amount)

    receiver, debit_desc, credit_desc = _resolve_transfer_flow(db, user, sender, payload)
    category = get_transfer_category(payload.transfer_type)

    _create_transfer_transactions(
        db=db,
        user=user,
        sender=sender,
        receiver=receiver,
        payload=payload,
        debit_desc=debit_desc,
        credit_desc=credit_desc,
        category=category,
    )

    update_budget_on_transaction(
        db=db,
        user_id=user.id,
        category=category,
        amount=payload.amount,
    )
    db.commit()
    return {"status": "success", "message": TRANSFER_SUCCESS_MESSAGE}
