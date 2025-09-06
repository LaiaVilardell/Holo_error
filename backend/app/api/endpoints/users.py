from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from ... import models, schemas, crud
from ...database import get_db
from ...core.security import get_current_user

router = APIRouter()

# --- ENDPOINT PARA ACTUALIZAR PERFIL DE PACIENTE ---
@router.put("/patients/{patient_id}/profile", response_model=schemas.PatientWithProfile)
def update_patient_profile_endpoint(patient_id: int, profile_in: schemas.PatientProfileUpdate, db: Session = Depends(get_db)):
    updated_user = crud.update_patient_profile(db=db, patient_id=patient_id, profile_in=profile_in)
    if not updated_user:
        raise HTTPException(status_code=404, detail="Patient not found")
    return updated_user

@router.get("/search/", response_model=List[schemas.UserRead])
def search_patients(name: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Busca pacientes por nombre. Solo devuelve usuarios con el rol 'patient'.
    """
    if not name:
        return []
    patients = crud.search_users_by_name(db=db, name=name)
    return patients

@router.get("/me", response_model=schemas.UserReadWithProfile)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.post("/therapists/{therapist_id}/patients", response_model=schemas.TherapistWithProfile)
def assign_patient(therapist_id: int, patient_id: int, db: Session = Depends(get_db)):
    therapist = crud.assign_patient_to_therapist(db, therapist_id, patient_id)
    if not therapist:
        raise HTTPException(status_code=404, detail="Therapist or patient not found")
    return schemas.TherapistWithProfile.model_validate(therapist)

@router.delete("/therapists/{therapist_id}/patients/{patient_id}", response_model=schemas.TherapistWithProfile)
def remove_patient(therapist_id: int, patient_id: int, db: Session = Depends(get_db)):
    therapist = crud.remove_patient_from_therapist(db, therapist_id, patient_id)
    if not therapist:
        raise HTTPException(status_code=404, detail="Therapist or patient not found")
    return schemas.TherapistWithProfile.model_validate(therapist)

@router.get("/therapists/{therapist_id}/patients", response_model=schemas.TherapistWithProfile)
def get_patients_of_therapist(therapist_id: int, db: Session = Depends(get_db)):
    therapist = db.query(models.User).filter(models.User.id == therapist_id, models.User.role == "psychologist").first()
    if not therapist:
        raise HTTPException(status_code=404, detail="Therapist not found")
    return schemas.TherapistWithProfile.model_validate(therapist)

@router.get("/patients/{patient_id}/therapists", response_model=List[schemas.PatientWithTherapists])
def get_therapists_of_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(models.User).filter(models.User.id == patient_id, models.User.role == "patient").first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return [schemas.PatientWithTherapists.model_validate(patient)]

@router.put("/{user_id}/avatar", response_model=schemas.UserRead)
def update_user_avatar_endpoint(user_id: int, avatar: schemas.UserAvatarUpdate, db: Session = Depends(get_db)):
    """
    Update user avatar.
    """
    db_user = crud.update_user_avatar(db=db, user_id=user_id, avatar_data=avatar.avatar)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user