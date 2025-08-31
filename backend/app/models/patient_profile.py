# en backend/app/models/patient_profile.py
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..database import Base

class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(Integer, primary_key=True, index=True)
    birthdate = Column(Date, nullable=True)
    gender = Column(String(50), nullable=True) # <-- AÑADIDO
    treatment = Column(String(100), nullable=True) # Aumentado tamaño
    notes = Column(Text, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    user = relationship("User", back_populates="patient_profile")