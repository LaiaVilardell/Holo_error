# en backend/app/crud/crud_tca_phrases.py
from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func
from .. import models

def get_random_phrase_by_type(db: Session, tca_type: str):
    """
    Obtiene una frase aleatoria de la base de datos para un tipo de TCA específico.
    """
    return (
        db.query(models.TcaPhrase)
        .filter(models.TcaPhrase.tca_type == tca_type)
        .order_by(func.random()) # func.random() es para SQLite. En PostgreSQL sería func.rand()
        .first()
    )
