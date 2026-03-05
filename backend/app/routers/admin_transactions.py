import csv
import io
from datetime import date, datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.transaction import Transaction, TransactionType
from app.models.user import User
from app.schemas.admin_transaction import AdminTransactionOut
from app.services.admin_transactions import fetch_admin_transactions

router = APIRouter(prefix="/admin/transactions", tags=["Admin Transactions"])

CSV_FILE_REQUIRED_DETAIL = "Only CSV files are allowed"
CSV_EXPORT_HEADERS = ["User", "Email", "Type", "Amount", "Category", "Date"]


def _validate_csv_file(filename: str) -> None:
    if not filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail=CSV_FILE_REQUIRED_DETAIL)


def _csv_reader_from_upload(file: UploadFile):
    content = file.file.read().decode("utf-8")
    return csv.DictReader(io.StringIO(content))


def _build_imported_transaction(user: User, row: dict) -> Transaction:
    return Transaction(
        user_id=user.id,
        account_id=int(row.get("account_id", 1)),
        description=row.get("description", "Imported Transaction"),
        category=row.get("category", "Imported"),
        merchant=row.get("merchant"),
        amount=float(row.get("amount", 0)),
        currency=row.get("currency", "INR"),
        txn_type=TransactionType(row.get("txn_type", "debit")),
        txn_date=datetime.strptime(row.get("txn_date"), "%Y-%m-%d").date(),
    )


def _export_transactions_csv_content(transactions) -> str:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(CSV_EXPORT_HEADERS)

    for transaction in transactions:
        writer.writerow(
            [
                transaction.user_name,
                transaction.email,
                transaction.txn_type,
                float(transaction.amount),
                transaction.category,
                transaction.txn_date,
            ]
        )
    return output.getvalue()


@router.get("/", response_model=list[AdminTransactionOut])
def get_admin_transactions(
    category: str | None = None,
    txn_type: str | None = None,
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
):
    return fetch_admin_transactions(
        db=db,
        category=category,
        txn_type=txn_type,
        start_date=start_date,
        end_date=end_date,
    )


@router.get("/export")
def export_transactions_csv(db: Session = Depends(get_db)):
    transactions = fetch_admin_transactions(db)
    return {
        "filename": "all_user_transactions.csv",
        "content": _export_transactions_csv_content(transactions),
    }


@router.post("/import")
def import_transactions_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    _validate_csv_file(file.filename)
    reader = _csv_reader_from_upload(file)
    imported = 0

    for row in reader:
        try:
            user = db.query(User).filter(User.email == row.get("email")).first()
            if not user:
                continue

            db.add(_build_imported_transaction(user, row))
            imported += 1
        except Exception:
            continue

    db.commit()
    return {"message": f"{imported} transactions imported successfully"}
