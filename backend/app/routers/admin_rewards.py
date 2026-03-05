from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.admin_rewards import AdminRewardCreate, AdminRewardResponse
from app.services.admin_rewards import (
    approve_admin_reward,
    create_admin_reward,
    delete_admin_reward,
    get_all_admin_rewards,
)

router = APIRouter(prefix="/admin/rewards", tags=["Admin Rewards"])

REWARD_NOT_FOUND_DETAIL = "Reward not found"


def _split_csv_values(value: str | list[str]) -> list[str]:
    if isinstance(value, str):
        return value.split(",")
    return value


def _normalize_reward_applies_to(reward) -> None:
    reward.applies_to = _split_csv_values(reward.applies_to)


@router.get("/", response_model=list[AdminRewardResponse])
def list_admin_rewards(
    db: Session = Depends(get_db),
):
    rewards = get_all_admin_rewards(db)
    for reward in rewards:
        _normalize_reward_applies_to(reward)
    return rewards


@router.post("/", response_model=AdminRewardResponse)
def add_admin_reward(
    data: AdminRewardCreate,
    db: Session = Depends(get_db),
):
    reward = create_admin_reward(db, data)
    _normalize_reward_applies_to(reward)
    return reward


@router.patch("/{reward_id}/approve")
def approve_reward(
    reward_id: int,
    db: Session = Depends(get_db),
):
    reward = approve_admin_reward(db, reward_id)
    if not reward:
        raise HTTPException(status_code=404, detail=REWARD_NOT_FOUND_DETAIL)
    return {"message": "Reward approved successfully"}


@router.delete("/{reward_id}")
def remove_reward(
    reward_id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_admin_reward(db, reward_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=REWARD_NOT_FOUND_DETAIL)
    return {"message": "Reward deleted successfully"}
