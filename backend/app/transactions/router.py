"""
Transactions Router

What:
- Handles money transfers
- Fetches transaction history

Backend Connections:
- Uses:
  - transaction service
  - auth dependency

Frontend Connections:
- SendToUpi.jsx
- SendToSelf.jsx
- SendToBank.jsx
- Transactions.jsx
"""

from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from sqlalchemy.orm import Query as SAQuery, Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.account import Account
from app.models.transaction import Transaction
from app.models.user import User
from app.transactions.csv_import import import_transactions_from_csv
from app.transactions.schemas import TransactionCreate, TransactionResponse
from app.transactions.service import create_transaction, get_account_transactions

router = APIRouter(prefix="/transactions", tags=["Transactions"])


def _base_user_transactions_query(db: Session, user_id: int) -> SAQuery:
    return db.query(Transaction).join(Account).filter(Account.user_id == user_id)


def _apply_transaction_filters(
    query: SAQuery,
    *,
    account_id: Optional[int],
    txn_type: Optional[str],
    from_date: Optional[date],
    to_date: Optional[date],
    search: Optional[str],
) -> SAQuery:
    if account_id:
        query = query.filter(Transaction.account_id == account_id)
    if txn_type:
        query = query.filter(Transaction.txn_type == txn_type)
    if from_date:
        query = query.filter(Transaction.txn_date >= from_date)
    if to_date:
        query = query.filter(Transaction.txn_date <= to_date)
    if search:
        term = f"%{search.lower()}%"
        query = query.filter(Transaction.description.ilike(term))
    return query


@router.post("", response_model=TransactionResponse)
def add_transaction(
    payload: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    transaction = create_transaction(db, current_user.id, payload)
    if not transaction:
        raise HTTPException(status_code=404, detail="Account not found")
    return transaction


@router.get("", response_model=List[TransactionResponse])
def list_transactions(
    account_id: Optional[int] = Query(None),
    txn_type: Optional[str] = Query(None),
    from_date: Optional[date] = Query(None, alias="from"),
    to_date: Optional[date] = Query(None, alias="to"),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = _base_user_transactions_query(db, current_user.id)
    query = _apply_transaction_filters(
        query,
        account_id=account_id,
        txn_type=txn_type,
        from_date=from_date,
        to_date=to_date,
        search=search,
    )
    return query.order_by(Transaction.txn_date.desc()).all()


@router.get("/account/{account_id}", response_model=List[TransactionResponse])
def list_transactions_by_account(
    account_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_account_transactions(db, current_user.id, account_id)


@router.get("/recent")
def recent_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        _base_user_transactions_query(db, current_user.id)
        .order_by(Transaction.txn_date.desc())
        .limit(5)
        .all()
    )


@router.post("/import/csv")
def import_transactions_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    count = import_transactions_from_csv(db, current_user.id, file)
    return {"status": "success", "imported_records": count}
