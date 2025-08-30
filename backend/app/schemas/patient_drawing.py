# backend/app/schemas/drawing.py
from pydantic import BaseModel
from datetime import datetime

class DrawingBase(BaseModel):
    title: str | None = None
    description: str | None = None
    # image_data como base64 o ruta/URL. Si vas a guardar archivo, cambia a `image_url: str`
    image_data: str

class DrawingCreate(DrawingBase):
    pass

class DrawingRead(DrawingBase):
    id: int
    patient_id: int
    created_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2: permite model_validate desde ORM
