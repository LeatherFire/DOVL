"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Teslimat, 2: Ödeme, 3: Onay
  
  // Form verileri
  const [formData, setFormData] = useState({
    // Teslimat bilgileri
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    // Fatura bilgileri
    sameAsShipping: true,
    billingFirstName: '',
    billingLastName: '',
    billingAddress: '',
    billingCity: '',
    billingDistrict: '',
    billingPostalCode: '',
    // Ödeme bilgileri
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVC: '',
    saveCard: false,
    // Diğer
    notes: '',
    termsAccepted: false
  });
  
  // Form hataları
  const [formErrors, setFormErrors] = useState({});
  
  // Sepet verilerini yükleme (gerçek projede API'dan veya local storage'dan alınacak)
  useEffect(() => {
    // Mock sepet verileri - sepet sayfasıyla aynı
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
    
    // Mock kupon
    const mockCoupon = {
      code: 'DOVL20',
      discount: 20,
      type: 'percentage'
    };
    
    // API çağrısını simüle etmek için setTimeout kullanıyoruz
    setTimeout(() => {
      setCart({
        items: mockCart,
        coupon: mockCoupon,
        subtotal: mockCart.reduce((total, item) => total + (item.salePrice || item.price) * item.quantity, 0),
        shipping: 0, // 500 TL üzeri ücretsiz kargo
        tax: mockCart.reduce((total, item) => total + (item.salePrice || item.price) * item.quantity, 0) * 0.18
      });
      setLoading(false);
    }, 500);
  }, []);
  
  // Form verilerini güncelleme
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Fatura bilgileri gönderim bilgileri ile aynı ise
    if (name === 'sameAsShipping' && checked) {
      setFormData(prev => ({
        ...prev,
        billingFirstName: prev.firstName,
        billingLastName: prev.lastName,
        billingAddress: prev.address,
        billingCity: prev.city,
        billingDistrict: prev.district,
        billingPostalCode: prev.postalCode
      }));
    }
    
    // Hata mesajını temizle
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Form doğrulama
  const validateForm = () => {
    const errors = {};
    
    // Teslimat bilgileri doğrulama
    if (checkoutStep === 1) {
      if (!formData.firstName.trim()) errors.firstName = 'Ad gereklidir';
      if (!formData.lastName.trim()) errors.lastName = 'Soyad gereklidir';
      if (!formData.email.trim()) errors.email = 'E-posta gereklidir';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Geçerli bir e-posta adresi giriniz';
      if (!formData.phone.trim()) errors.phone = 'Telefon gereklidir';
      if (!formData.address.trim()) errors.address = 'Adres gereklidir';
      if (!formData.city.trim()) errors.city = 'İl gereklidir';
      if (!formData.district.trim()) errors.district = 'İlçe gereklidir';
      
      // Fatura bilgileri teslimat bilgilerinden farklı ise kontrol et
      if (!formData.sameAsShipping) {
        if (!formData.billingFirstName.trim()) errors.billingFirstName = 'Ad gereklidir';
        if (!formData.billingLastName.trim()) errors.billingLastName = 'Soyad gereklidir';
        if (!formData.billingAddress.trim()) errors.billingAddress = 'Adres gereklidir';
        if (!formData.billingCity.trim()) errors.billingCity = 'İl gereklidir';
        if (!formData.billingDistrict.trim()) errors.billingDistrict = 'İlçe gereklidir';
      }
    }
    
    // Ödeme bilgileri doğrulama
    if (checkoutStep === 2) {
      if (!formData.cardNumber.trim()) errors.cardNumber = 'Kart numarası gereklidir';
      else if (formData.cardNumber.replace(/\s/g, '').length !== 16) errors.cardNumber = 'Geçerli bir kart numarası giriniz';
      
      if (!formData.cardName.trim()) errors.cardName = 'Kart üzerindeki isim gereklidir';
      
      if (!formData.cardExpiry.trim()) errors.cardExpiry = 'Son kullanma tarihi gereklidir';
      else if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) errors.cardExpiry = 'AA/YY formatında giriniz';
      
      if (!formData.cardCVC.trim()) errors.cardCVC = 'CVC gereklidir';
      else if (!/^\d{3,4}$/.test(formData.cardCVC)) errors.cardCVC = 'Geçerli bir CVC giriniz';
      
      if (!formData.termsAccepted) errors.termsAccepted = 'Şartları ve koşulları kabul etmelisiniz';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Sonraki adıma geçme
  const goToNextStep = () => {
    if (validateForm()) {
      window.scrollTo(0, 0);
      setCheckoutStep(prev => prev + 1);
    }
  };
  
  // Önceki adıma dönme
  const goToPreviousStep = () => {
    window.scrollTo(0, 0);
    setCheckoutStep(prev => prev - 1);
  };
  
  // Siparişi tamamlama
  const completeOrder = () => {
    if (validateForm()) {
      // Gerçek projede API'ya istek yapılacak
      // Şimdilik mock bir işlem yapıyoruz
      setCheckoutStep(3); // Onay adımına geç
      window.scrollTo(0, 0);
    }
  };
  
  // Kart numarasını formatlama
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  // Son kullanma tarihini formatlama
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return value;
  };
  
  // Fiyat hesaplamaları
  const calculateTotal = () => {
    if (!cart.subtotal) return 0;
    
    let total = cart.subtotal;
    
    // Kupon indirimi
    if (cart.coupon) {
      const couponDiscount = cart.coupon.type === 'percentage' 
        ? cart.subtotal * (cart.coupon.discount / 100) 
        : cart.coupon.discount;
      
      total -= couponDiscount;
    }
    
    // Kargo ücreti
    total += cart.shipping;
    
    // Vergiler
    total += cart.tax;
    
    return total;
  };
  
  // Kupon indirimi hesaplama
  const calculateCouponDiscount = () => {
    if (!cart.subtotal || !cart.coupon) return 0;
    
    return cart.coupon.type === 'percentage' 
      ? cart.subtotal * (cart.coupon.discount / 100) 
      : cart.coupon.discount;
  };
  
  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="loading-spinner"></div>
        <p>Ödeme bilgileri yükleniyor...</p>
      </div>
    );
  }
  
  // Eğer sepet boşsa
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-empty">
        <h1 className="page-title">ÖDEME</h1>
        <div className="checkout-empty-content">
          <p>Sepetinizde ürün bulunmamaktadır. Ödeme yapabilmek için önce sepetinize ürün eklemelisiniz.</p>
          <Link href="/urunler" className="btn">ALIŞVERİŞE BAŞLA</Link>
        </div>
      </div>
    );
  }
  
  return (
    <main className="checkout-page">
      <div className="container">
        <h1 className="page-title">ÖDEME</h1>
        
        {/* Checkout Adımları */}
        <div className="checkout-steps">
          <div className={`checkout-step ${checkoutStep >= 1 ? 'active' : ''} ${checkoutStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-title">Teslimat Bilgileri</div>
          </div>
          <div className={`checkout-step ${checkoutStep >= 2 ? 'active' : ''} ${checkoutStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-title">Ödeme Bilgileri</div>
          </div>
          <div className={`checkout-step ${checkoutStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-title">Sipariş Onayı</div>
          </div>
        </div>
        
        <div className="checkout-content">
          <div className="checkout-main">
            {/* Teslimat Bilgileri Adımı */}
            {checkoutStep === 1 && (
              <div className="checkout-form">
                <h2 className="form-section-title">Teslimat Bilgileri</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">Ad <span className="required">*</span></label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className={`form-input ${formErrors.firstName ? 'has-error' : ''}`}
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                    {formErrors.firstName && <div className="form-error">{formErrors.firstName}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">Soyad <span className="required">*</span></label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className={`form-input ${formErrors.lastName ? 'has-error' : ''}`}
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                    {formErrors.lastName && <div className="form-error">{formErrors.lastName}</div>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">E-posta <span className="required">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-input ${formErrors.email ? 'has-error' : ''}`}
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {formErrors.email && <div className="form-error">{formErrors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Telefon <span className="required">*</span></label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`form-input ${formErrors.phone ? 'has-error' : ''}`}
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {formErrors.phone && <div className="form-error">{formErrors.phone}</div>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Adres <span className="required">*</span></label>
                  <textarea
                    id="address"
                    name="address"
                    rows="3"
                    className={`form-input ${formErrors.address ? 'has-error' : ''}`}
                    value={formData.address}
                    onChange={handleInputChange}
                  ></textarea>
                  {formErrors.address && <div className="form-error">{formErrors.address}</div>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">İl <span className="required">*</span></label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className={`form-input ${formErrors.city ? 'has-error' : ''}`}
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    {formErrors.city && <div className="form-error">{formErrors.city}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="district" className="form-label">İlçe <span className="required">*</span></label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      className={`form-input ${formErrors.district ? 'has-error' : ''}`}
                      value={formData.district}
                      onChange={handleInputChange}
                    />
                    {formErrors.district && <div className="form-error">{formErrors.district}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="postalCode" className="form-label">Posta Kodu</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      className="form-input"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="form-section-divider"></div>
                
                <h2 className="form-section-title">Fatura Bilgileri</h2>
                
                <div className="form-group">
                  <label className="form-checkbox">
                    <input
                      type="checkbox"
                      name="sameAsShipping"
                      checked={formData.sameAsShipping}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-text">Fatura bilgilerim teslimat bilgilerim ile aynı</span>
                  </label>
                </div>
                
                {!formData.sameAsShipping && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="billingFirstName" className="form-label">Ad <span className="required">*</span></label>
                        <input
                          type="text"
                          id="billingFirstName"
                          name="billingFirstName"
                          className={`form-input ${formErrors.billingFirstName ? 'has-error' : ''}`}
                          value={formData.billingFirstName}
                          onChange={handleInputChange}
                        />
                        {formErrors.billingFirstName && <div className="form-error">{formErrors.billingFirstName}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="billingLastName" className="form-label">Soyad <span className="required">*</span></label>
                        <input
                          type="text"
                          id="billingLastName"
                          name="billingLastName"
                          className={`form-input ${formErrors.billingLastName ? 'has-error' : ''}`}
                          value={formData.billingLastName}
                          onChange={handleInputChange}
                        />
                        {formErrors.billingLastName && <div className="form-error">{formErrors.billingLastName}</div>}
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="billingAddress" className="form-label">Adres <span className="required">*</span></label>
                      <textarea
                        id="billingAddress"
                        name="billingAddress"
                        rows="3"
                        className={`form-input ${formErrors.billingAddress ? 'has-error' : ''}`}
                        value={formData.billingAddress}
                        onChange={handleInputChange}
                      ></textarea>
                      {formErrors.billingAddress && <div className="form-error">{formErrors.billingAddress}</div>}
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="billingCity" className="form-label">İl <span className="required">*</span></label>
                        <input
                          type="text"
                          id="billingCity"
                          name="billingCity"
                          className={`form-input ${formErrors.billingCity ? 'has-error' : ''}`}
                          value={formData.billingCity}
                          onChange={handleInputChange}
                        />
                        {formErrors.billingCity && <div className="form-error">{formErrors.billingCity}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="billingDistrict" className="form-label">İlçe <span className="required">*</span></label>
                        <input
                          type="text"
                          id="billingDistrict"
                          name="billingDistrict"
                          className={`form-input ${formErrors.billingDistrict ? 'has-error' : ''}`}
                          value={formData.billingDistrict}
                          onChange={handleInputChange}
                        />
                        {formErrors.billingDistrict && <div className="form-error">{formErrors.billingDistrict}</div>}
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="billingPostalCode" className="form-label">Posta Kodu</label>
                        <input
                          type="text"
                          id="billingPostalCode"
                          name="billingPostalCode"
                          className="form-input"
                          value={formData.billingPostalCode}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                <div className="form-section-divider"></div>
                
                <div className="form-group">
                  <label htmlFor="notes" className="form-label">Sipariş Notu</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows="3"
                    className="form-input"
                    placeholder="Siparişinizle ilgili eklemek istediğiniz notlar..."
                    value={formData.notes}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div className="form-actions">
                  <Link href="/sepet" className="btn btn-outline">SEPETE DÖN</Link>
                  <button type="button" className="btn btn-primary" onClick={goToNextStep}>DEVAM ET</button>
                </div>
              </div>
            )}
            
            {/* Ödeme Bilgileri Adımı */}
            {checkoutStep === 2 && (
              <div className="checkout-form">
                <h2 className="form-section-title">Ödeme Bilgileri</h2>
                
                <div className="payment-methods">
                  <div className="payment-method active">
                    <div className="payment-method-header">
                      <input type="radio" id="creditCard" name="paymentMethod" checked={true} readOnly />
                      <label htmlFor="creditCard">Kredi/Banka Kartı</label>
                    </div>
                    
                    <div className="payment-method-content">
                      <div className="credit-card-form">
                        <div className="form-group">
                          <label htmlFor="cardNumber" className="form-label">Kart Numarası <span className="required">*</span></label>
                          <div className="card-number-input-group">
                            <input
                              type="text"
                              id="cardNumber"
                              name="cardNumber"
                              className={`form-input ${formErrors.cardNumber ? 'has-error' : ''}`}
                              placeholder="1234 5678 9012 3456"
                              maxLength="19"
                              value={formData.cardNumber}
                              onChange={(e) => {
                                const formattedValue = formatCardNumber(e.target.value);
                                setFormData(prev => ({ ...prev, cardNumber: formattedValue }));
                                if (formErrors.cardNumber) {
                                  setFormErrors(prev => ({ ...prev, cardNumber: '' }));
                                }
                              }}
                            />
                            <div className="card-icons">
                              <div className="card-icon visa"></div>
                              <div className="card-icon mastercard"></div>
                              <div className="card-icon amex"></div>
                            </div>
                          </div>
                          {formErrors.cardNumber && <div className="form-error">{formErrors.cardNumber}</div>}
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="cardName" className="form-label">Kart Üzerindeki İsim <span className="required">*</span></label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            className={`form-input ${formErrors.cardName ? 'has-error' : ''}`}
                            placeholder="Kart sahibinin adı ve soyadı"
                            value={formData.cardName}
                            onChange={handleInputChange}
                          />
                          {formErrors.cardName && <div className="form-error">{formErrors.cardName}</div>}
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="cardExpiry" className="form-label">Son Kullanma Tarihi <span className="required">*</span></label>
                            <input
                              type="text"
                              id="cardExpiry"
                              name="cardExpiry"
                              className={`form-input ${formErrors.cardExpiry ? 'has-error' : ''}`}
                              placeholder="AA/YY"
                              maxLength="5"
                              value={formData.cardExpiry}
                              onChange={(e) => {
                                const formattedValue = formatExpiry(e.target.value);
                                setFormData(prev => ({ ...prev, cardExpiry: formattedValue }));
                                if (formErrors.cardExpiry) {
                                  setFormErrors(prev => ({ ...prev, cardExpiry: '' }));
                                }
                              }}
                            />
                            {formErrors.cardExpiry && <div className="form-error">{formErrors.cardExpiry}</div>}
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="cardCVC" className="form-label">CVC <span className="required">*</span></label>
                            <input
                              type="text"
                              id="cardCVC"
                              name="cardCVC"
                              className={`form-input ${formErrors.cardCVC ? 'has-error' : ''}`}
                              placeholder="123"
                              maxLength="4"
                              value={formData.cardCVC}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                setFormData(prev => ({ ...prev, cardCVC: value }));
                                if (formErrors.cardCVC) {
                                  setFormErrors(prev => ({ ...prev, cardCVC: '' }));
                                }
                              }}
                            />
                            {formErrors.cardCVC && <div className="form-error">{formErrors.cardCVC}</div>}
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label className="form-checkbox">
                            <input
                              type="checkbox"
                              name="saveCard"
                              checked={formData.saveCard}
                              onChange={handleInputChange}
                            />
                            <span className="checkbox-text">Kart bilgilerimi kaydet</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="form-group terms-acceptance">
                  <label className="form-checkbox">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleInputChange}
                    />
                    <span className="checkbox-text">
                      <Link href="/kosullar" className="terms-link">Şartlar ve Koşullar</Link> ı okudum ve kabul ediyorum.
                    </span>
                  </label>
                  {formErrors.termsAccepted && <div className="form-error">{formErrors.termsAccepted}</div>}
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-outline" onClick={goToPreviousStep}>GERİ</button>
                  <button type="button" className="btn btn-primary" onClick={completeOrder}>SİPARİŞİ TAMAMLA</button>
                </div>
              </div>
            )}
            
            {/* Sipariş Onayı Adımı */}
            {checkoutStep === 3 && (
              <div className="order-confirmation">
                <div className="order-success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h2 className="order-success-title">Siparişiniz Alındı!</h2>
                <p className="order-success-message">
                  Siparişiniz başarıyla oluşturuldu. Sipariş detaylarınız e-posta adresinize gönderildi.
                </p>
                
                <div className="order-number">
                  <span className="order-number-label">Sipariş Numarası:</span>
                  <span className="order-number-value">DOVL{Math.floor(100000 + Math.random() * 900000)}</span>
                </div>
                
                <div className="order-details">
                  <h3 className="order-details-title">Sipariş Detayları</h3>
                  
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title">Teslimat Bilgileri</h4>
                    <p>
                      {formData.firstName} {formData.lastName}<br />
                      {formData.address}<br />
                      {formData.district}, {formData.city}, {formData.postalCode || ''}<br />
                      {formData.phone}<br />
                      {formData.email}
                    </p>
                  </div>
                  
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title">Fatura Bilgileri</h4>
                    <p>
                      {formData.sameAsShipping ? (
                        <>
                          {formData.firstName} {formData.lastName}<br />
                          {formData.address}<br />
                          {formData.district}, {formData.city}, {formData.postalCode || ''}
                        </>
                      ) : (
                        <>
                          {formData.billingFirstName} {formData.billingLastName}<br />
                          {formData.billingAddress}<br />
                          {formData.billingDistrict}, {formData.billingCity}, {formData.billingPostalCode || ''}
                        </>
                      )}
                    </p>
                  </div>
                  
                  <div className="order-detail-section">
                    <h4 className="order-detail-section-title">Ödeme Yöntemi</h4>
                    <p>Kredi Kartı (•••• {formData.cardNumber.slice(-4)})</p>
                  </div>
                </div>
                
                <div className="order-confirmation-actions">
                  <Link href="/" className="btn btn-outline">ANA SAYFAYA DÖN</Link>
                  <Link href="/hesabim/siparisler" className="btn btn-primary">SİPARİŞLERİMİ GÖRÜNTÜLE</Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h2 className="summary-title">SİPARİŞ ÖZETİ</h2>
              
              <div className="summary-products">
                {cart.items.map((item) => (
                  <div key={item.id} className="summary-product">
                    <div className="summary-product-image">
                      <img src={item.image} alt={item.name} />
                      <span className="summary-product-quantity">{item.quantity}</span>
                    </div>
                    <div className="summary-product-details">
                      <div className="summary-product-name">{item.name}</div>
                      <div className="summary-product-meta">
                        <span className="summary-product-color">Renk: {item.color}</span>
                        <span className="summary-product-size">Beden: {item.size}</span>
                      </div>
                    </div>
                    <div className="summary-product-price">
                      {((item.salePrice || item.price) * item.quantity).toFixed(2)}TL
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="summary-row">
                <span className="summary-label">Ara Toplam</span>
                <span className="summary-value">{cart.subtotal.toFixed(2)}TL</span>
              </div>
              
              {cart.coupon && (
                <div className="summary-row summary-discount">
                  <span className="summary-label">İndirim ({cart.coupon.code})</span>
                  <span className="summary-value">-{calculateCouponDiscount().toFixed(2)}TL</span>
                </div>
              )}
              
              <div className="summary-row">
                <span className="summary-label">Kargo</span>
                <span className="summary-value">
                  {cart.shipping === 0 ? 'Ücretsiz' : `${cart.shipping.toFixed(2)}TL`}
                </span>
              </div>
              
              <div className="summary-row">
                <span className="summary-label">KDV (18%)</span>
                <span className="summary-value">{cart.tax.toFixed(2)}TL</span>
              </div>
              
              <div className="summary-row summary-total">
                <span className="summary-label">Toplam</span>
                <span className="summary-value">{calculateTotal().toFixed(2)}TL</span>
              </div>
            </div>
            
            <div className="checkout-sidebar-info">
              <div className="checkout-secure-payment">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p>Tüm ödemeleriniz 256-bit SSL sertifikası ile şifrelenmektedir.</p>
              </div>
              
              <div className="checkout-shipping-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <p>500 TL ve üzeri siparişlerde kargo ücretsizdir.</p>
              </div>
              
              <div className="checkout-support">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <p>Sorularınız için 7/24 müşteri hizmetleri: +90 212 123 45 67</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}