# backend/config.py
import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from typing import List, Union

# .env dosyasını yükle (main.py'de de yapılabilir ama burada olması daha merkezi)
load_dotenv()

class Settings(BaseSettings):
    """Uygulama yapılandırmalarını yönetir."""
    # MongoDB Ayarları
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "dovl_db_py")

    # JWT Ayarları
    JWT_SECRET: str = os.getenv("JWT_SECRET", "default_super_secret_key_replace_this") # Mutlaka değiştirin!
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7)) # 7 gün

    # CORS Ayarları
    # Ortam değişkeninden gelen string'i listeye çevir
    ALLOWED_ORIGINS_STR: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS_STR.split(',') if origin.strip()]

    # Pydantic'in .env dosyasını otomatik okuması için (alternatif)
    # class Config:
    #     env_file = '.env'
    #     env_file_encoding = 'utf-8'

# Ayarları dışa aktar
settings = Settings()

# Güvenlik uyarısı
if settings.JWT_SECRET == "default_super_secret_key_replace_this":
    print("\n\n" + "="*50)
    print("UYARI: Varsayılan JWT_SECRET kullanılıyor!")
    print("Lütfen .env dosyasında güvenli bir JWT_SECRET ayarlayın.")
    print("="*50 + "\n\n")