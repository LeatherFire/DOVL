"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  const { slug } = params;
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("new");
  const [selectedFilters, setSelectedFilters] = useState({
    size: [],
    color: [],
    price: []
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
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
  
  // Mock veriler - Daha sonra API'dan çekilecek
  useEffect(() => {
    // API çağrısını simüle etmek için setTimeout kullanıyoruz
    const timer = setTimeout(() => {
      // Her kategori için farklı ürünler oluşturalım
      const mockProducts = generateMockProducts(slug, 12);
      setProducts(mockProducts);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [slug]);
  
  // Mock ürün verisi oluşturma fonksiyonu
  const generateMockProducts = (category, count) => {
    const colors = ['Siyah', 'Beyaz', 'Kırmızı', 'Mavi', 'Sarı', 'Yeşil', 'Mor', 'Kahverengi'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', '36', '38', '40', '42'];
    
    // Kategori bazlı ürün çeşitlerini tanımlayalım
    const productTypes = {
      'elbise': ['Mini', 'Midi', 'Maxi', 'Uzun Kollu', 'Askılı', 'Dekolteli', 'Drapeli'],
      'bluz': ['Crop', 'V Yaka', 'Düşük Omuz', 'Dantelli', 'Basic', 'Bağcıklı', 'Düğmeli'],
      'etek': ['Mini', 'Midi', 'Maxi', 'Pileli', 'Kalem', 'A Kesim', 'Büzgülü'],
      'pantolon': ['Skinny', 'Wide Leg', 'Straight', 'Flare', 'High Waist', 'Paper Bag', 'Palazzo'],
      'aksesuar': ['Kolye', 'Bileklik', 'Küpe', 'Şal', 'Kemer', 'Şapka', 'Çanta'],
      'ceket': ['Blazer', 'Denim', 'Bomber', 'Trençkot', 'Kaşe', 'Deri', 'Oversize'],
      'yaz-koleksiyonu': ['Elbise', 'Bluz', 'Etek', 'Şort', 'Bikini', 'Mayo', 'Plaj Elbisesi']
    };
    
    const types = productTypes[category] || ['Standart', 'Özel', 'Premium', 'Günlük', 'Şık', 'Spor', 'Klasik'];
    
    // Ürün kartlarını oluşturalım
    return Array.from({ length: count }, (_, i) => {
      const type = types[Math.floor(Math.random() * types.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isNew = Math.random() > 0.7; // %30 ihtimalle yeni ürün
      const hasDiscount = Math.random() > 0.5; // %50 ihtimalle indirimli
      const basePrice = Math.floor(Math.random() * 1000) + 300; // 300-1300 TL arası
      const discountRate = hasDiscount ? (Math.floor(Math.random() * 4) + 2) * 10 : 0; // %20, %30, %40, %50 indirimler
      const salePrice = hasDiscount ? basePrice * (1 - discountRate / 100) : null;
      
      return {
        id: `${category}-${i + 1}`,
        name: `${color} ${type} ${formatCategoryTitle(category)}`,
        price: basePrice,
        salePrice: salePrice,
        image: `https://placehold.co/1200x1600/${color === 'Beyaz' ? 'FFFFFF' : color === 'Siyah' ? '000000' : Math.floor(Math.random()*16777215).toString(16)}/1A1A1A/png?text=DOVL`,
        category: category,
        isNew: isNew,
        color: color,
        sizes: sizes.slice(0, Math.floor(Math.random() * sizes.length) + 3), // Rastgele beden sayısı
        stockLevel: Math.floor(Math.random() * 30) + 1 // 1-30 arası stok
      };
    });
  };
  
  // Filtreleri Uygulama
  const applyFilters = () => {
    // Gerçek projede API sorgusu gönderilecek
    console.log("Uygulanan filtreler:", selectedFilters);
  };
  
  // Filtreleme ve sıralama işlemleri için
  const sortProducts = (products, sortType) => {
    const sortedProducts = [...products];
    
    switch(sortType) {
      case "price-low":
        return sortedProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      case "price-high":
        return sortedProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      case "discount":
        return sortedProducts.sort((a, b) => {
          if (a.salePrice && b.salePrice) {
            const discountA = 1 - (a.salePrice / a.price);
            const discountB = 1 - (b.salePrice / b.price);
            return discountB - discountA;
          } else if (a.salePrice) {
            return -1;
          } else if (b.salePrice) {
            return 1;
          }
          return 0;
        });
      case "name":
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case "new":
      default:
        return sortedProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
  };
  
  const displayedProducts = sortProducts(products, selectedSort);
  
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
          <h1 className="category-banner-title">{formatCategoryTitle(slug)}</h1>
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
                  <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
                  <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
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
                    {products.length} ürün
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
                      <option value="price-low">Fiyat (Düşükten Yükseğe)</option>
                      <option value="price-high">Fiyat (Yüksekten Düşüğe)</option>
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
                ) : displayedProducts.length === 0 ? (
                  <div className="products-empty">
                    <p>Bu kategoride ürün bulunamadı.</p>
                  </div>
                ) : (
                  <div className="products-grid">
                    {displayedProducts.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/urunler/${product.id}`}
                        className="product"
                      >
                        <div className="product-image-container">
                          <img 
                            src={product.image}
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}