# backend/routers/cart.py
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Annotated, Optional
from bson import ObjectId
from uuid import uuid4
import pymongo

from database import get_db_dependency
from models.cart_models import Cart, CartResponse, AddToCartRequest, UpdateCartItemRequest, ApplyCampaignRequest, PyObjectId
from models.product_models import Product as ProductModel # Ürün modelini import et
from models.campaign_models import Campaign as CampaignModel # Kampanya modelini import et
from utils.security import get_current_user_payload # Opsiyonel: Giriş yapmış kullanıcıyı almak için
from config import settings

router = APIRouter()
DBDep = Annotated[AsyncIOMotorDatabase, Depends(get_db_dependency)]

# Yardımcı fonksiyon: Sepet ID'sini al (Cookie veya User)
async def get_cart_identifier(request: Request, db: DBDep) -> dict:
    """Cookie'den sessionId veya token'dan userId alır."""
    # Önce token'ı kontrol et
    try:
        # Not: security dependency'si direkt router seviyesinde değilse burada manuel çağırabiliriz
        # Veya bu fonksiyonu opsiyonel token alacak şekilde düzenleyebiliriz.
        # Şimdilik get_current_user_payload'u doğrudan çağırmayalım,
        # onun yerine çereze veya isteğe bağlı token'a bakalım.
        # token_data = await get_current_user_payload(Depends(oauth2_scheme)) # Bu burada çalışmaz
        # Eğer kullanıcı girişi zorunluysa security dependency'si kullanılmalı.
        # Eğer hem misafir hem kayıtlı kullanıcı sepeti olacaksa,
        # önce çereze bakıp, token varsa kullanıcıya bağlamak daha mantıklı.
        pass # Token kontrolü şimdilik atlandı, router'da yapılacak
    except HTTPException:
        pass # Token yoksa veya geçersizse devam et (misafir olabilir)

    session_id = request.cookies.get("cartSessionId")
    user_id = None # Şimdilik token kontrolü yapmıyoruz

    # Eğer kullanıcı ID varsa önceliklendir
    if user_id:
        return {"user": ObjectId(user_id)}
    elif session_id:
        return {"sessionId": session_id}
    else:
        # Ne kullanıcı ID ne de session ID varsa, yeni session ID oluştur
        return {"sessionId": str(uuid4())}

# Yardımcı fonksiyon: Sepeti hesapla ve kaydet
async def calculate_and_save_cart(cart_doc: dict, db: DBDep) -> dict:
    """Sepet toplamlarını hesaplar ve veritabanına kaydeder."""
    carts_collection = db["carts"]
    products_collection = db["products"]
    campaigns_collection = db["campaigns"]

    subtotal = 0
    valid_items = []

    # Ürünleri tek seferde çekmek için ID listesi
    product_ids = [item['product'] for item in cart_doc.get('items', []) if isinstance(item.get('product'), ObjectId)]

    # Veritabanından ilgili ürünleri çek
    product_docs = {}
    if product_ids:
        cursor = products_collection.find({"_id": {"$in": product_ids}, "isActive": True})
        async for prod in cursor:
            product_docs[prod['_id']] = prod

    # Sepetteki ürünleri işle
    for item_data in cart_doc.get('items', []):
        product_id = item_data.get('product')
        variant_sku = item_data.get('variant', {}).get('sku')

        if not product_id or not variant_sku: continue # Geçersiz item

        product = product_docs.get(ObjectId(product_id)) if ObjectId.is_valid(product_id) else None

        if not product: continue # Ürün bulunamadı veya aktif değil

        variant = next((v for v in product.get('variants', []) if v.get('sku') == variant_sku), None)

        if not variant: continue # Varyant bulunamadı

        # Stok kontrolü
        quantity = item_data.get('quantity', 1)
        if quantity > variant.get('stock', 0):
            quantity = variant.get('stock', 0) # Miktarı stoğa eşitle
            if quantity == 0: continue # Stok yoksa ürünü atla (veya kaldır)

        price = product.get('salePrice') or product.get('price', 0)
        item_subtotal = price * quantity

        # Gerekli alanları güncelle/ekle
        item_data['productName'] = product.get('name')
        item_data['productSlug'] = product.get('slug')
        item_data['productImage'] = product.get('images', [{}])[0].get('url', '') # İlk görseli al
        item_data['variant']['size'] = variant.get('size')
        item_data['variant']['colorName'] = variant.get('colorName')
        item_data['variant']['colorHex'] = variant.get('colorHex')
        item_data['price'] = price
        item_data['originalPrice'] = product.get('price')
        item_data['quantity'] = quantity
        item_data['subtotal'] = item_subtotal

        subtotal += item_subtotal
        valid_items.append(item_data)

    cart_doc['items'] = valid_items # Sadece geçerli ve stoğu olan ürünleri tut
    cart_doc['subtotal'] = subtotal

    # Kampanyayı uygula
    discount_amount = 0
    campaign_applied = None
    campaign_id_str = cart_doc.get('campaign', {}).get('id')

    if campaign_id_str and ObjectId.is_valid(campaign_id_str):
        campaign = await campaigns_collection.find_one({"_id": ObjectId(campaign_id_str)})
        if campaign and campaign.get('isActive') and \
           campaign.get('startDate') <= datetime.now(timezone.utc) and \
           campaign.get('endDate') >= datetime.now(timezone.utc) and \
           (not campaign.get('minPurchaseAmount') or subtotal >= campaign.get('minPurchaseAmount', 0)):

            # TODO: Ürün/Kategori filtrelerini burada kontrol et
            # TODO: Kullanım limiti kontrolü (toplam ve kullanıcı başına)

            if campaign.get('discountType') == 'percentage':
                calculated_discount = subtotal * (campaign.get('discountValue', 0) / 100)
                discount_amount = min(calculated_discount, campaign.get('maxDiscount') or float('inf'))
            elif campaign.get('discountType') == 'fixed_amount':
                discount_amount = min(campaign.get('discountValue', 0), subtotal)

            campaign_applied = {
                "id": str(campaign['_id']), # String olarak sakla
                "code": campaign.get('code'),
                "discountType": campaign.get('discountType'),
                "discountValue": campaign.get('discountValue'),
                "discountAmount": discount_amount
            }
        else:
             cart_doc['campaign'] = None # Geçersizse kaldır

    cart_doc['discountAmount'] = discount_amount
    cart_doc['campaign'] = campaign_applied # Uygulanan kampanya bilgisini ata

    # Vergi ve kargo hesapla
    tax_base = subtotal - discount_amount
    tax_amount = max(0, tax_base * (settings.TAX / 100)) # %18 KDV varsayımı
    shipping_cost = 0 if tax_base >= settings.FREE_SHIPPING_THRESHOLD else settings.SHIPPING_COST

    cart_doc['taxAmount'] = tax_amount
    cart_doc['shippingCost'] = shipping_cost
    cart_doc['total'] = max(0, tax_base + tax_amount + shipping_cost)
    cart_doc['updatedAt'] = datetime.now(timezone.utc)

    # Veritabanına kaydet/güncelle
    cart_id_or_session = cart_doc.get('_id') or cart_doc.get('sessionId')
    if cart_id_or_session:
        query = {"_id": ObjectId(cart_id_or_session)} if ObjectId.is_valid(cart_id_or_session) else {"sessionId": cart_id_or_session}
        await carts_collection.update_one(query, {"$set": cart_doc}, upsert=True)
    else:
         # Bu durum olmamalı ama olursa yeni belge ekle
         result = await carts_collection.insert_one(cart_doc)
         cart_doc['_id'] = result.inserted_id


    # Pydantic modeli için _id'yi string'e çevir
    if '_id' in cart_doc: cart_doc['_id'] = str(cart_doc['_id'])
    if 'user' in cart_doc and isinstance(cart_doc['user'], ObjectId): cart_doc['user'] = str(cart_doc['user'])
    if 'campaign' in cart_doc and cart_doc['campaign'] and isinstance(cart_doc['campaign'].get('id'), ObjectId):
         cart_doc['campaign']['id'] = str(cart_doc['campaign']['id'])
    for item in cart_doc.get('items', []):
        if '_id' in item and isinstance(item['_id'], ObjectId): item['_id'] = str(item['_id'])
        if 'product' in item and isinstance(item['product'], ObjectId): item['product'] = str(item['product'])


    return cart_doc

@router.get("/", response_model=CartResponse)
async def get_cart(request: Request, response: Response, db: DBDep):
    """Mevcut kullanıcının veya oturumun sepetini getirir."""
    identifier = await get_cart_identifier(request, db)
    carts_collection = db["carts"]

    cart_doc = await carts_collection.find_one(identifier)

    if not cart_doc:
        # Yeni session ID oluşturulduysa cookie'ye ekle
        if "sessionId" in identifier and not request.cookies.get("cartSessionId"):
            response.set_cookie(key="cartSessionId", value=identifier["sessionId"], max_age=60*60*24*30, httponly=True, samesite='lax')
        # Boş sepet oluştur ve döndür
        cart_doc = {
            "items": [], "subtotal": 0, "discountAmount": 0, "shippingCost": 0,
            "taxAmount": 0, "total": 0, "campaign": None,
            "createdAt": datetime.now(timezone.utc), "updatedAt": datetime.now(timezone.utc),
            **identifier # sessionId veya user ekle
        }
        # Boş sepeti DB'ye hemen kaydetmeyebiliriz, ilk ürün eklendiğinde kaydedilir.
        # Ya da kaydedelim:
        # result = await carts_collection.insert_one(cart_doc)
        # cart_doc['_id'] = result.inserted_id

    # Sepeti her getirdiğimizde yeniden hesaplayalım (stok/fiyat değişebilir)
    calculated_cart = await calculate_and_save_cart(cart_doc, db)

    return CartResponse(data=Cart.model_validate(calculated_cart))


@router.post("/items", response_model=CartResponse)
async def add_item_to_cart(item_data: AddToCartRequest, request: Request, response: Response, db: DBDep):
    """Sepete yeni ürün ekler veya mevcut ürünün miktarını artırır."""
    identifier = await get_cart_identifier(request, db)
    carts_collection = db["carts"]
    products_collection = db["products"]

    # Ürünü ve varyantı kontrol et
    product = await products_collection.find_one({"_id": ObjectId(item_data.productId), "isActive": True})
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ürün bulunamadı veya aktif değil.")

    variant = next((v for v in product.get('variants', []) if v.get('sku') == item_data.variantSku), None)
    if not variant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ürün varyantı bulunamadı.")

    # Stoğu kontrol et
    if variant.get('stock', 0) < item_data.quantity:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Yetersiz stok. Mevcut: {variant.get('stock', 0)}")

    # Sepeti bul veya oluştur
    cart_doc = await carts_collection.find_one(identifier)
    if not cart_doc:
        cart_doc = {
            "items": [], "subtotal": 0, "discountAmount": 0, "shippingCost": 0,
            "taxAmount": 0, "total": 0, "campaign": None,
            "createdAt": datetime.now(timezone.utc),
            **identifier
        }
        if "sessionId" in identifier and not request.cookies.get("cartSessionId"):
             response.set_cookie(key="cartSessionId", value=identifier["sessionId"], max_age=60*60*24*30, httponly=True, samesite='lax')

    # Sepetteki item'ı bul veya oluştur
    item_index = -1
    for i, item in enumerate(cart_doc.get('items', [])):
        if str(item.get('product')) == str(item_data.productId) and item.get('variant', {}).get('sku') == item_data.variantSku:
            item_index = i
            break

    price = product.get('salePrice') or product.get('price', 0)
    product_image = product.get('images', [{}])[0].get('url', '')

    if item_index != -1:
        # Miktarı güncelle
        new_quantity = cart_doc['items'][item_index]['quantity'] + item_data.quantity
        if new_quantity > variant.get('stock', 0):
             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Maksimum stok aşıldı. Sepete ekleyebileceğiniz: {variant.get('stock', 0) - cart_doc['items'][item_index]['quantity']}")
        cart_doc['items'][item_index]['quantity'] = new_quantity
        cart_doc['items'][item_index]['subtotal'] = new_quantity * price # Subtotal'ı da güncelle
    else:
        # Yeni item ekle
        new_item = {
            "_id": ObjectId(), # Yeni item için ID oluştur
            "product": ObjectId(item_data.productId),
            "productName": product.get('name'),
            "productSlug": product.get('slug'),
            "productImage": product_image,
            "variant": {
                "size": variant.get('size'),
                "colorName": variant.get('colorName'),
                "colorHex": variant.get('colorHex'),
                "sku": variant.get('sku')
            },
            "price": price,
            "originalPrice": product.get('price'),
            "quantity": item_data.quantity,
            "subtotal": item_data.quantity * price
        }
        if 'items' not in cart_doc: cart_doc['items'] = []
        cart_doc['items'].append(new_item)

    # Sepeti hesapla ve kaydet
    calculated_cart = await calculate_and_save_cart(cart_doc, db)

    return CartResponse(data=Cart.model_validate(calculated_cart))


@router.put("/items", response_model=CartResponse)
async def update_cart_item(item_update: UpdateCartItemRequest, request: Request, db: DBDep):
    """Sepetteki bir ürünün miktarını günceller."""
    identifier = await get_cart_identifier(request, db)
    carts_collection = db["carts"]
    products_collection = db["products"]

    cart_doc = await carts_collection.find_one(identifier)
    if not cart_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sepet bulunamadı.")

    item_index = -1
    for i, item in enumerate(cart_doc.get('items', [])):
         # ObjectId karşılaştırması
         if '_id' in item and item['_id'] == ObjectId(item_update.itemId):
            item_index = i
            break

    if item_index == -1:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sepette güncellenecek ürün bulunamadı.")

    # Stok kontrolü
    item_to_update = cart_doc['items'][item_index]
    product = await products_collection.find_one({"_id": ObjectId(item_to_update['product'])})
    if not product:
        # Ürün bulunamazsa sepetten kaldırabiliriz
        cart_doc['items'].pop(item_index)
        calculated_cart = await calculate_and_save_cart(cart_doc, db)
        return CartResponse(data=Cart.model_validate(calculated_cart))

    variant = next((v for v in product.get('variants', []) if v.get('sku') == item_to_update['variant']['sku']), None)
    if not variant:
         # Varyant bulunamazsa sepetten kaldır
         cart_doc['items'].pop(item_index)
         calculated_cart = await calculate_and_save_cart(cart_doc, db)
         return CartResponse(data=Cart.model_validate(calculated_cart))

    if item_update.quantity > variant.get('stock', 0):
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Yetersiz stok. Mevcut: {variant.get('stock', 0)}")

    # Miktarı güncelle
    item_to_update['quantity'] = item_update.quantity
    item_to_update['subtotal'] = item_update.quantity * item_to_update['price']

    # Sepeti hesapla ve kaydet
    calculated_cart = await calculate_and_save_cart(cart_doc, db)

    return CartResponse(data=Cart.model_validate(calculated_cart))


@router.delete("/items/{item_id}", response_model=CartResponse)
async def remove_item_from_cart(item_id: str, request: Request, db: DBDep):
    """Sepetten bir ürünü kaldırır."""
    if not ObjectId.is_valid(item_id):
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Geçersiz ürün ID formatı.")

    identifier = await get_cart_identifier(request, db)
    carts_collection = db["carts"]

    cart_doc = await carts_collection.find_one(identifier)
    if not cart_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sepet bulunamadı.")

    initial_length = len(cart_doc.get('items', []))
    # ObjectId olarak karşılaştır
    cart_doc['items'] = [item for item in cart_doc.get('items', []) if item.get('_id') != ObjectId(item_id)]

    if len(cart_doc.get('items', [])) == initial_length:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sepette silinecek ürün bulunamadı.")

    # Sepeti hesapla ve kaydet
    calculated_cart = await calculate_and_save_cart(cart_doc, db)

    return CartResponse(data=Cart.model_validate(calculated_cart))


@router.post("/campaign", response_model=CartResponse)
async def apply_campaign_to_cart(campaign_data: ApplyCampaignRequest, request: Request, db: DBDep):
    """Sepete kampanya kodu uygular."""
    identifier = await get_cart_identifier(request, db)
    carts_collection = db["carts"]
    campaigns_collection = db["campaigns"]

    cart_doc = await carts_collection.find_one(identifier)
    if not cart_doc or not cart_doc.get('items'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kampanya uygulamak için sepette ürün olmalı.")

    campaign = await campaigns_collection.find_one({"code": campaign_data.code.upper(), "isActive": True})
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Geçersiz veya aktif olmayan kampanya kodu.")

    # Geçerlilik kontrolleri (calculate_and_save_cart içinde de yapılıyor ama burada ön kontrol iyi olur)
    now = datetime.now(timezone.utc)
    if now < campaign.get('startDate') or now > campaign.get('endDate'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kampanya şu an geçerli değil.")
    if campaign.get('minPurchaseAmount') and cart_doc.get('subtotal', 0) < campaign.get('minPurchaseAmount', 0):
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Minimum sepet tutarı ({campaign['minPurchaseAmount']} TL) gerekli.")
    # TODO: Diğer kampanya kontrolleri (kullanım limiti, ürün/kategori) eklenebilir

    # Kampanyayı sepete ekle
    cart_doc['campaign'] = {
        "id": campaign['_id'], # ObjectId olarak sakla
        "code": campaign.get('code'),
        "discountType": campaign.get('discountType'),
        "discountValue": campaign.get('discountValue'),
        # discountAmount burada hesaplanmaz, calculate_and_save_cart'ta hesaplanır
    }

    # Sepeti hesapla ve kaydet
    calculated_cart = await calculate_and_save_cart(cart_doc, db)

    # Eğer hesaplama sonucu kampanya geçersiz kılındıysa hata döndür
    if not calculated_cart.get('campaign'):
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kampanya sepetinize uygulanamadı (örn: minimum tutar sağlanmadı).")


    return CartResponse(data=Cart.model_validate(calculated_cart))


@router.delete("/campaign", response_model=CartResponse)
async def remove_campaign_from_cart(request: Request, db: DBDep):
    """Sepetteki kampanyayı kaldırır."""
    identifier = await get_cart_identifier(request, db)
    carts_collection = db["carts"]

    cart_doc = await carts_collection.find_one(identifier)
    if not cart_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sepet bulunamadı.")

    if not cart_doc.get('campaign'):
        # Zaten kampanya yoksa bir şey yapma
        calculated_cart = await calculate_and_save_cart(cart_doc, db)
        return CartResponse(data=Cart.model_validate(calculated_cart))

    # Kampanyayı kaldır
    cart_doc['campaign'] = None
    cart_doc['discountAmount'] = 0

    # Sepeti hesapla ve kaydet
    calculated_cart = await calculate_and_save_cart(cart_doc, db)

    return CartResponse(data=Cart.model_validate(calculated_cart))