# en backend/app/schemas/tca_phrase.py
from pydantic import BaseModel

class TcaPhraseRead(BaseModel):
    id: int
    tca_type: str
    phrase: str

    class Config:
        from_attributes = True
