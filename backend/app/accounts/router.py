"""
Accounts Router

What:
- API endpoints for bank accounts
- Create, fetch user accounts

Backend Connections:
- Uses:
  - Account model
  - account service
  - auth dependency

Frontend Connections:
- AddAccount.jsx -> POST /accounts
- Accounts.jsx -> GET /accounts
- SendMoney.jsx -> account dropdown

Important:
- Transaction PIN is created here
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.accounts.schemas import AccountCreate, AccountDelete, AccountResponse, ChangePinSchema
from app.accounts.service import create_account, delete_account_with_pin, get_user_accounts
from app.database import get_db
from app.dependencies import get_current_user
from app.models.account import Account
from app.models.user import User
from app.utils.hashing import Hash

router = APIRouter(prefix="/accounts", tags=["Accounts"])

PIN_DIGITS_ONLY_DETAIL = "PIN must contain only digits"
PIN_4_DIGITS_DETAIL = "PIN must be a 4-digits"
ACCOUNT_NOT_FOUND_DETAIL = "Account not found"


def _require_numeric_pin(pin: str) -> None:
    if not pin.isdigit():
        raise HTTPException(status_code=400, detail=PIN_DIGITS_ONLY_DETAIL)


def _require_4_digit_pin(pin: str) -> None:
    if not pin.isdigit() or len(pin) != 4:
        raise HTTPException(status_code=400, detail=PIN_4_DIGITS_DETAIL)


def _get_user_account(db: Session, account_id: int, user_id: int) -> Account | None:
    return (
        db.query(Account)
        .filter(Account.id == account_id, Account.user_id == user_id)
        .first()
    )


@router.post("", response_model=AccountResponse, status_code=status.HTTP_201_CREATED)
def create_user_account(
    account: AccountCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_numeric_pin(account.pin)
    return create_account(db, current_user, account)


@router.get("", response_model=List[AccountResponse])
def list_user_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_accounts(db, current_user)


@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_account(
    account_id: int,
    payload: AccountDelete,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_numeric_pin(payload.pin)
    delete_account_with_pin(
        db=db,
        user=current_user,
        account_id=account_id,
        pin=payload.pin,
    )


@router.post("/change-pin")
def change_pin(
    data: ChangePinSchema,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _require_4_digit_pin(data.new_pin)
    account = _get_user_account(db, data.account_id, current_user.id)
    if not account:
        raise HTTPException(status_code=404, detail=ACCOUNT_NOT_FOUND_DETAIL)

    account.pin = Hash.bcrypt(data.new_pin)
    db.commit()
    return {"message": "PIN updated successfully"}
