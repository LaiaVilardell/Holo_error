from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ... import models, schemas, crud
from ...database import get_db

router = APIRouter()

# Obtener info usuario logueado
@router.get("/me", response_model=schemas.UserRead)
def read_users_me(current_user: models.User = Depends(...)):
    return current_user

# Asignar paciente a terapeuta
@router.post("/therapists/{therapist_id}/patients", response_model=schemas.TherapistWithProfile)
def assign_patient(therapist_id: int, patient_id: int, db: Session = Depends(get_db)):
    therapist = crud.assign_patient_to_therapist(db, therapist_id, patient_id)
    if not therapist:
        raise HTTPException(status_code=404, detail="Therapist or patient not found")
    return schemas.TherapistWithProfile.model_validate(therapist)

# Quitar paciente de terapeuta
@router.delete("/therapists/{therapist_id}/patients/{patient_id}", response_model=schemas.TherapistWithProfile)
def remove_patient(therapist_id: int, patient_id: int, db: Session = Depends(get_db)):
    therapist = crud.remove_patient_from_therapist(db, therapist_id, patient_id)
    if not therapist:
        raise HTTPException(status_code=404, detail="Therapist or patient not found")
    return schemas.TherapistWithProfile.model_validate(therapist)

# Listar pacientes de un terapeuta con perfil incluido
@router.get("/therapists/{therapist_id}/patients", response_model=schemas.TherapistWithProfile)
def get_patients_of_therapist(therapist_id: int, db: Session = Depends(get_db)):
    therapist = db.query(models.User).filter(models.User.id == therapist_id, models.User.role == "psychologist").first()
    if not therapist:
        raise HTTPException(status_code=404, detail="Therapist not found")
    return schemas.TherapistWithProfile.model_validate(therapist)

# Listar terapeutas de un paciente con profile incluido
@router.get("/patients/{patient_id}/therapists", response_model=List[schemas.PatientWithTherapists])
def get_therapists_of_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(models.User).filter(models.User.id == patient_id, models.User.role == "patient").first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return [schemas.PatientWithTherapists.model_validate(patient)]
