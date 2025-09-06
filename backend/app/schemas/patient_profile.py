from pydantic import BaseModel, EmailStr
from datetime import date
from typing import Optional

# Este es el esquema para leer el perfil de un paciente
class PatientProfileRead(BaseModel):
    birthdate: Optional[date] = None
    gender: Optional[str] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None
    last_activity_type: Optional[str] = None
    last_tca_type: Optional[str] = None
    last_voice_uri: Optional[str] = None

    class Config:
        from_attributes = True

# Este es el esquema para actualizar el perfil de un paciente
# Incluye campos del modelo User y del modelo PatientProfile
class PatientProfileUpdate(BaseModel):
    name: Optional[str] = None
    surname: Optional[str] = None
    phone: Optional[str] = None
    center: Optional[str] = None
    birthdate: Optional[date] = None
    gender: Optional[str] = None
    treatment: Optional[str] = None
    notes: Optional[str] = None
    last_activity_type: Optional[str] = None
    last_tca_type: Optional[str] = None
    last_voice_uri: Optional[str] = None