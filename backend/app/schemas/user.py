# backend/app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from .patient_profile import PatientProfileRead
from .psychologist_profile import PsychologistProfileRead

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str  # "patient" / "therapist"
    surname: Optional[str] = None
    center: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int

    class Config:
        from_attributes = True

class PatientWithProfile(UserRead):
    patient_profile: Optional[PatientProfileRead] = None

class TherapistWithProfile(UserRead):
    psychologist_profile: Optional[PsychologistProfileRead] = None
    patients: List[PatientWithProfile] = []