from sqlalchemy.orm import Query, Session

from app.models.reward import Reward


def _user_rewards_query(db: Session, user_id: int) -> Query:
    return db.query(Reward).filter(Reward.user_id == user_id)


def _find_reward(db: Session, user_id: int, program_name: str):
    return _user_rewards_query(db, user_id).filter(Reward.program_name == program_name).first()


def get_user_rewards(db: Session, user_id: int):
    return _user_rewards_query(db, user_id).all()


def create_reward_program(
    db: Session,
    user_id: int,
    program_name: str,
):
    reward = Reward(
        user_id=user_id,
        program_name=program_name,
        points_balance=0,
    )
    db.add(reward)
    db.commit()
    db.refresh(reward)
    return reward


def add_reward_points(
    db: Session,
    user_id: int,
    program_name: str,
    points: int,
):
    reward = _find_reward(db, user_id, program_name)
    if not reward:
        reward = Reward(
            user_id=user_id,
            program_name=program_name,
            points_balance=points,
        )
        db.add(reward)
    else:
        reward.points_balance += points

    db.commit()
    db.refresh(reward)
    return reward
