"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getProducts } from '../../utils/api';
import ProductCard from '../../components/ProductCard';
import '../../components/product-styles.css';

// Sahte veri - API çağrısı başarısız olursa kullanılacak
const mockProducts = [
  {
    id: '1',
    name: 'Siyah Midi Elbise',
    slug: 'siyah-midi-elbise',
    price: 599.99,
    salePrice: 499.99,
    images: ['https://placehold.co/800x1100/111111/FFFFFF/png?text=Elbise+1'],
    isNew: true
  },
  {
    id: '2',
    name: 'Beyaz Bluz',
    slug: 'beyaz-bluz',
    price: 299.99,
    images: ['https://placehold.co/800x1100/EEEEEE/000000/png?text=Bluz+1'],
    isNew: false
  },
  {
    id: '3',
    name: 'Denim Pantolon',
    slug: 'denim-pantolon',
    price: 399.99,
    salePrice: 349.99,
    images: ['https://placehold.co/800x1100/0000AA/FFFFFF/png?text=Pantolon+1'],
    isNew: false
  },
  {
    id: '4',
    name: 'Kırmızı Ceket',
    slug: 'kirmizi-ceket',
    price: 799.99,
    images: ['https://placehold.co/800x1100/AA0000/FFFFFF/png?text=Ceket+1'],
    isNew: true
  }
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('createdAt_desc');
  const [error, setError] = useState(null);
  
  // QuickView state'leri
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await getProducts({ q: query }, { page: currentPage, limit: 20 }, sort);
        setProducts(result.data || []);
        setTotalCount(result.total || result.data?.length || 0);
        setTotalPages(result.totalPages || 1);
      } catch (error) {
        console.error("Arama sonuçları yüklenirken hata:", error);
        setError("Arama sonuçları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query, currentPage, sort]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
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
    <main className="search-results-page">
      <div className="container">
        <div className="search-header">
          <h1 className="page-title">
            {query ? `"${query}" için arama sonuçları` : 'Arama Sonuçları'}
          </h1>
          
          {query && (
            <div className="search-info">
              {loading ? (
                <p>Aranıyor...</p>
              ) : (
                <p>Toplam {totalCount} ürün bulundu</p>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <div className="search-error">
            <p>{error}</p>
          </div>
        )}
        
        {!query && !loading && (
          <div className="search-empty-query">
            <div className="search-empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2>Lütfen bir arama sorgusu girin</h2>
            <p>Arama yapmak için üst menüdeki arama simgesine tıklayarak bir sorgu girebilirsiniz.</p>
          </div>
        )}
        
        {query && !loading && products.length === 0 && !error && (
          <div className="search-no-results">
            <div className="search-empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2>Sonuç bulunamadı</h2>
            <p>"{query}" için herhangi bir sonuç bulunamadı. Lütfen farklı anahtar kelimelerle tekrar deneyin.</p>
            <div className="search-suggestions">
              <h3>Öneriler:</h3>
              <ul>
                <li>Farklı anahtar kelimeler kullanmayı deneyin</li>
                <li>Daha genel arama terimleri kullanın</li>
                <li>Yazım hatası olmadığından emin olun</li>
              </ul>
            </div>
            <Link href="/urunler" className="btn btn-primary">
              Tüm Ürünlere Göz At
            </Link>
          </div>
        )}
        
        {query && !loading && products.length > 0 && (
          <>
            <div className="search-toolbar">
              <div className="search-sort">
                <label htmlFor="sort-select">Sırala:</label>
                <select 
                  id="sort-select" 
                  value={sort} 
                  onChange={handleSortChange}
                  className="sort-select"
                >
                  <option value="createdAt_desc">En Yeniler</option>
                  <option value="price_asc">Fiyat (Düşükten Yükseğe)</option>
                  <option value="price_desc">Fiyat (Yüksekten Düşüğe)</option>
                  <option value="name_asc">İsim (A-Z)</option>
                  <option value="name_desc">İsim (Z-A)</option>
                </select>
              </div>
            </div>
            
            <div className="products-grid">
              {products.map((product, index) => (
                <ProductCard 
                  key={`search-product-${product.id || product._id || index}`} 
                  product={product} 
                  onQuickView={openQuickView}
                />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage <= 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Önceki
                </button>
                
                <div className="pagination-pages">
                  {currentPage > 1 && (
                    <button
                      className="pagination-page"
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>
                  )}
                  
                  {currentPage > 3 && (
                    <span className="pagination-ellipsis">...</span>
                  )}
                  
                  {currentPage > 2 && (
                    <button
                      className="pagination-page"
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      {currentPage - 1}
                    </button>
                  )}
                  
                  <button
                    className="pagination-page active"
                    disabled
                  >
                    {currentPage}
                  </button>
                  
                  {currentPage < totalPages - 1 && (
                    <button
                      className="pagination-page"
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      {currentPage + 1}
                    </button>
                  )}
                  
                  {currentPage < totalPages - 2 && (
                    <span className="pagination-ellipsis">...</span>
                  )}
                  
                  {currentPage < totalPages && (
                    <button
                      className="pagination-page"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  )}
                </div>
                
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage >= totalPages}
                >
                  Sonraki
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
        
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Arama sonuçları yükleniyor...</p>
          </div>
        )}

        {/* Quick View Modal */}
        {quickViewOpen && selectedProduct && (
          <div className="quick-view-modal" onClick={closeQuickView}>
            <div className="quick-view-content" onClick={e => e.stopPropagation()}>
              <button className="quick-view-close" onClick={closeQuickView}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="quick-view-grid">
                {/* Sol - Ürün Görselleri */}
                <div className="quick-view-images">
                  <div className="main-image">
                    <img 
                      src={selectedProduct.images && selectedProduct.images.length > 0 
                        ? (typeof selectedProduct.images[0] === 'string' ? selectedProduct.images[0] : selectedProduct.images[0].url) 
                        : "https://placehold.co/800x1100/000000/FFFFFF/png?text=DOVL"
                      }
                      alt={selectedProduct.name}
                    />
                  </div>
                </div>

                {/* Sağ - Ürün Bilgileri */}
                <div className="quick-view-details">
                  <h2 className="quick-view-title">{selectedProduct.name}</h2>
                  
                  <div className="quick-view-price">
                    {selectedProduct.salePrice ? (
                      <>
                        <span className="price-original">{selectedProduct.price.toFixed(2)}TL</span>
                        <span className="price-current">{selectedProduct.salePrice.toFixed(2)}TL</span>
                      </>
                    ) : (
                      <span className="price-current">{selectedProduct.price.toFixed(2)}TL</span>
                    )}
                  </div>

                  <div className="quick-view-description">
                    <p>{selectedProduct.description}</p>
                  </div>

                  <div className="quick-view-actions">
                    <Link 
                      href={`/urunler/${selectedProduct.slug || selectedProduct.id}`} 
                      className="view-details-button"
                    >
                      ÜRÜN DETAYI
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .search-header {
          margin-bottom: 2rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
        }
        
        .page-title {
          font-size: 1.8rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .search-info {
          color: #666;
          font-size: 0.9rem;
        }
        
        .search-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .search-sort {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .sort-select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .loading-container {
          text-align: center;
          padding: 3rem 0;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 1rem;
          border: 3px solid #f3f3f3;
          border-top: 3px solid var(--color-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .search-empty-query,
        .search-no-results,
        .search-error {
          text-align: center;
          padding: 3rem 0;
        }
        
        .search-empty-icon {
          margin-bottom: 1.5rem;
          color: #999;
        }
        
        .search-no-results h2,
        .search-empty-query h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .search-no-results p,
        .search-empty-query p {
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .search-suggestions {
          margin: 2rem auto;
          max-width: 500px;
          text-align: left;
        }
        
        .search-suggestions h3 {
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        
        .search-suggestions ul {
          padding-left: 1.5rem;
        }
        
        .search-suggestions li {
          margin-bottom: 0.5rem;
          color: #666;
        }
        
        .search-error {
          color: #c53030;
          background-color: #fff5f5;
          border: 1px solid #feb2b2;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 2rem;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 3rem;
          gap: 1rem;
        }
        
        .pagination-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
        }
        
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-pages {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .pagination-page {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
          cursor: pointer;
        }
        
        .pagination-page.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        
        .pagination-ellipsis {
          font-size: 1rem;
          color: #666;
        }
        
        /* Quick View Modal Styles */
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
          max-width: 900px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 25px;
          border-radius: 4px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
        
        .quick-view-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 10;
          color: #666;
          transition: color 0.2s ease;
        }
        
        .quick-view-close:hover {
          color: #000;
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
      `}</style>
    </main>
  );
} 