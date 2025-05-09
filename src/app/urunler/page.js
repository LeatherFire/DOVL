"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, getCategories, addToCart } from '../../utils/api';
import HoverQuickViewWrapper from '../../components/HoverQuickViewWrapper';
import ProductCard from '../../components/ProductCard';
import "../../components/product-styles.css";

// Ürün Hızlı İnceleme Komponenti
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
                {product.variants.map((variant) => {
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

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("new");
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
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
  
  // Hızlı inceleme için yeni state'ler
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Boyut ve renk seçenekleri
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    { name: "Siyah", hex: "#000000" },
    { name: "Beyaz", hex: "#FFFFFF" },
    { name: "Kırmızı", hex: "#FF0000" },
    { name: "Mavi", hex: "#0000FF" },
    { name: "Yeşil", hex: "#008000" },
    { name: "Sarı", hex: "#FFFF00" },
    { name: "Pembe", hex: "#FFC0CB" },
    { name: "Mor", hex: "#800080" },
  ];
  
  // Fiyat aralıkları
  const priceRanges = [
    { id: "0-300", label: "0 TL - 300 TL" },
    { id: "300-500", label: "300 TL - 500 TL" },
    { id: "500-1000", label: "500 TL - 1000 TL" },
    { id: "1000+", label: "1000 TL ve üzeri" }
  ];
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Kategoriler yüklenirken hata:", error);
      }
    };
    
    loadCategories();
  }, []);
  
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        // Kategori filtresi
        let categoryFilter = {};
        if (selectedFilters.category.length > 0) {
          categoryFilter = { category: selectedFilters.category[0] };
        }
        
        // Fiyat filtresi
        const minPrice = selectedFilters.price.find(p => p.includes('0-300')) ? 0 : null;
        const maxPrice = selectedFilters.price.find(p => p.includes('1000+')) ? null : 
                        selectedFilters.price.find(p => p.includes('500-1000')) ? 1000 :
                        selectedFilters.price.find(p => p.includes('300-500')) ? 500 : 
                        selectedFilters.price.find(p => p.includes('0-300')) ? 300 : null;
        
        const filters = {
          ...categoryFilter,
          minPrice,
          maxPrice
        };
        
        const sortMapping = {
          "new": "createdAt_desc",
          "price_asc": "price_asc",
          "price_high": "price_desc",
          "discount": "discount_desc",
          "name": "name_asc"
        };
        
        const productsResponse = await getProducts(
          filters, 
          { page: pagination.page, limit: pagination.limit }, 
          sortMapping[selectedSort] || "createdAt_desc"
        );
        
        setProducts(productsResponse.data || []);
        setPagination(productsResponse.pagination || {
          total: 0,
          page: 1,
          limit: 12,
          totalPages: 0
        });
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [pagination.page, selectedSort, selectedFilters]);
  
  // Filtreleri Uygulama
  const applyFilters = () => {
    // Sayfayı ilk sayfaya döndür ve filtreleri uygula
    setPagination(prev => ({...prev, page: 1}));
    setIsFilterOpen(false);
  };
  
  // Filtreleri temizleme
  const clearFilters = () => {
    setSelectedFilters({
      category: [],
      size: [],
      color: [],
      price: []
    });
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
      
      // Kategori için sadece bir seçim yapılabilir
      if (filterType === 'category') {
        if (newFilters[filterType].includes(value)) {
          newFilters[filterType] = [];
        } else {
          newFilters[filterType] = [value];
        }
      } else {
        // Diğer filtreler için çoklu seçim
        if (newFilters[filterType].includes(value)) {
          // Eğer zaten seçili ise kaldır
          newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
        } else {
          // Seçili değilse ekle
          newFilters[filterType] = [...newFilters[filterType], value];
        }
      }
      
      return newFilters;
    });
  };
  
  // Sayfa değiştirme
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({...prev, page: newPage}));
    }
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
      {/* Ürünler Banner */}
      <section className="category-banner">
        <div className="category-banner-image" style={{ backgroundImage: "url('https://placehold.co/1920x400/1A1A1A/FFFFFF/png?text=DOVL')" }}></div>
        <div className="category-banner-overlay"></div>
        <div className="category-banner-content">
          <h1 className="category-banner-title">ÜRÜNLER</h1>
        </div>
      </section>
      
      {/* Ürün Listeleme */}
      <section className="category-section">
        <div className="container">
          {/* Mobil Filtre Kontrolleri */}
          <div className="filter-mobile-controls">
            <button className="filter-mobile-toggle" onClick={toggleFilter}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18" />
              </svg>
              Filtre ve Sıralama
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
            <div className="filter-panel">
              <div className="filter-panel-header">
                <h2 className="filter-panel-title">Filtreler</h2>
                <button className="filter-clear" onClick={clearFilters}>
                  Temizle
                </button>
                <button className="filter-close-mobile" onClick={toggleFilter}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Kategori Filtresi */}
              <div className="filter-group">
                <h3 className="filter-group-title">Kategori</h3>
                <div className="filter-options">
                  {categories.map((category) => (
                    <label key={category.id || category._id} className="filter-checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedFilters.category.includes(category.slug)}
                        onChange={() => handleFilterChange('category', category.slug)}
                      />
                      <span className="checkbox-text">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Beden Filtresi */}
              <div className="filter-group">
                <h3 className="filter-group-title">Beden</h3>
                <div className="filter-options">
                  {sizes.map((size) => (
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
                <h3 className="filter-group-title">Renk</h3>
                <div className="filter-colors">
                  {colors.map((color) => (
                    <label key={color.name} className="filter-color">
                      <input 
                        type="checkbox"
                        checked={selectedFilters.color.includes(color.name)}
                        onChange={() => handleFilterChange('color', color.name)}
                      />
                      <span 
                        className="color-swatch" 
                        style={{ backgroundColor: color.hex, border: color.hex === "#FFFFFF" ? "1px solid #ddd" : "none" }}
                      ></span>
                      <span className="color-name">{color.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Fiyat Filtresi */}
              <div className="filter-group">
                <h3 className="filter-group-title">Fiyat</h3>
                <div className="filter-options">
                  {priceRanges.map((range) => (
                    <label key={range.id} className="filter-checkbox">
                      <input 
                        type="checkbox"
                        checked={selectedFilters.price.includes(range.id)}
                        onChange={() => handleFilterChange('price', range.id)}
                      />
                      <span className="checkbox-text">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Mobil Uygula Butonu */}
              <div className="filter-apply-mobile">
                <button className="filter-apply-button" onClick={applyFilters}>
                  Filtreleri Uygula
                </button>
              </div>
            </div>
            
            <div className="category-content">
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
                  <div className="products-loading">
                    <div className="loading-spinner"></div>
                    <p>Ürünler yükleniyor...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="products-empty">
                    <p>Kriterlere uygun ürün bulunamadı.</p>
                  </div>
                ) : (
                  <div className="products-grid">
                    {products.map((product, index) => (
                      <ProductCard 
                        key={`product-${product.id || product._id || index}`} 
                        product={product} 
                        onQuickView={openQuickView}
                      />
                    ))}
                  </div>
                )}
                
                {/* Sayfalama */}
                {!isLoading && pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      className="pagination-button"
                      onClick={() => changePage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === pagination.totalPages || 
                        (page >= pagination.page - 1 && page <= pagination.page + 1)
                      )
                      .map((page, index, array) => {
                        // Sayfa boşluğu gösterme
                        if (index > 0 && array[index - 1] !== page - 1) {
                          return (
                            <span key={`gap-${page}`} className="pagination-gap">...</span>
                          );
                        }
                        
                        return (
                          <button 
                            key={page} 
                            className={`pagination-page ${pagination.page === page ? 'active' : ''}`}
                            onClick={() => changePage(page)}
                          >
                            {page}
                          </button>
                        );
                      })
                    }
                    
                    <button 
                      className="pagination-button"
                      onClick={() => changePage(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Hızlı İnceleme Modalı */}
      <QuickViewModal 
        product={selectedProduct} 
        isOpen={quickViewOpen} 
        onClose={closeQuickView} 
      />
      
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
          text-align: center;
          border: 1px solid #ddd;
          border-left: none;
          border-right: none;
        }
        
        .quick-view-message {
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        
        .quick-view-message.error {
          background: #ffe6e6;
          color: #d32f2f;
          border: 1px solid #ffcccc;
        }
        
        .quick-view-message.success {
          background: #e8f5e9;
          color: #2e7d32;
          border: 1px solid #c8e6c9;
        }
        
        .quick-view-actions {
          display: flex;
          gap: 15px;
        }
        
        .add-to-cart-button,
        .view-details-button {
          flex: 1;
          padding: 12px 20px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .add-to-cart-button {
          background: #000;
          color: white;
          border: none;
        }
        
        .add-to-cart-button:disabled {
          background: #999;
          cursor: not-allowed;
        }
        
        .view-details-button {
          background: white;
          color: #000;
          border: 1px solid #000;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .add-to-cart-button:hover:not(:disabled) {
          background: #333;
        }
        
        .view-details-button:hover {
          background: #f5f5f5;
        }
      `}</style>
    </main>
  );
} 