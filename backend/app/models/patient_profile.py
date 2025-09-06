# en backend/app/models/patient_profile.py
from sqlalchemy import Column, Integer, String, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from ..database import Base

class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id = Column(Integer, primary_key=True, index=True)
    birthdate = Column(Date, nullable=True)
    gender = Column(String(50), nullable=True)
    treatment = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    
    last_activity_type = Column(String(50), nullable=True) # 'drawing' o 'avatar'
    last_tca_type = Column(String(100), nullable=True)
    last_voice_uri = Column(Text, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    user = relationship("User", back_populates="patient_profile")
