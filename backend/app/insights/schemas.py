from pydantic import BaseModel


class InsightsSummary(BaseModel):
    total_income: float
    total_expense: float
    savings: float


class MonthlySpendingItem(BaseModel):
    date: str
    amount: float


class CategoryBreakdownItem(BaseModel):
    category: str
    amount: float
