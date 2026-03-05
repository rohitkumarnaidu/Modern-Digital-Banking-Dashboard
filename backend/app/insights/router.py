from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.insights import service
from app.insights.schemas import CategoryBreakdownItem, InsightsSummary, MonthlySpendingItem
from app.models.user import User

router = APIRouter(prefix="/insights", tags=["Insights"])


def _user_id(current_user: User) -> int:
    return current_user.id


@router.get("/summary", response_model=InsightsSummary)
def insights_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_insights_summary(db, _user_id(current_user))


@router.get("/monthly", response_model=list[MonthlySpendingItem])
def monthly_spending(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_monthly_spending(db, _user_id(current_user), month, year)


@router.get("/categories", response_model=list[CategoryBreakdownItem])
def category_breakdown(
    month: int,
    year: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_category_breakdown(db, _user_id(current_user), month, year)


@router.get("/dashboard/daily")
def dashboard_daily_insights(
    days: int = 15,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_dashboard_daily_insights(db, _user_id(current_user), days)
