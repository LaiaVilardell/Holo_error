# en backend/app/models/tca_phrase.py
from sqlalchemy import Column, Integer, String, Text
from ..database import Base

class TcaPhrase(Base):
    __tablename__ = "tca_phrases"

    id = Column(Integer, primary_key=True, index=True)
    tca_type = Column(String(100), index=True, nullable=False)
    phrase = Column(Text, nullable=False)
