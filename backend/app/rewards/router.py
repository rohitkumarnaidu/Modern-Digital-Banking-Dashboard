from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.rewards.schemas import RewardCreate, RewardResponse
from app.rewards.service import create_reward_program, get_user_rewards
from app.schemas.admin_rewards import AdminRewardResponse
from app.services.admin_rewards import get_active_admin_rewards

router = APIRouter(prefix="/rewards", tags=["Rewards"])


def _normalize_applies_to_csv(applies_to: str | list[str]):
    if isinstance(applies_to, str):
        return applies_to.split(",")
    return applies_to


@router.get("/", response_model=list[RewardResponse])
def list_rewards(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_user_rewards(db, current_user.id)


@router.post("/", response_model=RewardResponse)
def create_reward(
    data: RewardCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return create_reward_program(db, current_user.id, data.program_name)


@router.get("/available", response_model=list[AdminRewardResponse])
def list_available_rewards(
    db: Session = Depends(get_db),
):
    rewards = get_active_admin_rewards(db)
    for reward in rewards:
        reward.applies_to = _normalize_applies_to_csv(reward.applies_to)
    return rewards
