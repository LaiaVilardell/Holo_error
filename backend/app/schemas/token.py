# backend/app/schemas/token.py
from pydantic import BaseModel
from .user import UserRead

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserRead

    class Config:
        from_attributes = True  # coherente con Pydantic v2

class TokenData(BaseModel):
    # Coincide con los claims que pones en create_access_token
    sub: str | None = None   # normalmente el email del usuario
    role: str | None = None
