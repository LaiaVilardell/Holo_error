# en backend/app/initial_data.py
from sqlalchemy.orm import Session
from app import crud, schemas, models

def seed_db(db: Session):
    # --- Creación de usuarios de test ---
    patient_user = crud.get_user_by_email(db, email="patient@test.com")
    if not patient_user:
        print("Creating test patient user...")
        patient_in = schemas.UserCreate(email="patient@test.com", password="123456", name="Test Patient", role="patient")
        crud.create_user(db=db, user=patient_in)
    
    therapist_user = crud.get_user_by_email(db, email="psyco@test.com")
    if not therapist_user:
        print("Creating test psychologist user...")
        therapist_in = schemas.UserCreate(email="psyco@test.com", password="123456", name="Test Psychologist", role="psychologist")
        crud.create_user(db=db, user=therapist_in)

    # --- Creación de frases de ejemplo (en inglés) ---
    phrase_count = db.query(models.TcaPhrase).count()
    if phrase_count == 0:
        print("Seeding TCA phrases in English...")
        phrases = [
            # Anorexia
            models.TcaPhrase(tca_type="anorexia", phrase="You shouldn't eat that, it has too many calories."),
            models.TcaPhrase(tca_type="anorexia", phrase="If you eat that, all your effort will be wasted."),
            models.TcaPhrase(tca_type="anorexia", phrase="Skipping one meal isn't a big deal, it will help you compensate."),
            models.TcaPhrase(tca_type="anorexia", phrase="Are you really hungry, or is it just anxiety?"),
            models.TcaPhrase(tca_type="anorexia", phrase="The number on the scale defines how well you're doing."),

            # Bulimia / Binge
            models.TcaPhrase(tca_type="bulimia", phrase="You've already broken your diet, so it doesn't matter, you can keep eating."),
            models.TcaPhrase(tca_type="bulimia", phrase="No one has to know. You can make up for it later."),
            models.TcaPhrase(tca_type="bulimia", phrase="You feel bad, food will make you feel better right now."),
            models.TcaPhrase(tca_type="bulimia", phrase="Just a little more, it's fine."),
            models.TcaPhrase(tca_type="bulimia", phrase="You can start over tomorrow, today doesn't count."),

            # General Body Image
            models.TcaPhrase(tca_type="general", phrase="Everyone is staring at your body."),
            models.TcaPhrase(tca_type="general", phrase="You'll never look like those people on social media."),
            models.TcaPhrase(tca_type="general", phrase="These clothes don't fit you well, they highlight your flaws.")
        ]
        db.add_all(phrases)
        db.commit()
