from sqlalchemy import Column, Integer, ForeignKey, Table
from ..database import Base

therapist_patients = Table(
    "therapist_patients",
    Base.metadata,
    Column("therapist_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("patient_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
)
