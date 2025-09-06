# en backend/app/api/endpoints/conversation_logs.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ... import schemas, crud
from ...database import get_db

router = APIRouter()

@router.post("/users/{user_id}/conversations/", response_model=schemas.ConversationLogRead)
def create_new_conversation_log(user_id: int, log: schemas.ConversationLogCreate, db: Session = Depends(get_db)):
    return crud.create_conversation_log(db=db, log=log, patient_id=user_id)

@router.get("/users/{user_id}/conversations/", response_model=List[schemas.ConversationLogRead])
def get_conversation_logs(user_id: int, db: Session = Depends(get_db)):
    return crud.get_conversation_logs_by_patient(db=db, patient_id=user_id)