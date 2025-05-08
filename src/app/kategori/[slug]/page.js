"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProducts, getCategories } from '../../../utils/api';

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
                  <div className="products-loading">
                    <div className="loading-spinner"></div>
                    <p>Ürünler yükleniyor...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="products-empty">
                    <p>Bu kategoride ürün bulunamadı.</p>
                  </div>
                ) : (
                  <div className="products-grid">
                    {products.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/urunler/${product.slug || product.id}`}
                        className="product"
                      >
                        <div className="product-image-container">
                          <img 
                            src={product.images && product.images.length > 0 ? product.images[0].url : "https://placehold.co/800x1100/000000/FFFFFF/png?text=DOVL"}
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
                          
                          <div className="product-quick-view">
                            HIZLI İNCELE
                          </div>
                        </div>
                        
                        <h3 className="product-name">{product.name}</h3>
                        
                        <div className="product-price">
                          {product.salePrice ? (
                            <>
                              <span className="product-price-original">{product.price.toFixed(2)}TL</span>
                              <span className="product-price-current">{product.salePrice.toFixed(2)}TL</span>
                            </>
                          ) : (
                            <span className="product-price-current">{product.price.toFixed(2)}TL</span>
                          )}
                        </div>
                      </Link>
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
    </main>
  );
}