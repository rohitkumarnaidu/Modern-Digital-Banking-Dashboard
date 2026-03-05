"""
Account Service (Business Logic)

What:
- Handles account creation logic
- Hashes transaction PIN
- Ensures account belongs to user

Backend Connections:
- Called by accounts.router
- Uses Account model & database

Frontend Connections:
- AddAccount.jsx
"""

from fastapi import HTTPException, status
from sqlalchemy.orm import Query, Session

from app.accounts.schemas import AccountCreate
from app.models.account import Account
from app.models.user import User
from app.utils.hashing import Hash

ACCOUNT_ALREADY_ADDED_DETAIL = "Account already added"
ACCOUNT_NOT_FOUND_DETAIL = "Account not found"
INVALID_PIN_DETAIL = "Invalid PIN"


def _last4(account_number: str) -> str:
    return account_number[-4:]


def _active_accounts_query(db: Session, user_id: int) -> Query:
    return db.query(Account).filter(Account.user_id == user_id, Account.is_active == True)


def mask_account_number(account_number: str) -> str:
    """
    Example:
    123456789012 -> XXXX-XXXX-9012
    """
    return f"XXXX-XXXX-{_last4(account_number)}"


def _find_existing_active_account_by_last4(db: Session, user_id: int, account_number: str):
    return (
        _active_accounts_query(db, user_id)
        .filter(Account.masked_account.like(f"%{_last4(account_number)}"))
        .with_entities(Account.id)
        .first()
    )


def create_account(db: Session, user: User, account_data: AccountCreate):
    existing = _find_existing_active_account_by_last4(db, user.id, account_data.account_number)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ACCOUNT_ALREADY_ADDED_DETAIL,
        )

    account = Account(
        user_id=user.id,
        bank_name=account_data.bank_name,
        account_type=account_data.account_type,
        masked_account=mask_account_number(account_data.account_number),
        balance=1000,
        currency="INR",
        pin_hash=Hash.bcrypt(account_data.pin),
    )
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def get_user_accounts(db: Session, user: User):
    return _active_accounts_query(db, user.id).all()


def get_account_by_id(db: Session, user: User, account_id: int):
    return db.query(Account).filter(Account.id == account_id, Account.user_id == user.id).first()


def delete_account(db: Session, user: User, account_id: int):
    account = get_account_by_id(db, user, account_id)
    if not account:
        return False

    db.delete(account)
    db.commit()
    return True


def _get_active_account_for_user(db: Session, user_id: int, account_id: int):
    return _active_accounts_query(db, user_id).filter(Account.id == account_id).first()


def delete_account_with_pin(db: Session, user: User, account_id: int, pin: str):
    account = _get_active_account_for_user(db, user.id, account_id)
    if not account:
        raise HTTPException(status_code=404, detail=ACCOUNT_NOT_FOUND_DETAIL)

    if not Hash.verify(account.pin_hash, pin):
        raise HTTPException(status_code=401, detail=INVALID_PIN_DETAIL)

    account.is_active = False
    db.commit()
    return {"message": "Account removed successfully"}
