# en backend/app/api/endpoints/avatars.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app import schemas, crud
from app.database import get_db

router = APIRouter()

@router.post("/users/{user_id}/avatars/", response_model=schemas.AvatarRead)
def create_avatar_for_user(user_id: int, avatar: schemas.AvatarCreate, db: Session = Depends(get_db)):
    return crud.create_patient_avatar(db=db, avatar=avatar, patient_id=user_id)

@router.get("/users/{user_id}/avatars/", response_model=List[schemas.AvatarRead])
def read_user_avatars(user_id: int, db: Session = Depends(get_db)):
    return crud.get_avatars_by_patient(db=db, patient_id=user_id)
