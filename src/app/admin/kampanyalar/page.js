// src/app/admin/kampanyalar/page.js
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Kampanyaları yükleme simülasyonu
  useEffect(() => {
    // Gerçek projede API çağrısı yapılacak
    setTimeout(() => {
      const mockCampaigns = [
        {
          id: 'camp001',
          name: 'Bahar İndirimi',
          code: 'BAHAR2025',
          discountType: 'percentage',
          discountValue: 25,
          startDate: '2025-05-01',
          endDate: '2025-05-31',
          status: 'active',
          applicableTo: 'all_products',
          usageCount: 156,
          createdAt: '2025-04-15'
        },
        {
          id: 'camp002',
          name: 'Yaz Koleksiyonu',
          code: 'YAZ2025',
          discountType: 'percentage',
          discountValue: 20,
          startDate: '2025-06-01',
          endDate: '2025-07-31',
          status: 'scheduled',
          applicableTo: 'specific_categories',
          categories: ['elbise', 'mayo', 'plaj'],
          usageCount: 0,
          createdAt: '2025-04-20'
        },
        {
          id: 'camp003',
          name: 'Özel Üyelere İndirim',
          code: 'UYELEREOZELSALE',
          discountType: 'percentage',
          discountValue: 15,
          startDate: '2025-05-01',
          endDate: '2025-12-31',
          status: 'active',
          applicableTo: 'all_products',
          usageLimit: 1, // kişi başına kullanım
          usageCount: 42,
          createdAt: '2025-04-25'
        },
        {
          id: 'camp004',
          name: 'Kış Sezonu Erken Rezervasyon',
          code: 'KIS2025ERKEN',
          discountType: 'percentage',
          discountValue: 30,
          startDate: '2025-08-01',
          endDate: '2025-09-15',
          status: 'scheduled',
          applicableTo: 'specific_products',
          products: ['kazak-01', 'mont-03', 'bot-02'],
          usageCount: 0,
          createdAt: '2025-04-30'
        },
        {
          id: 'camp005',
          name: 'İlk Alışveriş İndirimi',
          code: 'HOSGELDIN',
          discountType: 'fixed_amount',
          discountValue: 100,
          minPurchaseAmount: 500,
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          status: 'active',
          applicableTo: 'all_products',
          usageCount: 89,
          createdAt: '2025-01-01'
        },
        {
          id: 'camp006',
          name: 'Kadınlar Günü İndirimi',
          code: 'KADINLARGUNU2025',
          discountType: 'percentage',
          discountValue: 20,
          startDate: '2025-03-01',
          endDate: '2025-03-08',
          status: 'expired',
          applicableTo: 'all_products',
          usageCount: 245,
          createdAt: '2025-02-15'
        }
      ];
      
      setCampaigns(mockCampaigns);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Kampanya silme
  const handleDeleteCampaign = (id) => {
    if (window.confirm('Bu kampanyayı silmek istediğinizden emin misiniz?')) {
      // Gerçek projede API çağrısı yapılacak
      setCampaigns(campaigns.filter(campaign => campaign.id !== id));
    }
  };
  
  // Kampanya durumu değiştirme
  const handleToggleStatus = (id) => {
    setCampaigns(
      campaigns.map(campaign => {
        if (campaign.id === id) {
          const newStatus = campaign.status === 'active' ? 'inactive' : 'active';
          return { ...campaign, status: newStatus };
        }
        return campaign;
      })
    );
  };
  
  // Filtreleme
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = 
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? campaign.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // İndirim türü gösterimi
  const formatDiscountType = (type, value) => {
    if (type === 'percentage') {
      return `%${value}`;
    } else {
      return value.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
    }
  };
  
  // Kampanya hedefi gösterimi
  const formatTarget = (applicableTo, categories, products) => {
    if (applicableTo === 'all_products') {
      return 'Tüm Ürünler';
    } else if (applicableTo === 'specific_categories') {
      return `${categories.length} Kategori`;
    } else {
      return `${products.length} Ürün`;
    }
  };
  
  // Durum gösterimi
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Pasif';
      case 'scheduled':
        return 'Planlandı';
      case 'expired':
        return 'Süresi Doldu';
      default:
        return status;
    }
  };
  
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Kampanyalar yükleniyor...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-campaigns">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Kampanyalar</h1>
        <Link href="/admin/kampanyalar/ekle" className="admin-add-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Yeni Kampanya Ekle
        </Link>
      </div>
      
      <div className="admin-filters">
        <div className="admin-search-field">
          <input
            type="text"
            placeholder="Kampanya adı, kod..."
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
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
            <option value="scheduled">Planlandı</option>
            <option value="expired">Süresi Doldu</option>
          </select>
        </div>
      </div>
      
      <div className="admin-panel">
        <div className="admin-panel-content">
          {filteredCampaigns.length === 0 ? (
            <div className="admin-no-data">
              <p>Kriterlere uygun kampanya bulunamadı.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Kampanya Adı</th>
                  <th>Kod</th>
                  <th>İndirim</th>
                  <th>Geçerlilik</th>
                  <th>Hedef</th>
                  <th>Durum</th>
                  <th>Kullanım</th>
                  <th className="admin-table-actions">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td>{campaign.name}</td>
                    <td>
                      <code>{campaign.code}</code>
                    </td>
                    <td>{formatDiscountType(campaign.discountType, campaign.discountValue)}</td>
                    <td>
                      <div>{new Date(campaign.startDate).toLocaleDateString('tr-TR')}</div>
                      <div className="admin-small-text">
                        {new Date(campaign.endDate).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td>
                      {formatTarget(
                        campaign.applicableTo, 
                        campaign.categories || [], 
                        campaign.products || []
                      )}
                    </td>
                    <td>
                      <span className={`order-status status-${campaign.status}`}>
                        {getStatusLabel(campaign.status)}
                      </span>
                    </td>
                    <td>{campaign.usageCount}</td>
                    <td className="admin-table-actions">
                      <div className="admin-action-buttons">
                        <Link href={`/admin/kampanyalar/${campaign.id}`} className="admin-action-button">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        
                        <button 
                          className="admin-action-button"
                          onClick={() => handleToggleStatus(campaign.id)}
                          disabled={campaign.status === 'expired'}
                        >
                          {campaign.status === 'active' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </button>
                        
                        <Link href={`/admin/kampanyalar/${campaign.id}/duzenle`} className="admin-action-button">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Link>
                        
                        <button 
                          className="admin-action-button admin-action-delete"
                          onClick={() => handleDeleteCampaign(campaign.id)}
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