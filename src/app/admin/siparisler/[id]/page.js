"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function AdminOrderDetail() {
  const params = useParams();
  const { id } = params;
  
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  
  // Sipariş verilerini yükleme simülasyonu
  useEffect(() => {
    // Gerçek projede API çağrısı yapılacak
    setTimeout(() => {
      // Mock sipariş verisi
      const mockOrder = {
        id: id,
        customer: {
          name: 'Ayşe Yılmaz',
          email: 'ayse@example.com',
          phone: '+90 555 123 4567'
        },
        date: '2025-05-08',
        status: 'Tamamlandı',
        paymentMethod: 'Kredi Kartı',
        paymentDetails: {
          cardLast4: '4242',
          cardBrand: 'Visa'
        },
        shippingAddress: {
          fullName: 'Ayşe Yılmaz',
          address: 'Atatürk Mah. İnönü Cad. No:123 D:5',
          city: 'İstanbul',
          district: 'Kadıköy',
          postalCode: '34000',
          country: 'Türkiye',
          phone: '+90 555 123 4567'
        },
        billingAddress: {
          fullName: 'Ayşe Yılmaz',
          address: 'Atatürk Mah. İnönü Cad. No:123 D:5',
          city: 'İstanbul',
          district: 'Kadıköy',
          postalCode: '34000',
          country: 'Türkiye',
          phone: '+90 555 123 4567'
        },
        items: [
          {
            id: 'bluz-1',
            name: 'Sarı Basic Bluz',
            price: 379.90,
            salePrice: 189.90,
            quantity: 1,
            color: 'Sarı',
            size: 'M',
            image: 'https://placehold.co/100x130/FFEA00/1A1A1A/png?text=DOVL'
          },
          {
            id: 'elbise-3',
            name: 'Siyah Mini Elbise',
            price: 799.90,
            salePrice: null,
            quantity: 2,
            color: 'Siyah',
            size: 'S',
            image: 'https://placehold.co/100x130/000000/FFFFFF/png?text=DOVL'
          }
        ],
        subtotal: 1389.70,
        discount: 0,
        shipping: 0,
        tax: 250.15,
        total: 1639.85,
        notes: 'Lütfen kapıda zili çalın.',
        trackingNumber: 'TR123456789',
        trackingUrl: 'https://www.example.com/track',
        timeline: [
          { date: '2025-05-08 10:23', status: 'Sipariş Alındı', description: 'Siparişiniz başarıyla oluşturuldu.' },
          { date: '2025-05-08 10:25', status: 'Ödeme Onaylandı', description: 'Ödemeniz başarıyla alındı.' },
          { date: '2025-05-08 11:30', status: 'Hazırlanıyor', description: 'Siparişiniz hazırlanıyor.' },
          { date: '2025-05-08 14:45', status: 'Kargoya Verildi', description: 'Siparişiniz kargoya verildi.' },
          { date: '2025-05-10 16:20', status: 'Teslim Edildi', description: 'Siparişiniz teslim edildi.' }
        ]
      };
      
      setOrder(mockOrder);
      setNewStatus(mockOrder.status);
      setTrackingNumber(mockOrder.trackingNumber || '');
      setIsLoading(false);
    }, 1000);
  }, [id]);
  
  // Sipariş durumunu güncelleme
  const updateOrderStatus = () => {
    if (!newStatus) return;
    
    // Gerçek projede API çağrısı yapılacak
    setOrder(prev => ({
      ...prev,
      status: newStatus,
      timeline: [
        ...prev.timeline,
        {
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          status: newStatus,
          description: `Sipariş durumu ${newStatus} olarak güncellendi.`
        }
      ]
    }));
    
    alert('Sipariş durumu güncellendi.');
  };
  
  // Kargo takip numarasını güncelleme
  const updateTrackingNumber = () => {
    if (!trackingNumber) return;
    
    // Gerçek projede API çağrısı yapılacak
    setOrder(prev => ({
      ...prev,
      trackingNumber: trackingNumber,
      trackingUrl: 'https://www.example.com/track'
    }));
    
    alert('Kargo takip numarası güncellendi.');
  };
  
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Sipariş bilgileri yükleniyor...</p>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="admin-not-found">
        <h1 className="admin-page-title">Sipariş Bulunamadı</h1>
        <p>Aradığınız sipariş mevcut değil veya erişim izniniz yok.</p>
        <Link href="/admin/siparisler" className="admin-button admin-button-primary">
          Siparişlere Dön
        </Link>
      </div>
    );
  }
  
  return (
    <div className="admin-order-detail">
      <div className="admin-page-header">
        <div className="admin-order-title">
          <h1 className="admin-page-title">Sipariş #{order.id}</h1>
          <span className={`order-status status-${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </div>
        <Link href="/admin/siparisler" className="admin-back-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Siparişlere Dön
        </Link>
      </div>
      
      <div className="admin-order-cards">
        <div className="admin-order-card">
          <div className="admin-order-card-header">
            <h3 className="admin-order-card-title">Durum Güncelle</h3>
          </div>
          <div className="admin-order-card-content">
            <div className="admin-form-group">
              <label htmlFor="orderStatus" className="admin-form-label">Sipariş Durumu</label>
              <select
                id="orderStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="admin-form-select"
              >
                <option value="Beklemede">Beklemede</option>
                <option value="Hazırlanıyor">Hazırlanıyor</option>
                <option value="Kargoda">Kargoda</option>
                <option value="Tamamlandı">Tamamlandı</option>
                <option value="İptal Edildi">İptal Edildi</option>
              </select>
            </div>
            <button 
              className="admin-button admin-button-primary"
              onClick={updateOrderStatus}
              disabled={newStatus === order.status}
            >
              Güncelle
            </button>
          </div>
        </div>
        
        <div className="admin-order-card">
          <div className="admin-order-card-header">
            <h3 className="admin-order-card-title">Kargo Takip</h3>
          </div>
          <div className="admin-order-card-content">
            <div className="admin-form-group">
              <label htmlFor="trackingNumber" className="admin-form-label">Kargo Takip Numarası</label>
              <input
                type="text"
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="admin-form-input"
                placeholder="Kargo takip numarası girin"
              />
            </div>
            <button 
              className="admin-button admin-button-primary"
              onClick={updateTrackingNumber}
              disabled={trackingNumber === order.trackingNumber}
            >
              Güncelle
            </button>
            
            {order.trackingNumber && (
              <div className="admin-tracking-info">
                <p>Mevcut Takip Numarası: <strong>{order.trackingNumber}</strong></p>
                <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="admin-tracking-link">
                  Kargo Takip Sitesinde Görüntüle
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="admin-order-grid">
        <div className="admin-panel admin-order-items">
          <div className="admin-panel-header">
            <h2 className="admin-panel-title">Sipariş Ürünleri</h2>
          </div>
          <div className="admin-panel-content">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-image">Görsel</th>
                  <th>Ürün</th>
                  <th>Fiyat</th>
                  <th>Adet</th>
                  <th>Toplam</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={`${item.id}-${item.size}-${item.color}`}>
                    <td className="admin-table-image">
                      <img src={item.image} alt={item.name} />
                    </td>
                    <td>
                      <Link href={`/admin/urunler/${item.id}`} className="admin-item-name">
                        {item.name}
                      </Link>
                      <div className="admin-item-meta">
                        <span className="admin-item-attribute">Renk: {item.color}</span>
                        <span className="admin-item-attribute">Beden: {item.size}</span>
                      </div>
                    </td>
                    <td>
                      {item.salePrice ? (
                        <>
                          <span className="admin-price-original">{item.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                          <span className="admin-price-sale">{item.salePrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                        </>
                      ) : (
                        <span>{item.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                      )}
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                      <strong>
                        {((item.salePrice || item.price) * item.quantity).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="admin-order-summary-label">Ara Toplam</td>
                  <td>{order.subtotal.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                </tr>
                {order.discount > 0 && (
                  <tr>
                    <td colSpan="4" className="admin-order-summary-label">İndirim</td>
                    <td>-{order.discount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                  </tr>
                )}
                <tr>
                  <td colSpan="4" className="admin-order-summary-label">Kargo</td>
                  <td>
                    {order.shipping === 0 ? 'Ücretsiz' : order.shipping.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </td>
                </tr>
                <tr>
                  <td colSpan="4" className="admin-order-summary-label">KDV (18%)</td>
                  <td>{order.tax.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                </tr>
                <tr className="admin-order-total">
                  <td colSpan="4" className="admin-order-summary-label">Toplam</td>
                  <td>{order.total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div className="admin-order-side">
          <div className="admin-panel admin-order-customer">
            <div className="admin-panel-header">
              <h2 className="admin-panel-title">Müşteri Bilgileri</h2>
            </div>
            <div className="admin-panel-content">
              <div className="admin-customer-info">
                <div className="admin-info-item">
                  <div className="admin-info-label">İsim</div>
                  <div className="admin-info-value">{order.customer.name}</div>
                </div>
                <div className="admin-info-item">
                  <div className="admin-info-label">E-posta</div>
                  <div className="admin-info-value">
                    <a href={`mailto:${order.customer.email}`}>{order.customer.email}</a>
                  </div>
                </div>
                <div className="admin-info-item">
                  <div className="admin-info-label">Telefon</div>
                  <div className="admin-info-value">
                    <a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="admin-panel admin-order-shipping">
            <div className="admin-panel-header">
              <h2 className="admin-panel-title">Teslimat Adresi</h2>
            </div>
            <div className="admin-panel-content">
              <div className="admin-address">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.district}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>
          
          <div className="admin-panel admin-order-billing">
            <div className="admin-panel-header">
              <h2 className="admin-panel-title">Fatura Adresi</h2>
            </div>
            <div className="admin-panel-content">
              <div className="admin-address">
                <p>{order.billingAddress.fullName}</p>
                <p>{order.billingAddress.address}</p>
                <p>{order.billingAddress.district}, {order.billingAddress.city}, {order.billingAddress.postalCode}</p>
                <p>{order.billingAddress.country}</p>
                <p>{order.billingAddress.phone}</p>
              </div>
            </div>
          </div>
          
          <div className="admin-panel admin-order-payment">
            <div className="admin-panel-header">
              <h2 className="admin-panel-title">Ödeme Bilgileri</h2>
            </div>
            <div className="admin-panel-content">
              <div className="admin-info-item">
                <div className="admin-info-label">Ödeme Yöntemi</div>
                <div className="admin-info-value">{order.paymentMethod}</div>
              </div>
              {order.paymentMethod === 'Kredi Kartı' && (
                <div className="admin-info-item">
                  <div className="admin-info-label">Kart Bilgisi</div>
                  <div className="admin-info-value">
                    {order.paymentDetails.cardBrand} **** **** **** {order.paymentDetails.cardLast4}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {order.notes && (
            <div className="admin-panel admin-order-notes">
              <div className="admin-panel-header">
                <h2 className="admin-panel-title">Sipariş Notu</h2>
              </div>
              <div className="admin-panel-content">
                <p>{order.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="admin-panel admin-order-timeline">
        <div className="admin-panel-header">
          <h2 className="admin-panel-title">Sipariş Geçmişi</h2>
        </div>
        <div className="admin-panel-content">
          <div className="admin-timeline">
            {order.timeline.map((event, index) => (
              <div key={index} className="admin-timeline-item">
                <div className="admin-timeline-badge"></div>
                <div className="admin-timeline-content">
                  <div className="admin-timeline-date">{event.date}</div>
                  <div className="admin-timeline-status">{event.status}</div>
                  <div className="admin-timeline-description">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sipariş Detay Sayfası CSS */}
      <style jsx>{`
        .admin-order-title {
          display: flex;
          align-items: center;
        }
        
        .admin-order-title .order-status {
          margin-left: 1rem;
        }
        
        .admin-order-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .admin-order-card {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .admin-order-card-header {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .admin-order-card-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 500;
        }
        
        .admin-order-card-content {
          padding: 1.5rem;
        }
        
        .admin-order-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .admin-order-side > * {
          margin-bottom: 1.5rem;
        }
        
        .admin-order-side > *:last-child {
          margin-bottom: 0;
        }
        
        .admin-customer-info {
          display: grid;
          gap: 1rem;
        }
        
        .admin-info-item {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 1rem;
        }
        
        .admin-info-label {
          font-weight: 500;
          color: #6c757d;
        }
        
        .admin-address p {
          margin: 0 0 0.5rem;
        }
        
        .admin-item-name {
          display: block;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        
        .admin-item-meta {
          font-size: 0.875rem;
          color: #6c757d;
        }
        
        .admin-item-attribute {
          display: inline-block;
          margin-right: 1rem;
        }
        
        .admin-order-summary-label {
          text-align: right;
          font-weight: 500;
        }
        
        .admin-order-total {
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .admin-tracking-info {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e9ecef;
        }
        
        .admin-tracking-link {
          display: inline-flex;
          align-items: center;
          color: var(--color-primary);
        }
        
        .admin-tracking-link svg {
          margin-left: 0.25rem;
        }
        
        .admin-timeline {
          position: relative;
          padding-left: 2rem;
        }
        
        .admin-timeline::before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 8px;
          width: 2px;
          background-color: #e9ecef;
        }
        
        .admin-timeline-item {
          position: relative;
          padding-bottom: 1.5rem;
        }
        
        .admin-timeline-item:last-child {
          padding-bottom: 0;
        }
        
        .admin-timeline-badge {
          position: absolute;
          top: 0;
          left: -2rem;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background-color: var(--color-primary);
          border: 2px solid white;
          z-index: 1;
        }
        
        .admin-timeline-date {
          color: #6c757d;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
        
        .admin-timeline-status {
          font-weight: 500;
          margin-bottom: 0.25rem;
        }
        
        .admin-timeline-description {
          color: #495057;
        }
        
        @media (max-width: 992px) {
          .admin-order-grid {
            grid-template-columns: 1fr;
          }
          
          .admin-order-cards {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .admin-info-item {
            grid-template-columns: 1fr;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}