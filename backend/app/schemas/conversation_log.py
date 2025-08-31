# en backend/app/schemas/conversation_log.py
from pydantic import BaseModel
from datetime import datetime

class ConversationLogBase(BaseModel):
    transcript: str

class ConversationLogCreate(ConversationLogBase):
    pass

class ConversationLogRead(ConversationLogBase):
    id: int
    patient_id: int
    created_at: datetime

    class Config:
        from_attributes = True
