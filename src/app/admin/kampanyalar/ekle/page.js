// src/app/admin/kampanyalar/ekle/page.js
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminAddCampaign() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchaseAmount: '',
    maxUses: '',
    usagePerCustomer: '1',
    startDate: '',
    endDate: '',
    applicableTo: 'all_products',
    selectedCategories: [],
    selectedProducts: [],
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Mock verileri yükleme
  useEffect(() => {
    // Gerçek projede API çağrıları yapılacak
    setCategories([
      { id: 'elbise', name: 'Elbise' },
      { id: 'bluz', name: 'Bluz' },
      { id: 'etek', name: 'Etek' },
      { id: 'pantolon', name: 'Pantolon' },
      { id: 'ceket', name: 'Ceket' },
      { id: 'aksesuar', name: 'Aksesuar' }
    ]);
    
    setProducts([
      { id: 'elbise-1', name: 'Siyah Midi Elbise', category: 'elbise', price: 899.90 },
      { id: 'bluz-1', name: 'Sarı Basic Bluz', category: 'bluz', price: 379.90 },
      { id: 'etek-1', name: 'Mavi Midi Etek', category: 'etek', price: 529.90 },
      { id: 'pantolon-1', name: 'Siyah Skinny Pantolon', category: 'pantolon', price: 699.90 },
      { id: 'ceket-1', name: 'Siyah Blazer Ceket', category: 'ceket', price: 1159.90 },
      { id: 'elbise-2', name: 'Kırmızı Maxi Elbise', category: 'elbise', price: 1299.90 },
      { id: 'bluz-2', name: 'Beyaz V Yaka Bluz', category: 'bluz', price: 449.90 }
    ]);
    
    // Bugünün tarihini başlangıç tarihi olarak ayarla
    const today = new Date().toISOString().split('T')[0];
    
    // 1 ay sonraki tarihi bitiş tarihi olarak ayarla
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const endDate = nextMonth.toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      startDate: today,
      endDate: endDate
    }));
    
  }, []);
  
  // Form alanı değişikliği
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // İndirim kodu otomatik büyük harf
    if (name === 'code') {
      setFormData(prev => ({
        ...prev,
        code: value.toUpperCase()
      }));
    }
    
    // Hata varsa temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Hedef tipi değiştirme
  const handleTargetChange = (target) => {
    setFormData(prev => ({
      ...prev,
      applicableTo: target
    }));
  };
  
  // Kategori seçme/kaldırma
  const toggleCategory = (categoryId) => {
    setFormData(prev => {
      if (prev.selectedCategories.includes(categoryId)) {
        return {
          ...prev,
          selectedCategories: prev.selectedCategories.filter(id => id !== categoryId)
        };
      } else {
        return {
          ...prev,
          selectedCategories: [...prev.selectedCategories, categoryId]
        };
      }
    });
  };
  
  // Ürün seçme/kaldırma
  const toggleProduct = (productId) => {
    setFormData(prev => {
      if (prev.selectedProducts.includes(productId)) {
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.filter(id => id !== productId)
        };
      } else {
        return {
          ...prev,
          selectedProducts: [...prev.selectedProducts, productId]
        };
      }
    });
  };
  
  // Form doğrulama
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Kampanya adı gereklidir';
    if (!formData.code.trim()) newErrors.code = 'İndirim kodu gereklidir';
    if (!formData.discountValue) newErrors.discountValue = 'İndirim değeri gereklidir';
    else if (formData.discountType === 'percentage' && (isNaN(formData.discountValue) || Number(formData.discountValue) <= 0 || Number(formData.discountValue) > 100)) {
      newErrors.discountValue = 'Yüzde indirim değeri 1 ile 100 arasında olmalıdır';
    } else if (formData.discountType === 'fixed_amount' && (isNaN(formData.discountValue) || Number(formData.discountValue) <= 0)) {
      newErrors.discountValue = 'Geçerli bir indirim değeri giriniz';
    }
    
    if (formData.minPurchaseAmount && (isNaN(formData.minPurchaseAmount) || Number(formData.minPurchaseAmount) < 0)) {
      newErrors.minPurchaseAmount = 'Geçerli bir minimum sepet tutarı giriniz';
    }
    
    if (formData.maxUses && (isNaN(formData.maxUses) || Number(formData.maxUses) <= 0)) {
      newErrors.maxUses = 'Geçerli bir maksimum kullanım değeri giriniz';
    }
    
    if (!formData.startDate) newErrors.startDate = 'Başlangıç tarihi gereklidir';
    if (!formData.endDate) newErrors.endDate = 'Bitiş tarihi gereklidir';
    
    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır';
    }
    
    if (formData.applicableTo === 'specific_categories' && formData.selectedCategories.length === 0) {
      newErrors.selectedCategories = 'En az bir kategori seçiniz';
    }
    
    if (formData.applicableTo === 'specific_products' && formData.selectedProducts.length === 0) {
      newErrors.selectedProducts = 'En az bir ürün seçiniz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form gönderme
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Gerçek projede API'ya istek yapılacak
      // Şimdilik mock bir delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Kampanya başarıyla eklendi:', formData);
      setSuccess(true);
      
      // Form resetleme
      setFormData({
        name: '',
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchaseAmount: '',
        maxUses: '',
        usagePerCustomer: '1',
        startDate: new Date().toISOString().split('T')[0],
        endDate: (() => {
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          return nextMonth.toISOString().split('T')[0];
        })(),
        applicableTo: 'all_products',
        selectedCategories: [],
        selectedProducts: [],
        isActive: true
      });
      
      // Belirli bir süre sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Kampanya eklenirken bir hata oluştu:', error);
      setErrors({ submit: 'Kampanya eklenirken bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="admin-add-campaign">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Yeni Kampanya Ekle</h1>
        <Link href="/admin/kampanyalar" className="admin-back-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kampanyalara Dön
        </Link>
      </div>
      
      {success && (
        <div className="admin-alert admin-alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Kampanya başarıyla oluşturuldu!</span>
        </div>
      )}
      
      {errors.submit && (
        <div className="admin-alert admin-alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errors.submit}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-panel">
          <div className="admin-panel-title">Kampanya Bilgileri</div>
          <div className="admin-panel-content">
            <div className="admin-form-group">
              <label htmlFor="name" className="admin-form-label">Kampanya Adı <span className="required">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`admin-form-input ${errors.name ? 'admin-input-error' : ''}`}
                placeholder="Örn: Yaz İndirimi, Özel Üye İndirimi"
              />
              {errors.name && <div className="admin-form-error">{errors.name}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="code" className="admin-form-label">İndirim Kodu <span className="required">*</span></label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className={`admin-form-input ${errors.code ? 'admin-input-error' : ''}`}
                placeholder="Örn: YAZ2025, OZELFIRSATDOVL"
              />
              {errors.code && <div className="admin-form-error">{errors.code}</div>}
              <div className="admin-form-hint">Büyük harflerle ve boşluk olmadan yazınız. (Otomatik büyük harfe çevrilir)</div>
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="discountType" className="admin-form-label">İndirim Türü <span className="required">*</span></label>
                <select
                  id="discountType"
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="admin-form-select"
                >
                  <option value="percentage">Yüzde İndirim (%)</option>
                  <option value="fixed_amount">Sabit Tutar İndirimi (TL)</option>
                </select>
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="discountValue" className="admin-form-label">İndirim Değeri <span className="required">*</span></label>
                <input
                  type="number"
                  id="discountValue"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  className={`admin-form-input ${errors.discountValue ? 'admin-input-error' : ''}`}
                  placeholder={formData.discountType === 'percentage' ? 'Örn: 20' : 'Örn: 100'}
                  min={formData.discountType === 'percentage' ? 1 : 0.01}
                  max={formData.discountType === 'percentage' ? 100 : undefined}
                  step={formData.discountType === 'percentage' ? 1 : 0.01}
                />
                {errors.discountValue && <div className="admin-form-error">{errors.discountValue}</div>}
              </div>
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="minPurchaseAmount" className="admin-form-label">Minimum Sepet Tutarı (TL)</label>
                <input
                  type="number"
                  id="minPurchaseAmount"
                  name="minPurchaseAmount"
                  value={formData.minPurchaseAmount}
                  onChange={handleChange}
                  className={`admin-form-input ${errors.minPurchaseAmount ? 'admin-input-error' : ''}`}
                  placeholder="Örn: 500"
                  min="0"
                  step="0.01"
                />
                {errors.minPurchaseAmount && <div className="admin-form-error">{errors.minPurchaseAmount}</div>}
                <div className="admin-form-hint">Boş bırakırsanız minimum sepet tutarı olmayacaktır</div>
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="maxUses" className="admin-form-label">Maksimum Kullanım</label>
                <input
                  type="number"
                  id="maxUses"
                  name="maxUses"
                  value={formData.maxUses}
                  onChange={handleChange}
                  className={`admin-form-input ${errors.maxUses ? 'admin-input-error' : ''}`}
                  placeholder="Örn: 100"
                  min="1"
                />
                {errors.maxUses && <div className="admin-form-error">{errors.maxUses}</div>}
                <div className="admin-form-hint">Boş bırakırsanız kullanım limiti olmayacaktır</div>
              </div>
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="usagePerCustomer" className="admin-form-label">Müşteri Başına Kullanım</label>
              <select
                id="usagePerCustomer"
                name="usagePerCustomer"
                value={formData.usagePerCustomer}
                onChange={handleChange}
                className="admin-form-select"
              >
                <option value="1">1 kez (sadece bir kez)</option>
                <option value="unlimited">Sınırsız (birden fazla kullanım)</option>
              </select>
            </div>
            
            <div className="campaign-date-range">
              <div className="admin-form-group">
                <label htmlFor="startDate" className="admin-form-label">Başlangıç Tarihi <span className="required">*</span></label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`admin-form-input ${errors.startDate ? 'admin-input-error' : ''}`}
                />
                {errors.startDate && <div className="admin-form-error">{errors.startDate}</div>}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="endDate" className="admin-form-label">Bitiş Tarihi <span className="required">*</span></label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`admin-form-input ${errors.endDate ? 'admin-input-error' : ''}`}
                />
                {errors.endDate && <div className="admin-form-error">{errors.endDate}</div>}
              </div>
            </div>
            
            <div className="admin-form-group admin-checkbox-group">
              <label className="admin-checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span>Aktif</span>
              </label>
              <div className="admin-form-hint">İşaretli değilse kampanya kaydedilir ama aktif olmaz</div>
            </div>
          </div>
        </div>
        
        <div className="admin-panel">
          <div className="admin-panel-title">Kampanya Hedefi</div>
          <div className="admin-panel-content">
            <div className="campaign-target-options">
              <div 
                className={`campaign-target-option ${formData.applicableTo === 'all_products' ? 'selected' : ''}`}
                onClick={() => handleTargetChange('all_products')}
              >
                <div className="campaign-target-option-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="campaign-target-option-text">Tüm Ürünler</div>
              </div>
              
              <div 
                className={`campaign-target-option ${formData.applicableTo === 'specific_categories' ? 'selected' : ''}`}
                onClick={() => handleTargetChange('specific_categories')}
              >
                <div className="campaign-target-option-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="campaign-target-option-text">Belirli Kategoriler</div>
              </div>
              
              <div 
                className={`campaign-target-option ${formData.applicableTo === 'specific_products' ? 'selected' : ''}`}
                onClick={() => handleTargetChange('specific_products')}
              >
                <div className="campaign-target-option-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="campaign-target-option-text">Belirli Ürünler</div>
              </div>
            </div>
            
            {formData.applicableTo === 'specific_categories' && (
              <div className="admin-form-group">
                <label className="admin-form-label">Kategoriler <span className="required">*</span></label>
                <div className="admin-checkbox-group-container">
                  {categories.map(category => (
                    <div key={category.id} className="admin-checkbox-group">
                      <label className="admin-checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                        />
                        <span>{category.name}</span>
                      </label>
                    </div>
                  ))}
                </div>
                {errors.selectedCategories && <div className="admin-form-error">{errors.selectedCategories}</div>}
              </div>
            )}
            
            {formData.applicableTo === 'specific_products' && (
              <div className="admin-form-group">
                <label className="admin-form-label">Ürünler <span className="required">*</span></label>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}></th>
                        <th>Ürün Adı</th>
                        <th>Kategori</th>
                        <th>Fiyat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => {
                        const category = categories.find(c => c.id === product.category);
                        
                        return (
                          <tr key={product.id} className={formData.selectedProducts.includes(product.id) ? 'selected-row' : ''}>
                            <td>
                              <input
                                type="checkbox"
                                checked={formData.selectedProducts.includes(product.id)}
                                onChange={() => toggleProduct(product.id)}
                              />
                            </td>
                            <td>{product.name}</td>
                            <td>{category ? category.name : product.category}</td>
                            <td>{product.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {errors.selectedProducts && <div className="admin-form-error">{errors.selectedProducts}</div>}
              </div>
            )}
          </div>
        </div>
        
        <div className="admin-form-actions">
          <Link href="/admin/kampanyalar" className="admin-button admin-button-secondary">
            İptal
          </Link>
          <button
            type="submit"
            className="admin-button admin-button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="admin-button-spinner"></div>
                Kaydediliyor...
              </>
            ) : 'Kampanyayı Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}