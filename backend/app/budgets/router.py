from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.budgets.schemas import BudgetCreate, BudgetResponse, BudgetUpdate
from app.budgets.service import (
    create_budget,
    delete_budget,
    get_budget_summary,
    get_user_budgets,
    update_budget,
)
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/budgets", tags=["Budgets"])

BUDGET_EXISTS_DETAIL = "Budget already exists for this category and month"
BUDGET_NOT_FOUND_DETAIL = "Budget not found"


def _current_user_id(current_user: User) -> int:
    return current_user.id


@router.post("", response_model=BudgetResponse)
def create_user_budget(
    payload: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = create_budget(db, _current_user_id(current_user), payload)
    if not budget:
        raise HTTPException(status_code=400, detail=BUDGET_EXISTS_DETAIL)
    return budget


@router.get("", response_model=list[BudgetResponse])
def list_user_budgets(
    month: int = Query(...),
    year: int = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_budgets(db, _current_user_id(current_user), month, year)


@router.get("/summary")
def budget_summary(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_budget_summary(db, _current_user_id(current_user), month, year)


@router.patch("/{budget_id}", response_model=BudgetResponse)
def edit_user_budget(
    budget_id: int,
    payload: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = update_budget(db, _current_user_id(current_user), budget_id, payload.limit_amount)
    if not budget:
        raise HTTPException(status_code=404, detail=BUDGET_NOT_FOUND_DETAIL)
    return budget


@router.delete("/{budget_id}")
def remove_user_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    success = delete_budget(db, _current_user_id(current_user), budget_id)
    if not success:
        raise HTTPException(status_code=404, detail=BUDGET_NOT_FOUND_DETAIL)
    return {"status": "success"}
