# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import connect_to_mongo, close_mongo_connection, get_database
from config import settings

# --- Rotaları Import Etme ---
from routers import auth # Auth router'ını import et
# Diğer routerlar ileride eklenecek
# from routers import users, products, categories, orders, campaigns, cart

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title="DOVL E-Ticaret API",
    description="Dovl markası için Python FastAPI tabanlı e-ticaret API'si.",
    version="0.1.0",
    lifespan=lifespan
)

if settings.ALLOWED_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
     print("UYARI: ALLOWED_ORIGINS ayarlanmamış. CORS Middleware devre dışı.")


@app.get("/", tags=["Root"])
async def read_root():
    db = get_database()
    try:
        await db.command('ping')
        db_status = "Bağlantı Başarılı"
    except Exception as e:
        db_status = f"Bağlantı Başarısız: {e}"

    return {
        "message": "DOVL API'ye hoş geldiniz!",
        "database_status": db_status,
        "docs_url": "/docs"
    }

# --- Rotaları (Router) Dahil Etme ---
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# Diğer routerlar ileride eklenecek
# app.include_router(users.router, prefix="/users", tags=["Users"])
# app.include_router(products.router, prefix="/products", tags=["Products"])
# app.include_router(categories.router, prefix="/categories", tags=["Categories"])
# app.include_router(orders.router, prefix="/orders", tags=["Orders"])
# app.include_router(campaigns.router, prefix="/campaigns", tags=["Campaigns"])
# app.include_router(cart.router, prefix="/cart", tags=["Cart"])

print(f"API Başlatıldı. Dokümantasyon: http://localhost:8000/docs")
print(f"İzin verilen originler: {settings.ALLOWED_ORIGINS}")