"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getOrders, getOrderById } from '@/utils/api';
import { ErrorMessage, LoadingSpinner, EmptyState, handleApiError } from '@/components/ErrorHandler';
import { useRouter } from 'next/navigation';

export default function SiparislerPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrderDetail, setActiveOrderDetail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        // API'den gelen veri yapısını kontrol edelim ve orders dizisini doğru şekilde ayarlayalım
        setOrders(Array.isArray(data) ? data : (data.orders || []));
        setLoading(false);
      } catch (error) {
        // Not Found hatasını normal karşılayalım, kullanıcının siparişi yok demektir
        if (error.message === "Not Found") {
          setOrders([]);
        } else {
          handleApiError(error, setError);
        }
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Onay Bekliyor';
      case 'processing': return 'Hazırlanıyor';
      case 'shipped': return 'Kargoya Verildi';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return 'Bilinmiyor';
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'order-status-pending';
      case 'processing': return 'order-status-processing';
      case 'shipped': return 'order-status-shipped';
      case 'delivered': return 'order-status-delivered';
      case 'cancelled': return 'order-status-cancelled';
      default: return '';
    }
  };

  const toggleOrderDetail = async (orderId) => {
    if (activeOrderDetail === orderId) {
      // Eğer zaten aktif ise, kapat
      setActiveOrderDetail(null);
    } else {
      try {
        // Eğer sipariş detayı gösterilecekse ve detaylı veri henüz mevcut değilse,
        // detaylı sipariş bilgisini API'den al
        const orderDetails = await getOrderById(orderId);
        
        // Detaylı sipariş bilgisini güncelle
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.id === orderId ? { ...order, ...orderDetails } : order
          )
        );
        
        // Aktif sipariş detayını ayarla
        setActiveOrderDetail(orderId);
      } catch (error) {
        handleApiError(error, setError);
      }
    }
  };
  
  const handleLogout = async () => {
    try {
      // Doğrudan localStorage'ı temizleyelim
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/giris');
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/giris');
    }
  };

  return (
    <div className="container">
      <div className="account-page">
        <h1 className="page-title">Hesabım</h1>
        
        {error && <ErrorMessage error={error} />}
        
        <div className="account-container">
          {/* Sidebar */}
          <div className="account-sidebar">
            <h2 className="account-sidebar-title">Hesap Menüsü</h2>
            <ul className="account-menu">
              <li className="account-menu-item">
                <Link href="/hesabim" className="account-menu-link">
                  Hesap Özeti
                </Link>
              </li>
              <li className="account-menu-item">
                <Link href="/hesabim/siparisler" className="account-menu-link active">
                  Siparişlerim
                </Link>
              </li>
              <li className="account-menu-item">
                <Link href="/hesabim/favoriler" className="account-menu-link">
                  Favorilerim
                </Link>
              </li>
              <li className="account-menu-item">
                <Link href="/hesabim/adresler" className="account-menu-link">
                  Adreslerim
                </Link>
              </li>
              <li className="account-menu-item">
                <button 
                  className="account-menu-link" 
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                  onClick={handleLogout}
                >
                  Çıkış Yap
                </button>
              </li>
            </ul>
          </div>
          
          {/* İçerik */}
          <div className="account-content">
            <h2 className="account-content-title">Siparişlerim</h2>
            
            {loading ? (
              <LoadingSpinner />
            ) : orders.length === 0 ? (
              <EmptyState 
                message="Henüz bir sipariş vermediniz." 
                actionText="Alışverişe Başla" 
                actionLink="/urunler" 
              />
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div className="order-item" key={order.id}>
                    <div className="order-header">
                      <div className="order-number">
                        Sipariş No: <strong>{order.id}</strong>
                      </div>
                      <div className="order-date">
                        {order.date}
                      </div>
                    </div>
                    
                    <div className="order-details">
                      <div className="order-info">
                        <div className="order-info-item">
                          <span className="order-info-label">Durum:</span>
                          <span className={`order-status ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="order-info-item">
                          <span className="order-info-label">Toplam:</span>
                          <span>{order.total}</span>
                        </div>
                        <div className="order-info-item">
                          <span className="order-info-label">Ürün Sayısı:</span>
                          <span>{order.totalItems}</span>
                        </div>
                        <div className="order-info-item">
                          <span className="order-info-label">Ödeme Yöntemi:</span>
                          <span>{order.paymentMethod}</span>
                        </div>
                        {order.trackingNumber && (
                          <div className="order-info-item">
                            <span className="order-info-label">Kargo Takip No:</span>
                            <span>{order.trackingNumber}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="order-products">
                      {order.products && order.products.map((product) => (
                        <div className="order-product" key={product.id}>
                          <div className="order-product-image">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              width={60}
                              height={80}
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <div className="order-product-details">
                            <div className="order-product-name">{product.name}</div>
                            <div className="order-product-meta">
                              {product.color && (
                                <div className="order-product-color">Renk: {product.color}</div>
                              )}
                              {product.size && (
                                <div className="order-product-size">Beden: {product.size}</div>
                              )}
                              <div className="order-product-quantity">Adet: {product.quantity}</div>
                            </div>
                            <div className="order-product-price">{product.price}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {activeOrderDetail === order.id && order.address && (
                      <div className="order-detail-expanded" style={{ 
                        marginTop: '1.5rem', 
                        borderTop: '1px solid #e5e5e5', 
                        paddingTop: '1.5rem' 
                      }}>
                        <h4 style={{ marginBottom: '1rem' }}>Sipariş Detayları</h4>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Teslimat Adresi</h5>
                          <p style={{ marginBottom: '0.25rem' }}><strong>{order.address.title}</strong></p>
                          <p>{order.address.fullAddress}</p>
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Fiyat Detayı</h5>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Ürün Toplamı:</span>
                            <span>{order.subtotal}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Kargo Ücreti:</span>
                            <span>{order.shipping}</span>
                          </div>
                          {order.discount && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                              <span>İndirim:</span>
                              <span>-{order.discount}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #e5e5e5' }}>
                            <span>Toplam:</span>
                            <span>{order.total}</span>
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                          <h5 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Sipariş Geçmişi</h5>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <p style={{ marginBottom: '0.25rem' }}><strong>Sipariş Tarihi:</strong> {order.date}</p>
                            <p><strong>Durum:</strong> {getStatusText(order.status)}</p>
                            {order.statusHistory && order.statusHistory.map((status, index) => (
                              <p key={index} style={{ marginBottom: '0.25rem' }}>
                                <strong>{getStatusText(status.status)}:</strong> {status.date}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="order-actions">
                      <button 
                        className="order-action-btn btn-outline"
                        onClick={() => toggleOrderDetail(order.id)}
                      >
                        {activeOrderDetail === order.id ? 'Detayları Gizle' : 'Sipariş Detayı'}
                      </button>
                      {order.status === 'shipped' && order.trackingNumber && (
                        <a 
                          href={order.trackingUrl || `https://www.example.com/kargo-takip?no=${order.trackingNumber}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="order-action-btn btn-primary"
                        >
                          Kargo Takip
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 