# backend/app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from .patient_profile import PatientProfileRead, PatientProfileUpdate
from .psychologist_profile import PsychologistProfileRead

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str
    surname: Optional[str] = None
    center: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    class Config:
        from_attributes = True

# --- NUEVO ESQUEMA GENÉRICO CON PERFIL ---
class UserReadWithProfile(UserRead):
    patient_profile: Optional[PatientProfileRead] = None
    psychologist_profile: Optional[PsychologistProfileRead] = None

class PatientWithProfile(UserReadWithProfile):
    pass # Hereda todo de UserReadWithProfile

class TherapistWithProfile(UserReadWithProfile):
    patients: List[PatientWithProfile] = []

class PatientWithTherapists(UserRead):
    therapists: List[TherapistWithProfile] = []
