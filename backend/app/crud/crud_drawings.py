from sqlalchemy.orm import Session
from .. import models, schemas

def get_drawings_by_patient(db: Session, patient_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(models.PatientDrawing)
        .filter(models.PatientDrawing.patient_id == patient_id)
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_drawing(db: Session, drawing_id: int):
    """
    Devuelve un dibujo por su ID.
    """
    return db.query(models.PatientDrawing).filter(models.PatientDrawing.id == drawing_id).first()

def create_patient_drawing(db: Session, drawing: schemas.DrawingCreate, patient_id: int):
    db_drawing = models.PatientDrawing(**drawing.model_dump(), patient_id=patient_id)
    db.add(db_drawing)          # <- corregido (antes db.session.add)
    db.commit()
    db.refresh(db_drawing)
    return db_drawing

# Obtener dibujos de paciente solo si pertenece al terapeuta
def get_patient_drawings_for_therapist(db: Session, therapist_id: int, patient_id: int):
    therapist = db.query(models.User).filter(models.User.id == therapist_id, models.User.role == "psychologist").first()
    patient = db.query(models.User).filter(models.User.id == patient_id, models.User.role == "patient").first()
    if not therapist or not patient or patient not in therapist.patients:
        return []
    return patient.drawings