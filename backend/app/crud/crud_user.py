from sqlalchemy.orm import Session
from .. import models, schemas
from ..core.security import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def search_users_by_name(db: Session, name: str):
    return db.query(models.User).filter(
        models.User.name.ilike(f"%{name}%"),
        models.User.role == "patient"
    ).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        surname=user.surname,
        center=user.center,
        phone=user.phone,
        role=user.role,
        hashed_password=hashed_password,
    )
    if user.role == 'patient':
        db_user.patient_profile = models.PatientProfile()
    elif user.role == 'psychologist':
        db_user.psychologist_profile = models.PsychologistProfile()
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- FUNCIÓN DE ACTUALIZACIÓN MEJORADA ---
def update_patient_profile(db: Session, patient_id: int, profile_in: schemas.PatientProfileUpdate):
    # Busca el usuario y su perfil
    patient_user = db.query(models.User).filter(models.User.id == patient_id, models.User.role == 'patient').first()
    if not patient_user or not patient_user.patient_profile:
        return None
    
    # Extrae los datos para cada modelo
    profile_data = profile_in.model_dump(exclude_unset=True)
    user_update_data = {}
    profile_update_data = {}

    # Separa los datos para el modelo User y para PatientProfile
    for key, value in profile_data.items():
        if hasattr(patient_user, key):
            user_update_data[key] = value
        if hasattr(patient_user.patient_profile, key):
            profile_update_data[key] = value

    # Actualiza los campos del usuario
    for key, value in user_update_data.items():
        setattr(patient_user, key, value)

    # Actualiza los campos del perfil
    for key, value in profile_update_data.items():
        setattr(patient_user.patient_profile, key, value)
    
    db.commit()
    db.refresh(patient_user.patient_profile)
    db.refresh(patient_user)
    return patient_user # Devolvemos el usuario completo actualizado

def assign_patient_to_therapist(db: Session, therapist_id: int, patient_id: int):
    therapist = db.query(models.User).filter(models.User.id == therapist_id, models.User.role == "psychologist").first()
    patient = db.query(models.User).filter(models.User.id == patient_id, models.User.role == "patient").first()
    if not therapist or not patient:
        return None
    if patient not in therapist.patients:
        therapist.patients.append(patient)
        db.commit()
    return therapist

def remove_patient_from_therapist(db: Session, therapist_id: int, patient_id: int):
    therapist = db.query(models.User).filter(models.User.id == therapist_id, models.User.role == "psychologist").first()
    patient = db.query(models.User).filter(models.User.id == patient_id, models.User.role == "patient").first()
    if therapist and patient and patient in therapist.patients:
        therapist.patients.remove(patient)
        db.commit()
    return therapist

def update_user_avatar(db: Session, user_id: int, avatar_data: str):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.avatar = avatar_data
        db.commit()
        db.refresh(db_user)
    return db_user
