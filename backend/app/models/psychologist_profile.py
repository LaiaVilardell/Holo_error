# en backend/app/models/psychologist_profile.py
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class PsychologistProfile(Base):
    __tablename__ = "psychologist_profiles"

    id = Column(Integer, primary_key=True, index=True)
    specialty = Column(String(150), nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    user = relationship("User", back_populates="psychologist_profile")