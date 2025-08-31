# en backend/app/schemas/patient_avatar.py
from pydantic import BaseModel

class AvatarBase(BaseModel):
    hair_style: str
    hair_color: str
    eye_color: str
    eyebrow_style: str
    skin_tone: str
    face_shape: str

class AvatarCreate(AvatarBase):
    pass

class AvatarRead(AvatarBase):
    id: int
    patient_id: int

    class Config:
        from_attributes = True # Pydantic v2
