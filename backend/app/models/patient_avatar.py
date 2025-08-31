# en backend/app/models/patient_avatar.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class PatientAvatar(Base):
    __tablename__ = "patient_avatars"

    id = Column(Integer, primary_key=True, index=True)
    
    # Características del avatar
    hair_style = Column(String(50))
    hair_color = Column(String(50))
    eye_color = Column(String(50))
    eyebrow_style = Column(String(50))
    skin_tone = Column(String(50))
    face_shape = Column(String(50))

    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    patient = relationship("User") # Relación simple, no se necesita back_populates aquí si User no necesita acceder a avatares directamente
