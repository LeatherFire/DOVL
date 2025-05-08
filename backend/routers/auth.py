# backend/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Annotated
from datetime import datetime, timezone # <<< BU SATIRI EKLEYİN
from pymongo.errors import DuplicateKeyError
import pymongo

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
    user_db_data["hashed_password"] = hashed_password # hashlenmiş şifre alanının adını kontrol et
    user_db_data["role"] = "user"
    user_db_data["isActive"] = True
    # datetime ve timezone import edildiği için artık hata vermemeli
    user_db_data["createdAt"] = datetime.now(timezone.utc)
    user_db_data["updatedAt"] = datetime.now(timezone.utc)
    user_db_data["addresses"] = []
    user_db_data["wishlist"] = []
    user_db_data["orderHistory"] = []
    user_db_data["usedCampaigns"] = []


    try:
        result = await users_collection.insert_one(user_db_data)
        created_user = await users_collection.find_one({"_id": result.inserted_id})

        if not created_user:
             raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Kullanıcı kaydedildi ancak getirilemedi.")

        return UserPublic.model_validate(created_user)

    except DuplicateKeyError:
         raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu e-posta adresi zaten kayıtlı."
        )
    except Exception as e:
        print(f"Kayıt hatası: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Kullanıcı kaydı sırasında bir hata oluştu."
        )


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: DBDep
):
    """Kullanıcı girişi yapar ve access token döndürür."""
    users_collection = db["users"]
    # .get("hashed_password") kullanmak yerine doğrudan alan adı daha iyi olabilir,
    # ama önce veritabanı modelini kontrol etmek lazım. Şimdilik get ile bırakalım.
    user = await users_collection.find_one({"email": form_data.username})

    # user varsa ve şifre varsa kontrol et
    if not user or "hashed_password" not in user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-posta veya şifre hatalı.",
            headers={"WWW-Authenticate": "Bearer"},
        )

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
            # timezone import edildiği için artık hata vermemeli
            {"$set": {"lastLogin": datetime.now(timezone.utc)}}
        )
    except Exception as e:
        print(f"Son giriş güncellenirken hata (kullanıcı: {user['email']}): {e}")


    return {"access_token": access_token, "token_type": "bearer"}