# en backend/app/models/patient_drawing.py
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class PatientDrawing(Base):
    __tablename__ = "patient_drawings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    image_data = Column(Text, nullable=False)  # Para base64 o SVG
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    patient = relationship("User", back_populates="drawings")