# backend/app/main.py
from fastapi import FastAPI
from fastapi.routing import APIRoute # <-- Importa APIRoute
from .database import engine
# Ya no necesitamos importar los modelos aquí para create_all

# Importa los nuevos routers
from .api.endpoints import auth as auth_router
from .api.endpoints import drawings as drawings_router
from .api.endpoints import users as users_router

# Alembic se encarga ahora de crear las tablas, por lo que esta línea se elimina
# models.Base.metadata.create_all(bind=engine) 

app = FastAPI(title="Mi Super Proyecto TFG API")

# -- INICIO CÓDIGO DE DEPURACIÓN --
# Este bloque se ejecutará una vez al arrancar y nos mostrará todas las rutas
@app.on_event("startup")
def print_all_routes():
    print("--- RUTAS REGISTRADAS ---")
    for route in app.routes:
        if isinstance(route, APIRoute):
            print(f"Path: {route.path}, Name: {route.name}, Methods: {route.methods}")
    print("-------------------------")
# -- FIN CÓDIGO DE DEPURACIÓN --

# Incluimos los routers
app.include_router(auth_router.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(drawings_router.router, prefix="/api/drawings", tags=["Drawings"])
app.include_router(users_router.router, prefix="/api/users", tags=["Users"])



@app.get("/api")
def read_root():
    return {"message": "Wellcome to Holo's API"}