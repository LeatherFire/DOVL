"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  
  // Sepet verilerini yükleme (gerçek projede API'dan veya local storage'dan alınacak)
  useEffect(() => {
    // Mock sepet verileri
    const mockCart = [
      {
        id: 'bluz-1',
        name: 'Sarı Basic Bluz',
        price: 379.90,
        salePrice: 189.90,
        image: 'https://placehold.co/800x1100/FFEA00/1A1A1A/png?text=DOVL',
        color: 'Sarı',
        size: 'M',
        quantity: 1,
        maxQuantity: 5
      },
      {
        id: 'elbise-3',
        name: 'Siyah Mini Elbise',
        price: 799.90,
        salePrice: null,
        image: 'https://placehold.co/800x1100/000000/FFFFFF/png?text=DOVL',
        color: 'Siyah',
        size: 'S',
        quantity: 2,
        maxQuantity: 3
      }
    ];
    
    // API çağrısını simüle etmek için setTimeout kullanıyoruz
    setTimeout(() => {
      setCart(mockCart);
      setLoading(false);
    }, 500);
  }, []);
  
  // Ürün adetini değiştirme
  const updateQuantity = (id, newQuantity) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Ürünü sepetten çıkarma
  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };
  
  // Kupon kodu uygulama
  const applyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Lütfen bir kupon kodu girin.');
      return;
    }
    
    // Gerçek projede API'ya istek yapılacak
    // Burada mock kontrol yapıyoruz
    if (couponCode.toUpperCase() === 'DOVL20') {
      setAppliedCoupon({
        code: couponCode.toUpperCase(),
        discount: 20,
        type: 'percentage'
      });
      setCouponError('');
    } else {
      setAppliedCoupon(null);
      setCouponError('Geçersiz kupon kodu.');
    }
  };
  
  // Kupon kodunu kaldırma
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };
  
  // Fiyat hesaplamaları
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.salePrice || item.price) * item.quantity;
    }, 0);
  };
  
  const calculateCouponDiscount = (subtotal) => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'percentage') {
      return subtotal * (appliedCoupon.discount / 100);
    }
    
    return appliedCoupon.discount;
  };
  
  const calculateTax = (afterDiscount) => {
    // KDV %18 olarak hesaplıyoruz
    return afterDiscount * 0.18;
  };
  
  const calculateShipping = (subtotal) => {
    // 500 TL üzeri alışverişlerde kargo bedava
    return subtotal >= 500 ? 0 : 29.90;
  };
  
  // Toplam hesaplama
  const subtotal = calculateSubtotal();
  const couponDiscount = calculateCouponDiscount(subtotal);
  const afterDiscount = subtotal - couponDiscount;
  const tax = calculateTax(afterDiscount);
  const shipping = calculateShipping(subtotal);
  const total = afterDiscount + shipping;
  
  return (
    <main className="cart-page">
      <div className="container">
        <h1 className="page-title">ALIŞVERİŞ SEPETİM</h1>
        
        {loading ? (
          <div className="cart-loading">
            <div className="loading-spinner"></div>
            <p>Sepetiniz yükleniyor...</p>
          </div>
        ) : cart.length === 0 ? (
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
        ) : (
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
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-product">
                      <Link href={`/urunler/${item.id}`} className="cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </Link>
                      <div className="cart-item-details">
                        <Link href={`/urunler/${item.id}`} className="cart-item-name">
                          {item.name}
                        </Link>
                        <div className="cart-item-meta">
                          <div className="cart-item-color">Renk: {item.color}</div>
                          <div className="cart-item-size">Beden: {item.size}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="cart-item-price">
                      {item.salePrice ? (
                        <>
                          <span className="cart-item-original-price">{item.price.toFixed(2)}TL</span>
                          <span className="cart-item-sale-price">{item.salePrice.toFixed(2)}TL</span>
                        </>
                      ) : (
                        <span className="cart-item-regular-price">{item.price.toFixed(2)}TL</span>
                      )}
                    </div>
                    
                    <div className="cart-item-quantity">
                      <div className="quantity-selector">
                        <button 
                          className="quantity-button" 
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
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
                            if (value > 0 && value <= item.maxQuantity) {
                              updateQuantity(item.id, value);
                            }
                          }}
                          min="1"
                          max={item.maxQuantity}
                        />
                        <button 
                          className="quantity-button" 
                          onClick={() => updateQuantity(item.id, Math.min(item.maxQuantity, item.quantity + 1))}
                          disabled={item.quantity >= item.maxQuantity}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="cart-item-total">
                      {((item.salePrice || item.price) * item.quantity).toFixed(2)}TL
                    </div>
                    
                    <div className="cart-item-remove">
                      <button onClick={() => removeItem(item.id)} className="remove-button">
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
                
                <button className="btn btn-outline cart-clear" onClick={() => setCart([])}>
                  SEPETİ TEMİZLE
                </button>
              </div>
            </div>
            
            <div className="cart-sidebar">
              <div className="cart-summary">
                <h2 className="summary-title">SİPARİŞ ÖZETİ</h2>
                
                <div className="summary-row">
                  <span className="summary-label">Ara Toplam</span>
                  <span className="summary-value">{subtotal.toFixed(2)}TL</span>
                </div>
                
                {appliedCoupon && (
                  <div className="summary-row summary-discount">
                    <span className="summary-label">İndirim ({appliedCoupon.code})</span>
                    <span className="summary-value">-{couponDiscount.toFixed(2)}TL</span>
                  </div>
                )}
                
                <div className="summary-row">
                  <span className="summary-label">Kargo</span>
                  <span className="summary-value">
                    {shipping === 0 ? 'Ücretsiz' : `${shipping.toFixed(2)}TL`}
                  </span>
                </div>
                
                <div className="summary-row">
                  <span className="summary-label">KDV (18%)</span>
                  <span className="summary-value">{tax.toFixed(2)}TL</span>
                </div>
                
                <div className="summary-row summary-total">
                  <span className="summary-label">Toplam</span>
                  <span className="summary-value">{total.toFixed(2)}TL</span>
                </div>
                
                {/* Kupon Kodu Alanı */}
                <div className="coupon-form">
                  <h3 className="coupon-title">İndirim Kuponu</h3>
                  
                  {appliedCoupon ? (
                    <div className="applied-coupon">
                      <div className="applied-coupon-info">
                        <span className="applied-coupon-code">{appliedCoupon.code}</span>
                        <span className="applied-coupon-discount">
                          {appliedCoupon.type === 'percentage' ? `%${appliedCoupon.discount}` : `${appliedCoupon.discount}TL`} indirim
                        </span>
                      </div>
                      <button className="btn-remove-coupon" onClick={removeCoupon}>
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
                        />
                        <button className="coupon-button" onClick={applyCoupon}>
                          UYGULA
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
        )}
      </div>
    </main>
  );
}