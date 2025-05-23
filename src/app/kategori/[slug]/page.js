"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProducts, getCategories, addToCart } from '../../../utils/api';
import HoverQuickViewWrapper from "../../../components/HoverQuickViewWrapper";

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
              
              <Link 
                href={`/urunler/${product.slug || product.id}`}
                className="view-details-button"
              >
                ÜRÜN DETAYLARI
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CategoryPage() {
  const params = useParams();
  const { slug } = params;
  
  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("new");
  const [selectedFilters, setSelectedFilters] = useState({
    size: [],
    color: [],
    price: []
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0
  });
  
  // QuickView için state'ler
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Kategori başlığını formatlama
  const formatCategoryTitle = (slug) => {
    // Örnek: 'elbise' -> 'ELBİSE'
    // Türkçe karakterleri düzgün ele almalıyız
    const categoryMap = {
      'elbise': 'ELBİSE',
      'bluz': 'BLUZ',
      'etek': 'ETEK',
      'pantolon': 'PANTOLON',
      'aksesuar': 'AKSESUAR',
      'ceket': 'CEKET',
      'yaz-koleksiyonu': 'YAZ KOLEKSİYONU'
    };
    
    return categoryMap[slug] || slug.toUpperCase();
  };
  
  useEffect(() => {
    const loadCategoryProducts = async () => {
      setIsLoading(true);
      try {
        // Kategori bilgilerini ve ürünlerini getir
        const categoriesResponse = await getCategories();
        const foundCategory = categoriesResponse.data.find(cat => cat.slug === slug);
        if (foundCategory) {
          setCategoryInfo(foundCategory);
        }
        
        // Seçilen sıralama ve filtrelere göre ürünleri getir
        const minPrice = selectedFilters.price.find(p => p.includes('0-300')) ? 0 : null;
        const maxPrice = selectedFilters.price.find(p => p.includes('1000+')) ? null : 
                        selectedFilters.price.find(p => p.includes('500-1000')) ? 1000 :
                        selectedFilters.price.find(p => p.includes('300-500')) ? 500 : 
                        selectedFilters.price.find(p => p.includes('0-300')) ? 300 : null;
        
        const productsResponse = await getProducts(
          { 
            category: slug,
            minPrice,
            maxPrice,
          }, 
          { page: pagination.page, limit: pagination.limit }, 
          selectedSort
        );
        
        setProducts(productsResponse.data);
        setPagination(productsResponse.pagination);
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCategoryProducts();
  }, [slug, pagination.page, selectedSort, selectedFilters]);
  
  // Filtreleri Uygulama
  const applyFilters = () => {
    // Sayfayı ilk sayfaya döndür ve filtreleri uygula
    setPagination(prev => ({...prev, page: 1}));
  };
  
  // Filtre panelini açıp kapatma
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  // Filtreleri seçme işlemi
  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (newFilters[filterType].includes(value)) {
        // Eğer zaten seçili ise kaldır
        newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
      } else {
        // Seçili değilse ekle
        newFilters[filterType] = [...newFilters[filterType], value];
      }
      
      return newFilters;
    });
  };
  
  // Filtreleri temizleme
  const clearFilters = () => {
    setSelectedFilters({
      size: [],
      color: [],
      price: []
    });
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
      {/* Kategori Banner */}
      <section className="category-banner">
        <div className="category-banner-image" style={{ backgroundImage: "url('https://placehold.co/1920x400/1A1A1A/FFFFFF/png?text=DOVL')" }}></div>
        <div className="category-banner-overlay"></div>
        <div className="category-banner-content">
          <h1 className="category-banner-title">{categoryInfo?.name || formatCategoryTitle(slug)}</h1>
        </div>
      </section>
      
      {/* Ürün Listeleme */}
      <section className="section category-section">
        <div className="container">
          <div className="category-content">
            {/* Filtre Butonu (Mobil) */}
            <div className="filter-mobile-controls">
              <button className="filter-mobile-toggle" onClick={toggleFilter}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filtreler
              </button>
              
              <div className="sort-mobile">
                <select 
                  className="sort-select" 
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                >
                  <option value="new">Yeni Gelenler</option>
                  <option value="price_asc">Fiyat (Düşükten Yükseğe)</option>
                  <option value="price_high">Fiyat (Yüksekten Düşüğe)</option>
                  <option value="discount">İndirim Oranı</option>
                  <option value="name">İsim (A-Z)</option>
                </select>
              </div>
            </div>
            
            <div className={`category-layout ${isFilterOpen ? 'filter-open' : ''}`}>
              {/* Filtre Paneli */}
              <aside className="filter-panel">
                <div className="filter-panel-header">
                  <h3 className="filter-panel-title">Filtreler</h3>
                  <button className="filter-clear" onClick={clearFilters}>Temizle</button>
                  <button className="filter-close-mobile" onClick={toggleFilter}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Beden Filtresi */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Beden</h4>
                  <div className="filter-options">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <label key={size} className="filter-checkbox">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.size.includes(size)}
                          onChange={() => handleFilterChange('size', size)}
                        />
                        <span className="checkbox-text">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Renk Filtresi */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Renk</h4>
                  <div className="filter-options filter-colors">
                    {[
                      { name: 'Siyah', hex: '#000000' },
                      { name: 'Beyaz', hex: '#FFFFFF' },
                      { name: 'Kırmızı', hex: '#FF0000' },
                      { name: 'Mavi', hex: '#0000FF' },
                      { name: 'Yeşil', hex: '#008000' },
                      { name: 'Sarı', hex: '#FFFF00' },
                      { name: 'Pembe', hex: '#FFC0CB' },
                      { name: 'Mor', hex: '#800080' }
                    ].map(color => (
                      <label key={color.name} className="filter-color">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.color.includes(color.name)}
                          onChange={() => handleFilterChange('color', color.name)}
                        />
                        <span 
                          className="color-swatch" 
                          style={{ 
                            backgroundColor: color.hex,
                            border: color.name === 'Beyaz' ? '1px solid #e0e0e0' : 'none'
                          }}
                        ></span>
                        <span className="color-name">{color.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Fiyat Filtresi */}
                <div className="filter-group">
                  <h4 className="filter-group-title">Fiyat Aralığı</h4>
                  <div className="filter-options">
                    {[
                      { label: '0 TL - 300 TL', value: '0-300' },
                      { label: '300 TL - 500 TL', value: '300-500' },
                      { label: '500 TL - 1000 TL', value: '500-1000' },
                      { label: '1000 TL ve üzeri', value: '1000+' }
                    ].map(range => (
                      <label key={range.value} className="filter-checkbox">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.price.includes(range.value)}
                          onChange={() => handleFilterChange('price', range.value)}
                        />
                        <span className="checkbox-text">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Filtreleri Uygula Butonu (Mobil) */}
                <div className="filter-apply-mobile">
                  <button className="filter-apply-button" onClick={() => {
                    applyFilters();
                    setIsFilterOpen(false);
                  }}>
                    Filtreleri Uygula
                  </button>
                </div>
              </aside>
              
              {/* Ürün Grid */}
              <div className="category-products">
                {/* Sıralama ve Ürün Sayısı */}
                <div className="products-header">
                  <div className="products-count">
                    {pagination.total} ürün
                  </div>
                  
                  <div className="products-sort desktop-only">
                    <label htmlFor="sort">Sırala:</label>
                    <select 
                      id="sort" 
                      className="sort-select"
                      value={selectedSort}
                      onChange={(e) => setSelectedSort(e.target.value)}
                    >
                      <option value="new">Yeni Gelenler</option>
                      <option value="price_asc">Fiyat (Düşükten Yükseğe)</option>
                      <option value="price_high">Fiyat (Yüksekten Düşüğe)</option>
                      <option value="discount">İndirim Oranı</option>
                      <option value="name">İsim (A-Z)</option>
                    </select>
                  </div>
                </div>
                
                {/* Ürünler */}
                {isLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Ürünler yükleniyor...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="no-results">
                    <h3>Ürün Bulunamadı</h3>
                    <p>Arama kriterlerinize uygun ürün bulunamadı. Lütfen filtrelerinizi değiştirin veya tüm ürünleri görüntüleyin.</p>
                    <button className="btn" onClick={clearFilters}>Filtreleri Temizle</button>
                  </div>
                ) : (
                  <div className="products-grid">
                    {products.map((product) => (
                      <HoverQuickViewWrapper key={product.id || product._id} product={product}>
                        <div className="product-card-container">
                          <Link href={`/urunler/${product.slug || product.id}`} className="product">
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
                                    {Math.round((1 - product.salePrice / product.price) * 100)}%
                                  </span>
                                )}
                                
                                {product.isNew && (
                                  <span className="product-tag product-tag-new">
                                    YENİ
                                  </span>
                                )}
                              </div>
                              
                              <div 
                                className="product-quick-view"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  openQuickView(product, e);
                                }}
                              >
                                HIZLI İNCELE
                              </div>
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
                        </div>
                      </HoverQuickViewWrapper>
                    ))}
                  </div>
                )}

                {/* Sayfalama */}
                {!isLoading && products.length > 0 && pagination.totalPages > 1 && (
                  <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                    <button 
                      onClick={() => setPagination(prev => ({...prev, page: Math.max(1, prev.page - 1)}))}
                      disabled={pagination.page <= 1}
                      className="btn btn-outline"
                      style={{ margin: '0 0.5rem' }}
                    >
                      &lt; Önceki
                    </button>
                    
                    <span style={{ margin: '0 1rem', display: 'flex', alignItems: 'center' }}>
                      Sayfa {pagination.page} / {pagination.totalPages}
                    </span>
                    
                    <button 
                      onClick={() => setPagination(prev => ({...prev, page: Math.min(prev.totalPages, prev.page + 1)}))}
                      disabled={pagination.page >= pagination.totalPages}
                      className="btn btn-outline"
                      style={{ margin: '0 0.5rem' }}
                    >
                      Sonraki &gt;
                    </button>
                  </div>
                )}
              </div>
            </div>
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
      `}</style>
    </main>
  );
}