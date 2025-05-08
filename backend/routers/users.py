# backend/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Annotated, List # List import et
from bson import ObjectId

from database import get_db_dependency
from models.user_models import UserPublic, Address, AddressCreate # Gerekli modelleri import et
# Güvenlik ve dependency fonksiyonlarını import et
from utils.security import get_current_active_user, get_current_admin_user

router = APIRouter()

# Dependency Injection ile veritabanı ve kullanıcı bilgilerini al
DBDep = Annotated[AsyncIOMotorDatabase, Depends(get_db_dependency)]
CurrentUserDep = Annotated[dict, Depends(get_current_active_user)] # Aktif kullanıcıyı dict olarak alır
AdminUserDep = Annotated[dict, Depends(get_current_admin_user)] # Aktif admin kullanıcıyı dict olarak alır

@router.get("/me", response_model=UserPublic)
async def read_users_me(current_user: CurrentUserDep):
    """
    Mevcut giriş yapmış kullanıcının profil bilgilerini döndürür.
    Token gerektirir.
    """
    # Dependency zaten kullanıcıyı getirdiği için direkt döndürebiliriz
    # Modeli doğrulamak için Pydantic modelini kullan
    return UserPublic.model_validate(current_user)

# --- Diğer Kullanıcı Endpoint'leri (İleride eklenecek) ---

# @router.put("/me", response_model=UserPublic)
# async def update_user_me(user_update: UserUpdate, current_user: CurrentUserDep, db: DBDep):
#     """Mevcut kullanıcının profilini günceller."""
#     # ... güncelleme mantığı ...
#     pass

# @router.get("/", response_model=List[UserPublic])
# async def read_users(admin_user: AdminUserDep, db: DBDep, skip: int = 0, limit: int = 20):
#     """Tüm kullanıcıları listeler (Sadece Admin)."""
#     # ... listeleme mantığı ...
#     pass

# @router.get("/{user_id}", response_model=UserPublic)
# async def read_user(user_id: str, current_user: CurrentUserDep, db: DBDep):
#      """Belirli bir kullanıcıyı getirir (Admin veya kullanıcının kendisi)."""
#      # ... yetki kontrolü ve getirme mantığı ...
#      pass

# @router.put("/{user_id}", response_model=UserPublic)
# async def update_user(user_id: str, user_update: UserUpdate, admin_user: AdminUserDep, db: DBDep):
#     """Belirli bir kullanıcıyı günceller (Sadece Admin)."""
#     # ... güncelleme mantığı ...
#     pass

# @router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_user(user_id: str, admin_user: AdminUserDep, db: DBDep):
#     """Belirli bir kullanıcıyı siler (Sadece Admin)."""
#     # ... silme mantığı ...
#     pass

# --- Adres Endpoint'leri (İleride eklenecek) ---
# @router.get("/me/addresses", response_model=List[Address])
# async def get_my_addresses(current_user: CurrentUserDep):
#     """Mevcut kullanıcının adreslerini listeler."""
#     pass

# @router.post("/me/addresses", response_model=List[Address], status_code=status.HTTP_201_CREATED)
# async def add_my_address(address_data: AddressCreate, current_user: CurrentUserDep, db: DBDep):
#      """Mevcut kullanıcıya yeni adres ekler."""
#      pass

# @router.put("/me/addresses/{address_id}", response_model=Address)
# async def update_my_address(address_id: str, address_data: AddressCreate, current_user: CurrentUserDep, db: DBDep):
#      """Mevcut kullanıcının belirli bir adresini günceller."""
#      pass

# @router.delete("/me/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_my_address(address_id: str, current_user: CurrentUserDep, db: DBDep):
#      """Mevcut kullanıcının belirli bir adresini siler."""
#      pass

# --- Şifre Değiştirme (İleride eklenecek) ---
# @router.put("/me/password")
# async def change_my_password(passwords: PasswordChange, current_user: CurrentUserDep, db: DBDep):
#      """Mevcut kullanıcının şifresini değiştirir."""
#      pass