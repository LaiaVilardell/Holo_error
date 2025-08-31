# en backend/app/models/conversation_log.py
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class ConversationLog(Base):
    __tablename__ = "conversation_logs"

    id = Column(Integer, primary_key=True, index=True)
    transcript = Column(Text, nullable=False) # Guardará el diálogo completo
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    patient = relationship("User")

    # Opcional: Se podría añadir una relación al dibujo o avatar específico
    # drawing_id = Column(Integer, ForeignKey("patient_drawings.id"), nullable=True)
