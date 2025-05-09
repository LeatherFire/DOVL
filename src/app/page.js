"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getProducts, getCategories, addToCart } from "../utils/api";
import HoverQuickViewWrapper from "../components/HoverQuickViewWrapper";
import ProductCard from "../components/ProductCard";
import "../components/product-styles.css";
// Swiper için gerekli importlar
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
// Swiper stilleri
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// QuickView Modal Komponenti
const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Ürün yüklendiğinde varsayılan beden seçimi
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      // Stokta olan ilk bedeni seç
      const availableVariant = product.variants.find(v => v.stock > 0);
      if (availableVariant) {
        setSelectedSize(availableVariant.size);
      }
    }
  }, [product]);

  // Sepete ekleme fonksiyonu
  const handleAddToCart = async () => {
    if (!selectedSize) {
      setMessage({ type: "error", text: "Lütfen bir beden seçiniz" });
      return;
    }

    const selectedVariant = product.variants.find(v => v.size === selectedSize);
    if (!selectedVariant) {
      setMessage({ type: "error", text: "Seçilen beden bulunamadı" });
      return;
    }

    if (selectedVariant.stock < quantity) {
      setMessage({ 
        type: "error", 
        text: `Seçilen miktar için yeterli stok yok. Mevcut stok: ${selectedVariant.stock}` 
      });
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart({
        productId: product.id || product._id,
        variantSku: selectedVariant.sku,
        quantity: quantity
      });

      setMessage({ type: "success", text: "Ürün sepetinize eklendi!" });
      
      // 3 saniye sonra mesajı temizle
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Sepete eklerken hata:", error);
      setMessage({ 
        type: "error", 
        text: error.message || "Sepete eklerken bir hata oluştu" 
      });
    } finally {
      setAddingToCart(false);
    }
  };

  // Modal açık değilse hiçbir şey render etme
  if (!isOpen || !product) return null;

  return (
    <div className="quick-view-modal" onClick={onClose}>
      <div className="quick-view-content" onClick={e => e.stopPropagation()}>
        <button className="quick-view-close" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="quick-view-grid">
          {/* Sol - Ürün Görselleri */}
          <div className="quick-view-images">
            <div className="main-image">
              <img 
                src={product.images && product.images.length > 0 
                  ? product.images[selectedImage]?.url 
                  : "https://placehold.co/800x1100/000000/FFFFFF/png?text=DOVL"
                }
                alt={product.name}
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.slice(0, 4).map((image, index) => (
                  <div 
                    key={index} 
                    className={`image-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image.url} alt={`${product.name} - ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sağ - Ürün Bilgileri */}
          <div className="quick-view-details">
            <h2 className="quick-view-title">{product.name}</h2>
            
            <div className="quick-view-price">
              {product.salePrice ? (
                <>
                  <span className="price-original">{product.price.toFixed(2)}TL</span>
                  <span className="price-current">{product.salePrice.toFixed(2)}TL</span>
                </>
              ) : (
                <span className="price-current">{product.price.toFixed(2)}TL</span>
              )}
            </div>

            <div className="quick-view-description">
              <p>{product.description}</p>
            </div>

            {/* Beden Seçimi */}
            <div className="quick-view-sizes">
              <h3>Beden:</h3>
              <div className="size-options">
                {product.variants && product.variants.map((variant) => {
                  const isSelected = selectedSize === variant.size;
                  const isDisabled = variant.stock <= 0;

                  return (
                    <button
                      key={variant.sku}
                      className={`size-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => !isDisabled && setSelectedSize(variant.size)}
                      disabled={isDisabled}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Miktar Seçimi */}
            <div className="quick-view-quantity">
              <h3>Adet:</h3>
              <div className="quantity-selector">
                <button 
                  className="quantity-button"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) setQuantity(value);
                  }} 
                  min="1"
                  className="quantity-input"
                />
                <button 
                  className="quantity-button"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Mesaj Alanı */}
            {message.text && (
              <div className={`quick-view-message ${message.type}`}>
                {message.text}
              </div>
            )}

            {/* Sepete Ekle ve Ürün Detayı Butonları */}
            <div className="quick-view-actions">
              <button 
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? "EKLENİYOR..." : "SEPETE EKLE"}
              </button>
              
              <button 
                className="view-details-button"
                onClick={() => window.location.href = `/urunler/${product.slug || product.id}`}
              >
                ÜRÜN DETAYLARI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularProducts, setPopularProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hızlı inceleme için state'ler
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Mock veriler
  const sliderData = [
    {
      id: 1,
      title: "TÜM ÜRÜNLERDE",
      subtitle: "NET",
      highlight: "%50 İNDİRİM",
      image: "https://placehold.co/2560x1440/8B0000/FFFFFF/png?text=DOVL",
      buttonText: "ALIŞVERİŞE BAŞLA",
      buttonLink: "/urunler",
    },
    {
      id: 2,
      title: "YAZ KOLEKSİYONU",
      subtitle: "2025",
      highlight: "KEŞFET",
      image: "https://placehold.co/2560x1440/1A1A1A/FFFFFF/png?text=DOVL",
      buttonText: "ALIŞVERİŞE BAŞLA",
      buttonLink: "/urunler",
    },
  ];

  // Veri yükleme
  useEffect(() => {
    const loadHomePageData = async () => {
      setIsLoading(true);
      try {
        // Popüler ürünleri getir (isFeatured=true parametresi ile)
        const popularProductsResponse = await getProducts(
          { isFeatured: true },
          { limit: 10 } // Limit artırıldı
        );
        setPopularProducts(popularProductsResponse.data);

        // Yeni ürünleri getir (isNew=true parametresi ile)
        const newProductsResponse = await getProducts(
          { isNew: true },
          { limit: 10 } // Limit artırıldı
        );
        setNewProducts(newProductsResponse.data);
        
        // Benzer ürünleri getir (normal ürünler)
        const similarProductsResponse = await getProducts(
          {},
          { limit: 10 } // Benzer ürünler için limit
        );
        setSimilarProducts(similarProductsResponse.data);

        // Kategorileri getir
        const categoriesResponse = await getCategories();
        // İlk 3 kategoriyi al
        setCategories(categoriesResponse.data.slice(0, 3));
      } catch (error) {
        console.error("Ana sayfa verileri yüklenirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomePageData();
  }, []);

  // Slider için otomatik geçiş
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === sliderData.length - 1 ? 0 : prev + 1
      );
    }, 6000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  // Slider kontrolü
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  // Hızlı inceleme modalını açma fonksiyonu
  const openQuickView = (product, e) => {
    if (e) {
      e.preventDefault(); // Link yönlendirmesini engelle
      e.stopPropagation(); // Event'in başka elementlere geçmesini engelle
    }
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  // Hızlı inceleme modalını kapatma fonksiyonu
  const closeQuickView = () => {
    setQuickViewOpen(false);
    // Modalı kapattıktan kısa bir süre sonra seçili ürünü temizle
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  };

  return (
    <main>
      {/* Hero Slider */}
      <section className="hero-slider">
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
          >
            <div
              className="hero-background"
              style={{ backgroundImage: `url(${slide.image})` }}
            ></div>
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h2 className="hero-title">{slide.title}</h2>
              <h3 className="hero-subtitle">{slide.subtitle}</h3>
              <h1 className="hero-highlight">{slide.highlight}</h1>
              <Link
                href={slide.buttonLink}
                className="btn btn-white hero-button"
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="hero-prev"
          aria-label="Önceki Slayt"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="32"
            height="32"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="hero-next"
          aria-label="Sonraki Slayt"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="32"
            height="32"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <div className="hero-nav">
          {sliderData.map((_, index) => (
            <div
              key={index}
              className={`hero-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      </section>

      {/* Kategoriler */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">KATEGORİLER</h2>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Kategoriler yükleniyor...</p>
            </div>
          ) : (
            <div className="categories">
              {categories.map((category) => (
                <Link
                  key={category.id || category._id}
                  href={`/kategori/${category.slug}`}
                  className="category"
                >
                  <div
                    className="category-image"
                    style={{
                      backgroundImage: `url(${
                        category.image ||
                        `https://placehold.co/1200x1600/A0A0A0/FFFFFF/png?text=${category.name}`
                      })`,
                    }}
                  ></div>
                  <div className="category-overlay">
                    <span className="category-subtitle">Yeni Sezon</span>
                    <h3 className="category-title">{category.name}</h3>
                    <div className="category-line"></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popüler Ürünler */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">POPÜLER ÜRÜNLER</h2>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Ürünler yükleniyor...</p>
            </div>
          ) : (
            <div className="products-carousel">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 10 },
                  640: { slidesPerView: 2, spaceBetween: 15 },
                  768: { slidesPerView: 3, spaceBetween: 15 },
                  1024: { slidesPerView: 4, spaceBetween: 20 },
                }}
              >
                {popularProducts.map((product, index) => (
                  <SwiperSlide key={`popular-${product.id || product._id || index}`}>
                    <ProductCard 
                      product={product} 
                      onQuickView={openQuickView}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </section>

      {/* Özel Koleksiyon */}
      <section className="feature-section">
        <div
          className="feature-background"
          style={{
            backgroundImage:
              "url('https://placehold.co/2560x1440/1A1A1A/FFFFFF/png?text=DOVL')",
          }}
        ></div>
        <div className="feature-overlay">
          <h2 className="feature-title">YAZ KOLEKSİYONU</h2>
          <p className="feature-description">
            Modern tasarımlar, yüksek kaliteli kumaşlar ve zamansız parçalarla
            bu yazın en şık hali.
          </p>
          <Link href="/kategori/yaz-koleksiyonu" className="btn btn-white">
            KOLEKSİYONU KEŞFET
          </Link>
        </div>
      </section>

      {/* Marka Vaadi */}
      <section className="section promise-section">
        <div className="container">
          <div className="promises">
            <div className="promise">
              <div className="promise-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <h3 className="promise-title">KOLAY İADE</h3>
              <p className="promise-text">
                14 gün içerisinde ücretsiz iade imkanı.
              </p>
            </div>

            <div className="promise">
              <div className="promise-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="promise-title">GÜVENLI ÖDEME</h3>
              <p className="promise-text">
                256-bit SSL şifrelemeli güvenli ödeme altyapısı.
              </p>
            </div>

            <div className="promise">
              <div className="promise-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
                  />
                </svg>
              </div>
              <h3 className="promise-title">PREMIUM KALİTE</h3>
              <p className="promise-text">
                En kaliteli kumaşlarla üretilen uzun ömürlü tasarımlar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Yeni Ürünler */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">EN YENİ ÜRÜNLER</h2>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Ürünler yükleniyor...</p>
            </div>
          ) : (
            <div className="products-carousel">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 10 },
                  640: { slidesPerView: 2, spaceBetween: 15 },
                  768: { slidesPerView: 3, spaceBetween: 15 },
                  1024: { slidesPerView: 4, spaceBetween: 20 },
                }}
              >
                {newProducts.map((product, index) => (
                  <SwiperSlide key={`new-${product.id || product._id || index}`}>
                    <ProductCard 
                      product={product} 
                      onQuickView={openQuickView}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </section>

      {/* Benzer Ürünler */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">BENZER ÜRÜNLER</h2>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Ürünler yükleniyor...</p>
            </div>
          ) : (
            <div className="products-carousel">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 10 },
                  640: { slidesPerView: 2, spaceBetween: 15 },
                  768: { slidesPerView: 3, spaceBetween: 15 },
                  1024: { slidesPerView: 4, spaceBetween: 20 },
                }}
              >
                {similarProducts.map((product, index) => (
                  <SwiperSlide key={`similar-${product.id || product._id || index}`}>
                    <ProductCard 
                      product={product} 
                      onQuickView={openQuickView}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </section>

      {/* Instagram Galerisi */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">BİZİ TAKİP EDİN</h2>

          <div className="instagram-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <a
                key={index}
                href="#"
                className="instagram-item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`https://placehold.co/600x600/${
                    index % 2 === 0 ? "1A1A1A" : "8B0000"
                  }/FFFFFF/png?text=@DOVL`}
                  alt="Instagram Post"
                  className="instagram-image"
                />
                <div className="instagram-overlay">
                  <div className="instagram-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      width="32"
                      height="32"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* E-bülten Aboneliği */}
      <section className="section newsletter-section">
        <div className="container">
          <div className="newsletter-container">
            <h3 className="newsletter-title">BİZDEN HABERDAR OLUN</h3>
            <p className="newsletter-text">
              Yeni ürünler, özel indirimler ve kampanyalardan ilk sizin
              haberiniz olsun.
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-button">
                ABONE OL
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* QuickView Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          isOpen={quickViewOpen}
          onClose={closeQuickView}
        />
      )}

      {/* Hızlı İnceleme stil kuralları */}
      <style jsx global>{`
        .product-card-container {
          position: relative;
          overflow: hidden;
        }
        
        .product-image-container {
          position: relative;
          overflow: hidden;
        }
        
        .product-quick-view {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          text-align: center;
          padding: 10px 0;
          transform: translateY(100%);
          transition: transform 0.3s ease;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 1px;
          z-index: 10;
        }
        
        .product-image-container:hover .product-quick-view {
          transform: translateY(0);
        }
        
        /* Hızlı İnceleme Modal Stilleri */
        .quick-view-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .quick-view-content {
          background: white;
          max-width: 1000px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .quick-view-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 10;
        }
        
        .quick-view-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        
        @media (max-width: 768px) {
          .quick-view-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .quick-view-images {
          display: flex;
          flex-direction: column;
        }
        
        .main-image {
          width: 100%;
          margin-bottom: 15px;
        }
        
        .main-image img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        
        .image-thumbnails {
          display: flex;
          gap: 10px;
        }
        
        .image-thumbnail {
          width: 70px;
          height: 70px;
          cursor: pointer;
          border: 2px solid transparent;
        }
        
        .image-thumbnail.active {
          border-color: #333;
        }
        
        .image-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .quick-view-details {
          display: flex;
          flex-direction: column;
        }
        
        .quick-view-title {
          font-size: 24px;
          font-weight: 500;
          margin-bottom: 15px;
        }
        
        .quick-view-price {
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .price-original {
          text-decoration: line-through;
          color: #999;
          margin-right: 10px;
        }
        
        .price-current {
          font-weight: 600;
          color: #000;
        }
        
        .quick-view-description {
          margin-bottom: 20px;
          color: #555;
          line-height: 1.5;
        }
        
        .quick-view-sizes h3,
        .quick-view-quantity h3 {
          margin-bottom: 10px;
          font-size: 16px;
          font-weight: 500;
        }
        
        .size-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .size-option {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          min-width: 40px;
          text-align: center;
        }
        
        .size-option.selected {
          border-color: #000;
          background: #000;
          color: white;
        }
        
        .size-option.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          text-decoration: line-through;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .quantity-button {
          width: 35px;
          height: 35px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          font-size: 18px;
          cursor: pointer;
        }
        
        .quantity-input {
          width: 50px;
          height: 35px;
          border: 1px solid #ddd;
          text-align: center;
          margin: 0 5px;
        }
        
        .quick-view-message {
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        
        .quick-view-message.error {
          background-color: #fff0f0;
          color: #e53e3e;
          border: 1px solid #f5b7b7;
        }
        
        .quick-view-message.success {
          background-color: #f0fff4;
          color: #38a169;
          border: 1px solid #b7f5c6;
        }
        
        .quick-view-actions {
          display: flex;
          gap: 15px;
        }
        
        .add-to-cart-button {
          flex: 1;
          padding: 12px 20px;
          background-color: #000;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 500;
          letter-spacing: 1px;
          transition: background-color 0.3s ease;
        }
        
        .add-to-cart-button:hover {
          background-color: #333;
        }
        
        .view-details-button {
          flex: 1;
          padding: 12px 20px;
          background-color: white;
          color: #000;
          border: 1px solid #000;
          text-align: center;
          font-weight: 500;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }
        
        .view-details-button:hover {
          background-color: #f5f5f5;
        }
        
        /* Swiper Carousel Stilleri */
        .products-carousel {
          position: relative;
          margin: 0 -10px 40px;
          padding: 0 10px;
        }
        
        .products-carousel .swiper-button-next,
        .products-carousel .swiper-button-prev {
          color: #000;
          background: rgba(255, 255, 255, 0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .products-carousel .swiper-button-next:after,
        .products-carousel .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }
        
        .products-carousel .swiper-button-disabled {
          opacity: 0.35;
        }
        
        .products-carousel .swiper-pagination {
          bottom: -30px;
        }
        
        .products-carousel .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
        }
        
        .products-carousel .swiper-pagination-bullet-active {
          background: #000;
        }
        
        @media (max-width: 768px) {
          .products-carousel .swiper-button-next,
          .products-carousel .swiper-button-prev {
            width: 30px;
            height: 30px;
          }
          
          .products-carousel .swiper-button-next:after,
          .products-carousel .swiper-button-prev:after {
            font-size: 14px;
          }
        }
      `}</style>
    </main>
  );
}
