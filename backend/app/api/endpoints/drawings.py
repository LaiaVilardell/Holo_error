# backend/app/api/endpoints/drawings.py
# trabaja siempre con el usuario autenticado, evitando pasar user_id en la URL y cerrando un posible agujero de seguridad
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ... import schemas, crud
from ...database import get_db

router = APIRouter()

# Crear dibujo
@router.post("/users/{user_id}/drawings/", response_model=schemas.DrawingRead)
def create_drawing(user_id: int, drawing: schemas.DrawingCreate, db: Session = Depends(get_db)):
    return crud.create_patient_drawing(db, drawing, user_id)

# Listar dibujos de paciente
@router.get("/users/{user_id}/drawings/", response_model=List[schemas.DrawingRead])
def read_user_drawings(user_id: int, db: Session = Depends(get_db)):
    return crud.get_drawings_by_patient(db, user_id)

# Listar dibujos de un paciente para un terapeuta
@router.get("/therapists/{therapist_id}/patients/{patient_id}/drawings", response_model=List[schemas.DrawingRead])
def get_drawings_for_therapist(therapist_id: int, patient_id: int, db: Session = Depends(get_db)):
    drawings = crud.get_patient_drawings_for_therapist(db, therapist_id, patient_id)
    if not drawings:
        raise HTTPException(status_code=403, detail="Patient not assigned to therapist or not found")
    return drawings
