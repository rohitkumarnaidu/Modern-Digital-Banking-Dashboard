from sqlalchemy.orm import Query, Session

from app.models.admin_rewards import AdminReward, RewardStatus


def _admin_rewards_query(db: Session) -> Query:
    return db.query(AdminReward)


def _get_reward_by_id(db: Session, reward_id: int):
    return _admin_rewards_query(db).filter(AdminReward.id == reward_id).first()


def _to_csv_applies_to(values: list[str]) -> str:
    return ",".join(values)


def create_admin_reward(db: Session, data):
    reward = AdminReward(
        name=data.name,
        description=data.description,
        reward_type=data.reward_type,
        applies_to=_to_csv_applies_to(data.applies_to),
        value=data.value,
    )
    db.add(reward)
    db.commit()
    db.refresh(reward)
    return reward


def get_all_admin_rewards(db: Session):
    return _admin_rewards_query(db).order_by(AdminReward.created_at.desc()).all()


def approve_admin_reward(db: Session, reward_id: int):
    reward = _get_reward_by_id(db, reward_id)
    if not reward:
        return None

    reward.status = RewardStatus.active
    db.commit()
    db.refresh(reward)
    return reward


def delete_admin_reward(db: Session, reward_id: int):
    reward = _get_reward_by_id(db, reward_id)
    if not reward:
        return False

    db.delete(reward)
    db.commit()
    return True


def get_active_admin_rewards(db: Session):
    return _admin_rewards_query(db).filter(AdminReward.status == RewardStatus.active).all()
