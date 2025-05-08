# backend/database.py
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import settings
import asyncio

class Database:
    client: AsyncIOMotorClient = None
    db: AsyncIOMotorDatabase = None

db_instance = Database()

async def connect_to_mongo():
    """MongoDB'ye bağlanır."""
    print("MongoDB'ye bağlanılıyor...")
    try:
        db_instance.client = AsyncIOMotorClient(settings.MONGO_URI)
        db_instance.db = db_instance.client[settings.DB_NAME]
        # Bağlantıyı test etmek için bir komut gönderelim
        await db_instance.db.command('ping')
        print(f"MongoDB bağlantısı başarılı: Veritabanı '{settings.DB_NAME}'")
    except Exception as e:
        print(f"MongoDB bağlantı hatası: {e}")
        # Bağlantı hatası durumunda uygulamayı durdurmak isteyebilirsiniz
        # raise SystemExit(f"MongoDB bağlantı hatası: {e}")

async def close_mongo_connection():
    """MongoDB bağlantısını kapatır."""
    print("MongoDB bağlantısı kapatılıyor...")
    if db_instance.client:
        db_instance.client.close()
        print("MongoDB bağlantısı kapatıldı.")

def get_database() -> AsyncIOMotorDatabase:
    """Veritabanı nesnesini döndürür."""
    if db_instance.db is None:
        # Bu durumun normalde olmaması gerekir, uygulama başlangıcında bağlanılmalı
        print("Hata: Veritabanı bağlantısı henüz kurulmamış.")
        # Uygulamayı başlatırken hata vermek daha iyi olabilir
        raise RuntimeError("Database connection not established.")
    return db_instance.db

# Bağımlılık enjeksiyonu için (FastAPI rotalarında kullanılacak)
async def get_db_dependency():
    """FastAPI dependency to get database instance."""
    return get_database()