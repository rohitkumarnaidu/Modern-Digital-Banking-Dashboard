from fastapi import HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Query, Session

from app.models.user import User

USER_NOT_FOUND_DETAIL = "User not found"


def _non_admin_users_query(db: Session) -> Query:
    return db.query(User).filter(User.is_admin == False)


def _apply_user_search_filter(query: Query, search: str | None) -> Query:
    if not search:
        return query
    return query.filter(
        or_(
            User.name.ilike(f"%{search}%"),
            User.email.ilike(f"%{search}%"),
        )
    )


def _apply_kyc_filter(query: Query, kyc_status: str | None) -> Query:
    if not kyc_status:
        return query
    return query.filter(User.kyc_status == kyc_status)


def _get_user_or_404(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail=USER_NOT_FOUND_DETAIL)
    return user


def get_all_users(
    db: Session,
    search: str | None = None,
    kyc_status: str | None = None,
):
    query = _non_admin_users_query(db)
    query = _apply_user_search_filter(query, search)
    query = _apply_kyc_filter(query, kyc_status)
    return query.order_by(User.created_at.desc()).all()


def get_user_by_id(db: Session, user_id: int):
    return _get_user_or_404(db, user_id)


def update_user_kyc(
    db: Session,
    user_id: int,
    status: str,
):
    user = _get_user_or_404(db, user_id)
    user.kyc_status = status
    db.commit()
    db.refresh(user)
    return user
