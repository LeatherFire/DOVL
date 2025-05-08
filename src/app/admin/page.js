// src/app/admin/page.js
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  // Mock veriler (gerçek projede API'dan gelecek)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    recentOrders: [],
    popularProducts: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // API verilerini yükleme simülasyonu
  useEffect(() => {
    // Gerçek projede API çağrısı yapılacak
    setTimeout(() => {
      setStats({
        totalSales: 123750.90,
        totalOrders: 356,
        totalProducts: 127,
        pendingOrders: 18,
        recentOrders: [
          { id: 'ORD12345', customer: 'Ayşe Yılmaz', date: '2025-05-08', status: 'Tamamlandı', total: 1249.90 },
          { id: 'ORD12344', customer: 'Mehmet Kaya', date: '2025-05-08', status: 'Kargoda', total: 789.50 },
          { id: 'ORD12343', customer: 'Zeynep Çelik', date: '2025-05-07', status: 'Hazırlanıyor', total: 1785.30 },
          { id: 'ORD12342', customer: 'Ali Demir', date: '2025-05-07', status: 'Beklemede', total: 649.90 },
          { id: 'ORD12341', customer: 'Deniz Yıldız', date: '2025-05-06', status: 'Tamamlandı', total: 2349.75 }
        ],
        popularProducts: [
          { id: 'bluz-1', name: 'Sarı Basic Bluz', price: 189.90, sales: 42 },
          { id: 'elbise-3', name: 'Siyah Mini Elbise', price: 799.90, sales: 38 },
          { id: 'pantolon-2', name: 'Bej Keten Pantolon', price: 609.90, sales: 35 }
        ]
      });
      setIsLoading(false);
    }, 1000);
  }, []);
  
  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      <h1 className="admin-page-title">Dashboard</h1>
      
      {/* İstatistik Kartları */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon sales-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-value">{stats.totalSales.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</div>
            <div className="admin-stat-label">Toplam Satış</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-icon orders-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-value">{stats.totalOrders}</div>
            <div className="admin-stat-label">Toplam Sipariş</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-icon products-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-value">{stats.totalProducts}</div>
            <div className="admin-stat-label">Toplam Ürün</div>
          </div>
        </div>
        
        <div className="admin-stat-card">
          <div className="admin-stat-icon orders-icon" style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="admin-stat-info">
            <div className="admin-stat-value">{stats.pendingOrders}</div>
            <div className="admin-stat-label">Bekleyen Sipariş</div>
          </div>
        </div>
      </div>
      
      {/* Son Siparişler */}
      <div className="admin-dashboard-row">
        <div className="admin-panel admin-recent-orders">
          <div className="admin-panel-header">
            <h2 className="admin-panel-title">Son Siparişler</h2>
            <Link href="/admin/siparisler" className="admin-panel-action">
              Tümünü Gör
            </Link>
          </div>
          
          <div className="admin-panel-content">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sipariş No</th>
                  <th>Müşteri</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                  <th>Toplam</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.date}</td>
                    <td>
                      <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span>
                    </td>
                    <td>{order.total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                    <td>
                      <div className="admin-table-actions">
                        <Link href={`/admin/siparisler/${order.id}`} className="admin-action-button">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Hızlı İşlemler */}
      <div className="admin-dashboard-actions">
        <Link href="/admin/urunler/ekle" className="admin-action-card">
          <div className="admin-action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div className="admin-action-text">Yeni Ürün Ekle</div>
        </Link>
        
        <Link href="/admin/siparisler?status=beklemede" className="admin-action-card">
          <div className="admin-action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="admin-action-text">
            Bekleyen Siparişler
            <span className="admin-action-badge">{stats.pendingOrders}</span>
          </div>
        </Link>
        
        <Link href="/admin/kampanyalar/ekle" className="admin-action-card">
          <div className="admin-action-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="admin-action-text">Yeni Kampanya Oluştur</div>
        </Link>
      </div>
    </div>
  );
}