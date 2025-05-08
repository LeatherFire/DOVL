# backend/models/token_models.py
from pydantic import BaseModel
from typing import Optional

# Token Yanıt Modeli
class Token(BaseModel):
    access_token: str
    token_type: str

# Token Payload Modeli (JWT içindeki veri)
class TokenData(BaseModel):
    id: Optional[str] = None # Kullanıcı ID'si (veya sub)
    email: Optional[str] = None
    role: Optional[str] = None