# backend/app/main.py
from fastapi import FastAPI
from fastapi.routing import APIRoute
from .database import engine, Base, SessionLocal
from . import models
from .initial_data import seed_db

Base.metadata.create_all(bind=engine)

# Importa los routers
from .api.endpoints import auth as auth_router
from .api.endpoints import drawings as drawings_router
from .api.endpoints import users as users_router
from .api.endpoints import avatars as avatars_router
from .api.endpoints import phrases as phrases_router
from .api.endpoints import conversation_logs as conversation_logs_router # <-- AÑADIDO

app = FastAPI(title="Mi Super Proyecto TFG API")

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    seed_db(db)
    db.close()
    print("--- Initial data seeded successfully ---")
    print("--- RUTAS REGISTRADAS ---")
    for route in app.routes:
        if isinstance(route, APIRoute):
            print(f"Path: {route.path}, Name: {route.name}, Methods: {route.methods}")
    print("-------------------------")

# Incluimos los routers
app.include_router(auth_router.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(drawings_router.router, prefix="/api/drawings", tags=["Drawings"])
app.include_router(users_router.router, prefix="/api/users", tags=["Users"])
app.include_router(avatars_router.router, prefix="/api/avatars", tags=["Avatars"])
app.include_router(phrases_router.router, prefix="/api", tags=["Phrases"])
app.include_router(conversation_logs_router.router, prefix="/api", tags=["Conversation Logs"]) # <-- AÑADIDO

@app.get("/api")
def read_root():
    return {"message": "Welcome to Holo's API"}
