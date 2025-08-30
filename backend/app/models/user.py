from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..database import Base
from .therapist_patients import therapist_patients

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    surname = Column(String(150), nullable=True)
    center = Column(String(255), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # "patient" o "psychologist"

    # Relaciones uno a uno
    patient_profile = relationship("PatientProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    psychologist_profile = relationship("PsychologistProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")

    # Dibujos de pacientes
    drawings = relationship("PatientDrawing", back_populates="patient", cascade="all, delete-orphan")

    # Relación muchos a muchos: terapeuta <-> pacientes
    patients = relationship(
        "User",
        secondary=therapist_patients,
        primaryjoin=id == therapist_patients.c.therapist_id,
        secondaryjoin=id == therapist_patients.c.patient_id,
        back_populates="therapists"
    )

    therapists = relationship(
        "User",
        secondary=therapist_patients,
        primaryjoin=id == therapist_patients.c.patient_id,
        secondaryjoin=id == therapist_patients.c.therapist_id,
        back_populates="patients"
    )
