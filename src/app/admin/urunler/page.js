"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Mock kategorileri (gerçek projede API'dan gelecek)
  useEffect(() => {
    const fetchCategories = () => {
      // Gerçek projede API çağrısı yapılacak
      setCategories([
        { id: 'elbise', name: 'Elbise' },
        { id: 'bluz', name: 'Bluz' },
        { id: 'etek', name: 'Etek' },
        { id: 'pantolon', name: 'Pantolon' },
        { id: 'aksesuar', name: 'Aksesuar' },
        { id: 'ceket', name: 'Ceket' }
      ]);
    };
    
    fetchCategories();
  }, []);
  
  // Ürünleri yükleme simülasyonu
  useEffect(() => {
    // Gerçek projede API çağrısı yapılacak
    setTimeout(() => {
      const mockProducts = [
        { 
          id: 'elbise-1', 
          name: 'Siyah Midi Elbise', 
          price: 899.90,
          salePrice: 719.90,
          category: 'elbise', 
          stock: 25, 
          image: 'https://placehold.co/400x600/000000/FFFFFF/png?text=DOVL'
        },
        { 
          id: 'bluz-1', 
          name: 'Sarı Basic Bluz', 
          price: 379.90,
          salePrice: 189.90,
          category: 'bluz', 
          stock: 42, 
          image: 'https://placehold.co/400x600/FFEA00/000000/png?text=DOVL'
        },
        { 
          id: 'etek-1', 
          name: 'Mavi Midi Etek', 
          price: 529.90,
          salePrice: null,
          category: 'etek', 
          stock: 18, 
          image: 'https://placehold.co/400x600/0000FF/FFFFFF/png?text=DOVL'
        },
        { 
          id: 'pantolon-1', 
          name: 'Siyah Skinny Pantolon', 
          price: 699.90,
          salePrice: 559.90,
          category: 'pantolon', 
          stock: 30, 
          image: 'https://placehold.co/400x600/000000/FFFFFF/png?text=DOVL'
        },
        { 
          id: 'aksesuar-1', 
          name: 'Altın Rengi Kolye', 
          price: 249.90,
          salePrice: null,
          category: 'aksesuar', 
          stock: 15, 
          image: 'https://placehold.co/400x600/FFD700/000000/png?text=DOVL'
        },
        { 
          id: 'ceket-1', 
          name: 'Siyah Blazer Ceket', 
          price: 1159.90,
          salePrice: 929.90,
          category: 'ceket', 
          stock: 12, 
          image: 'https://placehold.co/400x600/000000/FFFFFF/png?text=DOVL'
        },
        { 
          id: 'elbise-2', 
          name: 'Kırmızı Maxi Elbise', 
          price: 1299.90,
          salePrice: null,
          category: 'elbise', 
          stock: 8, 
          image: 'https://placehold.co/400x600/FF0000/FFFFFF/png?text=DOVL'
        },
        { 
          id: 'bluz-2', 
          name: 'Beyaz V Yaka Bluz', 
          price: 449.90,
          salePrice: 359.90,
          category: 'bluz', 
          stock: 22, 
          image: 'https://placehold.co/400x600/FFFFFF/000000/png?text=DOVL'
        },
      ];
      
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Arama ve filtreleme
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  // Ürün silme fonksiyonu
  const handleDeleteProduct = (id) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      // Gerçek projede API çağrısı yapılacak
      setProducts(products.filter(product => product.id !== id));
    }
  };
  
  // Kategori adını bul
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };
  
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Ürünler yükleniyor...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Ürünler</h1>
        <Link href="/admin/urunler/ekle" className="admin-add-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Yeni Ürün Ekle
        </Link>
      </div>
      
      <div className="admin-filters">
        <div className="admin-search-field">
          <input
            type="text"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20" className="admin-search-icon">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="admin-filter-field">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="admin-select"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="admin-panel">
        <div className="admin-panel-content">
          {filteredProducts.length === 0 ? (
            <div className="admin-no-data">
              <p>Ürün bulunamadı. Yeni ürün eklemek için Yeni Ürün Ekle butonuna tıklayın.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-image">Görsel</th>
                  <th>Ürün Adı</th>
                  <th>Kategori</th>
                  <th>Fiyat</th>
                  <th>Stok</th>
                  <th className="admin-table-actions">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="admin-table-image">
                      <img src={product.image} alt={product.name} width="60" height="80" />
                    </td>
                    <td>{product.name}</td>
                    <td>{getCategoryName(product.category)}</td>
                    <td>
                      {product.salePrice ? (
                        <>
                          <span className="admin-price-original">{product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                          <span className="admin-price-sale">{product.salePrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                        </>
                      ) : (
                        <span>{product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                      )}
                    </td>
                    <td>
                      <span className={`admin-stock ${product.stock < 10 ? 'admin-stock-low' : ''}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="admin-table-actions">
                      <div className="admin-action-buttons">
                        <Link href={`/admin/urunler/${product.id}`} className="admin-action-button">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link href={`/admin/urunler/${product.id}/duzenle`} className="admin-action-button">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        <button 
                          className="admin-action-button admin-action-delete"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}