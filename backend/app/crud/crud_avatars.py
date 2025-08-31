# en backend/app/crud/crud_avatars.py
from sqlalchemy.orm import Session
from .. import models, schemas

def get_avatars_by_patient(db: Session, patient_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.PatientAvatar)
        .filter(models.PatientAvatar.patient_id == patient_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def create_patient_avatar(db: Session, avatar: schemas.AvatarCreate, patient_id: int):
    db_avatar = models.PatientAvatar(**avatar.model_dump(), patient_id=patient_id)
    db.add(db_avatar)
    db.commit()
    db.refresh(db_avatar)
    return db_avatar
