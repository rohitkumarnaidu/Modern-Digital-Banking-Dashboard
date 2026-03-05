from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.hashing import Hash

ADMIN_NOT_FOUND_DETAIL = "Admin not found"
CURRENT_PASSWORD_INVALID_DETAIL = "Current password is incorrect"


def _get_admin_or_404(db: Session, admin_id: int):
    admin = db.query(User).filter(User.id == admin_id, User.is_admin == True).first()
    if not admin:
        raise HTTPException(status_code=404, detail=ADMIN_NOT_FOUND_DETAIL)
    return admin


def get_admin_profile(db: Session, admin_id: int):
    return _get_admin_or_404(db, admin_id)


def update_admin_profile(db: Session, admin_id: int, name: str, phone: str | None):
    admin = _get_admin_or_404(db, admin_id)
    admin.name = name
    admin.phone = phone
    db.commit()
    db.refresh(admin)
    return admin


def change_admin_password(
    db: Session,
    admin_id: int,
    current_password: str,
    new_password: str,
):
    admin = _get_admin_or_404(db, admin_id)

    if not Hash.verify(current_password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=CURRENT_PASSWORD_INVALID_DETAIL,
        )

    admin.password = Hash.hash(new_password)
    db.commit()
    return {"message": "Password updated successfully"}
