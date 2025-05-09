"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCart, updateCartItem, removeCartItem, applyCoupon, removeCoupon } from '../../utils/api';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  
  // Sepet verilerini yükleme
  useEffect(() => {
    loadCart();
  }, []);
  
  const loadCart = async () => {
    setLoading(true);
    try {
      const response = await getCart();
      setCart(response.data);
      
      // Sepet güncellendiğinde bir event tetikle
      // Bu event, layout.js'deki sepet sayısını güncelleyecek
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error("Sepet yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Ürün adetini değiştirme
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    setItemsLoading(prev => ({ ...prev, [itemId]: true }));
    try {
      const response = await updateCartItem(itemId, newQuantity);
      setCart(response.data);
      
      // Sepet güncellendiğinde bir event tetikle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error("Ürün miktarı güncellenirken hata:", error);
    } finally {
      setItemsLoading(prev => ({ ...prev, [itemId]: false }));
    }
  };
  
  // Ürünü sepetten çıkarma
  const handleRemoveItem = async (itemId) => {
    setItemsLoading(prev => ({ ...prev, [itemId]: true }));
    try {
      const response = await removeCartItem(itemId);
      setCart(response.data);
      
      // Sepet güncellendiğinde bir event tetikle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error("Ürün silinirken hata:", error);
    }
  };
  
  // Sepeti tamamen temizleme
  const handleClearCart = () => {
    // Onay modalını göster
    setConfirmAction(() => async () => {
      // Tüm sepeti temizle - sırayla silme
      try {
        // Sonraki işlemde kullanmak için ürün ID'lerini kopyala
        const itemIds = [...cart.items.map(item => item._id)];
        
        // Her ürünü sırayla sil
        for (const itemId of itemIds) {
          await removeCartItem(itemId);
        }
        
        // İşlem tamamlandığında sepeti yeniden yükle
        await loadCart();
      } catch (error) {
        console.error("Sepet temizlenirken hata:", error);
      } finally {
        // Modal'ı kapat
        setShowConfirmModal(false);
      }
    });
    setShowConfirmModal(true);
  };
  
  // Kupon kodu uygulama
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Lütfen bir kupon kodu girin.');
      return;
    }
    
    setCouponLoading(true);
    setCouponError('');
    try {
      const response = await applyCoupon(couponCode);
      setCart(response.data);
      setCouponCode('');
      
      // Sepet güncellendiğinde bir event tetikle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error("Kupon uygulanırken hata:", error);
      setCouponError(error.message || 'Geçersiz kupon kodu.');
    } finally {
      setCouponLoading(false);
    }
  };
  
  // Kupon kodunu kaldırma
  const handleRemoveCoupon = async () => {
    try {
      const response = await removeCoupon();
      setCart(response.data);
      
      // Sepet güncellendiğinde bir event tetikle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error("Kupon kaldırılırken hata:", error);
    }
  };
  
  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-spinner"></div>
        <p>Sepetiniz yükleniyor...</p>
      </div>
    );
  }
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="cart-empty-title">Sepetiniz Boş</h2>
        <p className="cart-empty-text">Sepetinizde henüz ürün bulunmuyor. Alışverişe başlamak için aşağıdaki butona tıklayabilirsiniz.</p>
        <Link href="/urunler" className="btn cart-empty-button">
          ALIŞVERİŞE BAŞLA
        </Link>
      </div>
    );
  }
  
  return (
    <main className="cart-page">
      <div className="container">
        <h1 className="page-title">ALIŞVERİŞ SEPETİM</h1>
        
        <div className="cart-content">
          <div className="cart-main">
            {/* Sepet Başlık */}
            <div className="cart-header">
              <div className="cart-header-item cart-header-product">Ürün</div>
              <div className="cart-header-item cart-header-price">Fiyat</div>
              <div className="cart-header-item cart-header-quantity">Adet</div>
              <div className="cart-header-item cart-header-total">Toplam</div>
              <div className="cart-header-item cart-header-remove"></div>
            </div>
            
            {/* Sepet Ürünleri */}
            <div className="cart-items">
              {cart.items.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="cart-item-product">
                    <Link href={`/urunler/${item.productSlug || item.product}`} className="cart-item-image">
                      <img src={item.productImage || `https://placehold.co/800x1100/000000/FFFFFF/png?text=DOVL`} alt={item.productName} />
                    </Link>
                    <div className="cart-item-details">
                      <Link href={`/urunler/${item.productSlug || item.product}`} className="cart-item-name">
                        {item.productName}
                      </Link>
                      <div className="cart-item-meta">
                        <div className="cart-item-color">Renk: {item.variant.colorName}</div>
                        <div className="cart-item-size">Beden: {item.variant.size}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="cart-item-price">
                    {item.originalPrice && item.originalPrice > item.price ? (
                      <>
                        <span className="cart-item-original-price">{item.originalPrice.toFixed(2)}TL</span>
                        <span className="cart-item-sale-price">{item.price.toFixed(2)}TL</span>
                      </>
                    ) : (
                      <span className="cart-item-regular-price">{item.price.toFixed(2)}TL</span>
                    )}
                  </div>
                  
                  <div className="cart-item-quantity">
                    <div className="quantity-selector">
                      <button 
                        className="quantity-button" 
                        onClick={() => handleUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                        disabled={itemsLoading[item._id] || item.quantity <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        className="quantity-input"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value > 0) {
                            handleUpdateQuantity(item._id, value);
                          }
                        }}
                        min="1"
                        disabled={itemsLoading[item._id]}
                      />
                      <button 
                        className="quantity-button" 
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        disabled={itemsLoading[item._id]}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="cart-item-total">
                    {itemsLoading[item._id] ? (
                      <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                    ) : (
                      <>{item.subtotal.toFixed(2)}TL</>
                    )}
                  </div>
                  
                  <div className="cart-item-remove">
                    <button 
                      onClick={() => handleRemoveItem(item._id)} 
                      className="remove-button"
                      disabled={itemsLoading[item._id]}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Alt Butonlar */}
            <div className="cart-actions">
              <Link href="/urunler" className="btn btn-outline cart-continue">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                ALIŞVERİŞE DEVAM ET
              </Link>
              
              <button 
                className="btn btn-outline cart-clear" 
                onClick={handleClearCart}
              >
                SEPETİ TEMİZLE
              </button>
            </div>
          </div>
          
          <div className="cart-sidebar">
            <div className="cart-summary">
              <h2 className="summary-title">SİPARİŞ ÖZETİ</h2>
              
              <div className="summary-row">
                <span className="summary-label">Ara Toplam</span>
                <span className="summary-value">{cart.subtotal.toFixed(2)}TL</span>
              </div>
              
              {cart.campaign && (
                <div className="summary-row summary-discount">
                  <span className="summary-label">İndirim ({cart.campaign.code})</span>
                  <span className="summary-value">-{cart.discountAmount.toFixed(2)}TL</span>
                </div>
              )}
              
              <div className="summary-row">
                <span className="summary-label">Kargo</span>
                <span className="summary-value">
                  {cart.shippingCost === 0 ? 'Ücretsiz' : `${cart.shippingCost.toFixed(2)}TL`}
                </span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">KDV (18%)</span>
                <span className="summary-value">{cart.taxAmount.toFixed(2)}TL</span>
              </div>
              
              <div className="summary-row summary-total">
                <span className="summary-label">Toplam</span>
                <span className="summary-value">{cart.total.toFixed(2)}TL</span>
              </div>
              
              {/* Kupon Kodu Alanı */}
              <div className="coupon-form">
                <h3 className="coupon-title">İndirim Kuponu</h3>
                
                {cart.campaign ? (
                  <div className="applied-coupon">
                    <div className="applied-coupon-info">
                      <span className="applied-coupon-code">{cart.campaign.code}</span>
                      <span className="applied-coupon-discount">
                        {cart.campaign.discountType === 'percentage' ? `%${cart.campaign.discountValue}` : `${cart.campaign.discountValue}TL`} indirim
                      </span>
                    </div>
                    <button className="btn-remove-coupon" onClick={handleRemoveCoupon}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="coupon-input-group">
                      <input 
                        type="text" 
                        className="coupon-input" 
                        placeholder="Kupon kodunuz" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={couponLoading}
                      />
                      <button 
                        className="coupon-button" 
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                      >
                        {couponLoading ? '...' : 'UYGULA'}
                      </button>
                    </div>
                    {couponError && <div className="coupon-error">{couponError}</div>}
                    <div className="coupon-hint">Test için: DOVL20 kupon kodunu kullanabilirsiniz.</div>
                  </>
                )}
              </div>
              
              <Link href="/odeme" className="btn checkout-button">
                ÖDEME ADIMINA GEÇ
              </Link>
              
              <div className="checkout-secure">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="18" height="18">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Güvenli Ödeme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Onay Modal */}
      {showConfirmModal && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Sepeti Temizle</h3>
              <button className="modal-close" onClick={() => setShowConfirmModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p>Sepetinizdeki tüm ürünleri silmek istediğinize emin misiniz?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowConfirmModal(false)}>Vazgeç</button>
              <button className="btn btn-danger" onClick={confirmAction}>Sepeti Temizle</button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .modal-overlay {
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
          padding: 0 20px;
        }
        
        .modal-container {
          background: white;
          width: 100%;
          max-width: 450px;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e5e5;
        }
        
        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        
        .modal-close {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }
        
        .modal-close:hover {
          color: #000;
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .modal-body p {
          margin: 0;
          font-size: 16px;
          line-height: 1.5;
          color: #333;
        }
        
        .modal-footer {
          padding: 16px 24px 24px;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        
        .btn-danger {
          background-color: #e53e3e;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .btn-danger:hover {
          background-color: #c53030;
        }
      `}</style>
    </main>
  );
}