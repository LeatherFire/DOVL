"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Siparişleri yükleme simülasyonu
  useEffect(() => {
    // URL'den durum filtresi kontrol et
    const urlParams = new URLSearchParams(window.location.search);
    const statusParam = urlParams.get('status');
    if (statusParam) {
      setStatusFilter(statusParam.toLowerCase());
    }
    
    // Gerçek projede API çağrısı yapılacak
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD12345',
          customer: 'Ayşe Yılmaz',
          email: 'ayse@example.com',
          date: '2025-05-08',
          status: 'Tamamlandı',
          total: 1249.90,
          items: 3,
          paymentMethod: 'Kredi Kartı'
        },
        {
          id: 'ORD12344',
          customer: 'Mehmet Kaya',
          email: 'mehmet@example.com',
          date: '2025-05-08',
          status: 'Kargoda',
          total: 789.50,
          items: 2,
          paymentMethod: 'Kredi Kartı'
        },
        {
          id: 'ORD12343',
          customer: 'Zeynep Çelik',
          email: 'zeynep@example.com',
          date: '2025-05-07',
          status: 'Hazırlanıyor',
          total: 1785.30,
          items: 4,
          paymentMethod: 'Kredi Kartı'
        },
        {
          id: 'ORD12342',
          customer: 'Ali Demir',
          email: 'ali@example.com',
          date: '2025-05-07',
          status: 'Beklemede',
          total: 649.90,
          items: 1,
          paymentMethod: 'Havale/EFT'
        },
        {
          id: 'ORD12341',
          customer: 'Deniz Yıldız',
          email: 'deniz@example.com',
          date: '2025-05-06',
          status: 'Tamamlandı',
          total: 2349.75,
          items: 5,
          paymentMethod: 'Kredi Kartı'
        },
        {
          id: 'ORD12340',
          customer: 'Selin Akın',
          email: 'selin@example.com',
          date: '2025-05-06',
          status: 'İptal Edildi',
          total: 849.90,
          items: 2,
          paymentMethod: 'Kredi Kartı'
        },
        {
          id: 'ORD12339',
          customer: 'Burak Şahin',
          email: 'burak@example.com',
          date: '2025-05-05',
          status: 'Tamamlandı',
          total: 1159.80,
          items: 3,
          paymentMethod: 'Kredi Kartı'
        },
        {
          id: 'ORD12338',
          customer: 'Elif Özkan',
          email: 'elif@example.com',
          date: '2025-05-05',
          status: 'Kargoda',
          total: 579.90,
          items: 1,
          paymentMethod: 'Kredi Kartı'
        }
      ];
      
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Durum değiştirme
  const updateOrderStatus = (orderId, newStatus) => {
    // Gerçek projede API çağrısı yapılacak
    setOrders(
      orders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };
  
  // Filtreleme
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? order.status.toLowerCase() === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Siparişler yükleniyor...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Siparişler</h1>
      </div>
      
      <div className="admin-filters">
        <div className="admin-search-field">
          <input
            type="text"
            placeholder="Sipariş numarası, müşteri adı, e-posta..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="">Tüm Durumlar</option>
            <option value="beklemede">Beklemede</option>
            <option value="hazırlanıyor">Hazırlanıyor</option>
            <option value="kargoda">Kargoda</option>
            <option value="tamamlandı">Tamamlandı</option>
            <option value="iptal edildi">İptal Edildi</option>
          </select>
        </div>
      </div>
      
      <div className="admin-status-tabs">
        <button 
          className={`admin-status-tab ${statusFilter === '' ? 'active' : ''}`}
          onClick={() => setStatusFilter('')}
        >
          Tümü
          <span className="admin-status-count">{orders.length}</span>
        </button>
        <button 
          className={`admin-status-tab ${statusFilter === 'beklemede' ? 'active' : ''}`}
          onClick={() => setStatusFilter('beklemede')}
        >
          Beklemede
          <span className="admin-status-count">{orders.filter(o => o.status.toLowerCase() === 'beklemede').length}</span>
        </button>
        <button 
          className={`admin-status-tab ${statusFilter === 'hazırlanıyor' ? 'active' : ''}`}
          onClick={() => setStatusFilter('hazırlanıyor')}
        >
          Hazırlanıyor
          <span className="admin-status-count">{orders.filter(o => o.status.toLowerCase() === 'hazırlanıyor').length}</span>
        </button>
        <button 
          className={`admin-status-tab ${statusFilter === 'kargoda' ? 'active' : ''}`}
          onClick={() => setStatusFilter('kargoda')}
        >
          Kargoda
          <span className="admin-status-count">{orders.filter(o => o.status.toLowerCase() === 'kargoda').length}</span>
        </button>
        <button 
          className={`admin-status-tab ${statusFilter === 'tamamlandı' ? 'active' : ''}`}
          onClick={() => setStatusFilter('tamamlandı')}
        >
          Tamamlandı
          <span className="admin-status-count">{orders.filter(o => o.status.toLowerCase() === 'tamamlandı').length}</span>
        </button>
        <button 
          className={`admin-status-tab ${statusFilter === 'iptal edildi' ? 'active' : ''}`}
          onClick={() => setStatusFilter('iptal edildi')}
        >
          İptal Edildi
          <span className="admin-status-count">{orders.filter(o => o.status.toLowerCase() === 'iptal edildi').length}</span>
        </button>
      </div>
      
      <div className="admin-panel">
        <div className="admin-panel-content">
          {filteredOrders.length === 0 ? (
            <div className="admin-no-data">
              <p>Kriterlere uygun sipariş bulunamadı.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Müşteri</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                  <th>Toplam</th>
                  <th>Ürün Sayısı</th>
                  <th>Ödeme Yöntemi</th>
                  <th className="admin-table-actions">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link href={`/admin/siparisler/${order.id}`} className="admin-order-link">
                        {order.id}
                      </Link>
                    </td>
                    <td>
                      <div>{order.customer}</div>
                      <div className="admin-small-text">{order.email}</div>
                    </td>
                    <td>{order.date}</td>
                    <td>
                      <span className={`order-status status-${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <strong>{order.total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</strong>
                    </td>
                    <td>{order.items}</td>
                    <td>{order.paymentMethod}</td>
                    <td className="admin-table-actions">
                      <div className="admin-action-buttons">
                        <Link href={`/admin/siparisler/${order.id}`} className="admin-action-button">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        
                        <div className="admin-dropdown">
                          <button className="admin-action-button admin-dropdown-toggle">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className="admin-dropdown-menu">
                            <button 
                              className="admin-dropdown-item"
                              onClick={() => updateOrderStatus(order.id, 'Beklemede')}
                              disabled={order.status === 'Beklemede'}
                            >
                              Beklemede
                            </button>
                            <button 
                              className="admin-dropdown-item"
                              onClick={() => updateOrderStatus(order.id, 'Hazırlanıyor')}
                              disabled={order.status === 'Hazırlanıyor'}
                            >
                              Hazırlanıyor
                            </button>
                            <button 
                              className="admin-dropdown-item"
                              onClick={() => updateOrderStatus(order.id, 'Kargoda')}
                              disabled={order.status === 'Kargoda'}
                            >
                              Kargoda
                            </button>
                            <button 
                              className="admin-dropdown-item"
                              onClick={() => updateOrderStatus(order.id, 'Tamamlandı')}
                              disabled={order.status === 'Tamamlandı'}
                            >
                              Tamamlandı
                            </button>
                            <button 
                              className="admin-dropdown-item admin-dropdown-item-danger"
                              onClick={() => updateOrderStatus(order.id, 'İptal Edildi')}
                              disabled={order.status === 'İptal Edildi'}
                            >
                              İptal Edildi
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Durum Sekmeleri ve Dropdown CSS */}
      <style jsx>{`
        .admin-status-tabs {
          display: flex;
          overflow-x: auto;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .admin-status-tab {
          padding: 0.75rem 1.25rem;
          white-space: nowrap;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          font-family: var(--font-primary);
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }
        
        .admin-status-tab:hover {
          color: var(--color-primary);
        }
        
        .admin-status-tab.active {
          border-bottom-color: var(--color-primary);
          font-weight: 500;
        }
        
        .admin-status-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #e9ecef;
          color: #495057;
          border-radius: 999px;
          font-size: 0.75rem;
          min-width: 1.5rem;
          height: 1.5rem;
          padding: 0 0.375rem;
          margin-left: 0.5rem;
        }
        
        .admin-status-tab.active .admin-status-count {
          background-color: var(--color-primary);
          color: white;
        }
        
        .admin-order-link {
          font-weight: 500;
          color: var(--color-primary);
        }
        
        .admin-small-text {
          font-size: 0.875rem;
          color: #6c757d;
        }
        
        .admin-dropdown {
          position: relative;
        }
        
        .admin-dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background-color: white;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          min-width: 150px;
          z-index: 10;
          display: none;
        }
        
        .admin-dropdown:hover .admin-dropdown-menu,
        .admin-dropdown:focus-within .admin-dropdown-menu {
          display: block;
        }
        
        .admin-dropdown-item {
          display: block;
          width: 100%;
          padding: 0.625rem 1rem;
          text-align: left;
          border: none;
          background: none;
          font-family: var(--font-primary);
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .admin-dropdown-item:hover {
          background-color: #f8f9fa;
        }
        
        .admin-dropdown-item:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .admin-dropdown-item-danger {
          color: #dc3545;
        }
        
        .admin-dropdown-item-danger:hover {
          background-color: rgba(220, 53, 69, 0.1);
        }
        
        @media (max-width: 992px) {
          .admin-status-tabs {
            padding-bottom: 0.5rem;
          }
          
          .admin-table th, .admin-table td {
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}