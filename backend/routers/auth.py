# backend/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Annotated
from datetime import datetime, timezone
from pymongo.errors import DuplicateKeyError
import pymongo
from bson import ObjectId # ObjectId'i kontrol etmek için import edebiliriz

from database import get_db_dependency
from models.user_models import UserCreate, UserPublic, UserLogin
from models.token_models import Token
from utils.security import verify_password, create_access_token, get_password_hash

router = APIRouter()

DBDep = Annotated[AsyncIOMotorDatabase, Depends(get_db_dependency)]

@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate, db: DBDep):
    """Yeni kullanıcı kaydı oluşturur."""
    users_collection = db["users"]

    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu e-posta adresi zaten kayıtlı."
        )

    hashed_password = get_password_hash(user_data.password)

    user_db_data = user_data.model_dump(exclude={"password"})
    user_db_data["hashed_password"] = hashed_password
    user_db_data["role"] = "user"
    user_db_data["isActive"] = True
    user_db_data["createdAt"] = datetime.now(timezone.utc)
    user_db_data["updatedAt"] = datetime.now(timezone.utc)
    user_db_data["addresses"] = []
    user_db_data["wishlist"] = []
    user_db_data["orderHistory"] = []
    user_db_data["usedCampaigns"] = []


    try:
        result = await users_collection.insert_one(user_db_data)
        # Veritabanından kullanıcıyı tekrar çek
        created_user_raw = await users_collection.find_one({"_id": result.inserted_id})

        if not created_user_raw:
             raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Kullanıcı kaydedildi ancak getirilemedi.")

        # ----- Pydantic Doğrulama Hatası İçin Düzeltme -----
        # Pydantic modeline göndermeden önce _id'yi string'e çevir
        created_user_for_validation = created_user_raw.copy() # Orijinal dict'i bozmamak için kopyala
        if '_id' in created_user_for_validation and isinstance(created_user_for_validation['_id'], ObjectId):
            created_user_for_validation['_id'] = str(created_user_for_validation['_id'])
        # ----- Düzeltme Sonu -----

        # Düzenlenmiş dict ile modeli doğrula
        return UserPublic.model_validate(created_user_for_validation) # `model_validate` kullanıyoruz

    except DuplicateKeyError:
         raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu e-posta adresi zaten kayıtlı."
        )
    except Exception as e:
        print(f"Kayıt hatası: {e}") # Genel hatayı logla
        # Pydantic ValidationError hatasını da yakalayabiliriz ama şimdilik genel hata
        if "validation error" in str(e).lower(): # Basit kontrol
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Veri doğrulama hatası: {e}")
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Kullanıcı kaydı sırasında bir sunucu hatası oluştu."
            )


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: DBDep
):
    """Kullanıcı girişi yapar ve access token döndürür."""
    users_collection = db["users"]
    user = await users_collection.find_one({"email": form_data.username})

    # ----- bcrypt/AttributeError Hatası İçin Kontrol -----
    # verify_password fonksiyonu içinde bir sorun varsa burada hata alabiliriz
    # Bu genellikle bcrypt kütüphanesinin doğru kurulmamasından kaynaklanır
    try:
        password_field = user.get("hashed_password") if user else None
        if not user or not password_field or not verify_password(form_data.password, password_field):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="E-posta veya şifre hatalı.",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except AttributeError as ae:
        if "'bcrypt'" in str(ae): # Bcrypt hatasıysa daha açıklayıcı log
             print("\n\n *** Bcrypt/Passlib Hatası: 'bcrypt' modülü ile ilgili bir sorun var. 'pip install bcrypt' komutunu çalıştırdınız mı? ***\n\n")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Şifre doğrulama sırasında bir hata oluştu."
        )
    # ----- Kontrol Sonu -----


    if not user.get("isActive", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hesabınız askıya alınmış.",
        )

    access_token_payload = {
        "sub": str(user["_id"]),
        "id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    }
    access_token = create_access_token(data=access_token_payload)

    try:
        await users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"lastLogin": datetime.now(timezone.utc)}}
        )
    except Exception as e:
        print(f"Son giriş güncellenirken hata (kullanıcı: {user['email']}): {e}")


    return {"access_token": access_token, "token_type": "bearer"}