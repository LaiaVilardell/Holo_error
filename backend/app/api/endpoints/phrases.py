# en backend/app/api/endpoints/phrases.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ... import crud, schemas
from ...database import get_db

router = APIRouter()

@router.get("/phrases/{tca_type}", response_model=schemas.TcaPhraseRead)
def read_random_phrase(tca_type: str, db: Session = Depends(get_db)):
    phrase = crud.get_random_phrase_by_type(db=db, tca_type=tca_type)
    if not phrase:
        # Opcional: devolver una frase genérica si no se encuentra ninguna para ese tipo
        phrase = crud.get_random_phrase_by_type(db=db, tca_type="general")
        if not phrase:
            raise HTTPException(status_code=404, detail="No phrases found")
    return phrase
