"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProducts, getCategories } from "../utils/api";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularProducts, setPopularProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
          { limit: 4 }
        );
        setPopularProducts(popularProductsResponse.data);

        // Yeni ürünleri getir (isNew=true parametresi ile)
        const newProductsResponse = await getProducts(
          { isNew: true },
          { limit: 4 }
        );
        setNewProducts(newProductsResponse.data);

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
            <div className="products-grid">
              {popularProducts.map((product) => (
                <Link
                  key={product.id || product._id}
                  href={`/urunler/${product.slug || product.id}`}
                  className="product"
                >
                  <div className="product-image-container">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0].url
                          : "https://placehold.co/800x1100/000000/FFFFFF/png?text=DOVL"
                      }
                      alt={product.name}
                      className="product-image"
                    />

                    <div className="product-tags">
                      {product.salePrice && (
                        <span className="product-tag product-tag-discount">
                          {Math.round(
                            (1 - product.salePrice / product.price) * 100
                          )}
                          %
                        </span>
                      )}

                      {product.isNew && (
                        <span className="product-tag product-tag-new">
                          YENİ
                        </span>
                      )}
                    </div>

                    <div className="product-quick-view">HIZLI İNCELE</div>
                  </div>

                  <h3 className="product-name">{product.name}</h3>

                  <div className="product-price">
                    {product.salePrice ? (
                      <>
                        <span className="product-price-original">
                          {product.price.toFixed(2)}TL
                        </span>
                        <span className="product-price-current">
                          {product.salePrice.toFixed(2)}TL
                        </span>
                      </>
                    ) : (
                      <span className="product-price-current">
                        {product.price.toFixed(2)}TL
                      </span>
                    )}
                  </div>
                </Link>
              ))}
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
            <div className="products-grid">
              {newProducts.map((product) => (
                <Link
                  key={product.id || product._id}
                  href={`/urunler/${product.slug || product.id}`}
                  className="product"
                >
                  <div className="product-image-container">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0].url
                          : "https://placehold.co/800x1100/000000/FFFFFF/png?text=DOVL"
                      }
                      alt={product.name}
                      className="product-image"
                    />

                    <div className="product-tags">
                      {product.salePrice && (
                        <span className="product-tag product-tag-discount">
                          {Math.round(
                            (1 - product.salePrice / product.price) * 100
                          )}
                          %
                        </span>
                      )}

                      {product.isNew && (
                        <span className="product-tag product-tag-new">
                          YENİ
                        </span>
                      )}
                    </div>

                    <div className="product-quick-view">HIZLI İNCELE</div>
                  </div>

                  <h3 className="product-name">{product.name}</h3>

                  <div className="product-price">
                    {product.salePrice ? (
                      <>
                        <span className="product-price-original">
                          {product.price.toFixed(2)}TL
                        </span>
                        <span className="product-price-current">
                          {product.salePrice.toFixed(2)}TL
                        </span>
                      </>
                    ) : (
                      <span className="product-price-current">
                        {product.price.toFixed(2)}TL
                      </span>
                    )}
                  </div>
                </Link>
              ))}
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
    </main>
  );
}
