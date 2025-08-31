# en backend/app/api/endpoints/conversation_logs.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import get_db

router = APIRouter()

@router.post("/users/{user_id}/conversations/", response_model=schemas.ConversationLogRead)
def create_new_conversation_log(user_id: int, log: schemas.ConversationLogCreate, db: Session = Depends(get_db)):
    return crud.create_conversation_log(db=db, log=log, patient_id=user_id)
