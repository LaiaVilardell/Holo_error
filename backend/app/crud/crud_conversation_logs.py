# en backend/app/crud/crud_conversation_logs.py
from sqlalchemy.orm import Session
from .. import models, schemas

def create_conversation_log(db: Session, log: schemas.ConversationLogCreate, patient_id: int):
    db_log = models.ConversationLog(
        transcript=log.transcript,
        patient_id=patient_id
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log
