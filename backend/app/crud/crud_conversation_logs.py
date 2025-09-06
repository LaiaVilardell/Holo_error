# en backend/app/crud/crud_conversation_logs.py
from sqlalchemy.orm import Session
from .. import models, schemas
from sqlalchemy import desc

def create_conversation_log(db: Session, log: schemas.ConversationLogCreate, patient_id: int):
    db_log = models.ConversationLog(
        transcript=log.transcript,
        patient_id=patient_id
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_conversation_logs_by_patient(db: Session, patient_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.ConversationLog)
        .filter(models.ConversationLog.patient_id == patient_id)
        .order_by(desc(models.ConversationLog.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )