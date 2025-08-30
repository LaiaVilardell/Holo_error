from sqlalchemy.orm import Session
from .. import models, schemas
from ..core.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        surname=user.surname,
        center=user.center,
        phone=user.phone,
        role=user.role,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def assign_patient_to_therapist(db: Session, therapist_id: int, patient_id: int):
    therapist = db.query(models.User).filter(models.User.id == therapist_id, models.User.role == "psychologist").first()
    patient = db.query(models.User).filter(models.User.id == patient_id, models.User.role == "patient").first()
    if not therapist or not patient:
        return None
    if patient not in therapist.patients:
        therapist.patients.append(patient)
        db.commit()
    return therapist

def remove_patient_from_therapist(db: Session, therapist_id: int, patient_id: int):
    therapist = db.query(models.User).filter(models.User.id == therapist_id, models.User.role == "psychologist").first()
    patient = db.query(models.User).filter(models.User.id == patient_id, models.User.role == "patient").first()
    if therapist and patient and patient in therapist.patients:
        therapist.patients.remove(patient)
        db.commit()
    return therapist