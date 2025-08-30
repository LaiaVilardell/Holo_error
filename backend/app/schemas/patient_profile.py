from pydantic import BaseModel
from datetime import date

class PatientProfileRead(BaseModel):
    birthdate: date | None = None
    treatment: str | None = None

    class Config:
        from_attributes = True
