"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Renk ve beden seçim alanları için yeni komponentler
const ColorSelector = ({ colors, selectedColors, onToggle }) => (
  <div className="admin-color-selector">
    {colors.map(color => (
      <button 
        key={color.id} 
        type="button"
        className={`admin-color-button ${selectedColors.includes(color.id) ? 'selected' : ''}`}
        onClick={() => onToggle(color.id)}
      >
        <div 
          className="admin-color-swatch" 
          style={{ 
            backgroundColor: color.hex,
            border: color.id === 'beyaz' ? '1px solid #ddd' : 'none'
          }}
        ></div>
        <div className="admin-color-name">{color.name}</div>
      </button>
    ))}
  </div>
);

const SizeSelector = ({ sizes, selectedSizes, onToggle }) => (
  <div className="admin-size-selector">
    {sizes.map(size => (
      <button 
        key={size.id} 
        type="button"
        className={`admin-size-button ${selectedSizes.includes(size.id) ? 'selected' : ''}`}
        onClick={() => onToggle(size.id)}
      >
        {size.name}
      </button>
    ))}
  </div>
);

// Varyantlar için renk ve beden kombinasyonları
const ProductVariants = ({ colors, sizes, selectedColors, selectedSizes, variants, onChange }) => {
  // Seçili renk ve bedenlere göre varyantları oluştur
  const updateVariants = () => {
    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      // Henüz renk ve beden seçilmemişse uyarı göster
      alert('Lütfen en az bir renk ve bir beden seçin.');
      return;
    }
    
    const newVariants = [];
    
    // Seçili her renk için
    selectedColors.forEach(colorId => {
      const color = colors.find(c => c.id === colorId);
      
      // Seçili her beden için
      selectedSizes.forEach(sizeId => {
        const size = sizes.find(s => s.id === sizeId);
        
        // Mevcut varyantı bul
        const existingVariant = variants.find(
          v => v.colorId === colorId && v.sizeId === sizeId
        );
        
        // Mevcut varyant varsa onu kullan, yoksa yeni oluştur
        const variant = existingVariant || {
          id: `${colorId}-${sizeId}`,
          colorId: colorId,
          colorName: color.name,
          colorHex: color.hex,
          sizeId: sizeId,
          sizeName: size.name,
          stock: 0,
          sku: `DOVL-${colorId.substring(0,3).toUpperCase()}-${sizeId.toUpperCase()}`
        };
        
        newVariants.push(variant);
      });
    });
    
    onChange(newVariants);
  };
  
  
  // Varyant stok güncelleme
  const handleStockChange = (variantId, value) => {
    const updatedVariants = variants.map(variant => {
      if (variant.id === variantId) {
        return { ...variant, stock: parseInt(value) || 0 };
      }
      return variant;
    });
    
    onChange(updatedVariants);
  };

  // SKU güncelleme
  const handleSkuChange = (variantId, value) => {
    const updatedVariants = variants.map(variant => {
      if (variant.id === variantId) {
        return { ...variant, sku: value };
      }
      return variant;
    });
    
    onChange(updatedVariants);
  };
  
  return (
    <div className="admin-product-variants">
      <div className="admin-panel-subheader">
        <h3>Ürün Varyantları</h3>
        <button 
          type="button" 
          className="admin-button admin-button-small admin-button-primary"
          onClick={updateVariants}
        >
          Varyantları Güncelle
        </button>
      </div>
      
      {variants.length > 0 ? (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Renk</th>
              <th>Beden</th>
              <th>Stok Miktarı</th>
              <th>Ürün Kodu (SKU)</th>
            </tr>
          </thead>
          <tbody>
            {variants.map(variant => (
              <tr key={variant.id}>
                <td>
                  <div className="admin-variant-color">
                    <div 
                      className="admin-color-swatch-small" 
                      style={{ 
                        backgroundColor: variant.colorHex,
                        border: variant.colorId === 'beyaz' ? '1px solid #ddd' : 'none'
                      }}
                    ></div>
                    <span>{variant.colorName}</span>
                  </div>
                </td>
                <td>{variant.sizeName}</td>
                <td>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) => handleStockChange(variant.id, e.target.value)}
                    className="admin-form-input admin-form-input-small"
                    min="0"
                    step="1"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={variant.sku}
                    onChange={(e) => handleSkuChange(variant.id, e.target.value)}
                    className="admin-form-input"
                    placeholder="Ürün kodu"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="admin-no-variants">
          <p>Henüz ürün varyantı oluşturulmadı. En az bir renk ve bir beden seçip, Varyantları Güncelle butonuna tıklayın.</p>
        </div>
      )}
    </div>
  );
};

export default function AdminAddProduct() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    salePrice: '',
    category: '',
    stock: '',
    colors: [],
    sizes: [],
    images: [],
    variants: [], // Yeni eklenen varyantlar
    isNew: false,
    isActive: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Mock kategorileri yükleme (gerçek projede API'dan gelecek)
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
  
  // Mock renk ve beden seçenekleri
  const colorOptions = [
    { id: 'siyah', name: 'Siyah', hex: '#000000' },
    { id: 'beyaz', name: 'Beyaz', hex: '#FFFFFF' },
    { id: 'kirmizi', name: 'Kırmızı', hex: '#FF0000' },
    { id: 'mavi', name: 'Mavi', hex: '#0000FF' },
    { id: 'yesil', name: 'Yeşil', hex: '#008000' },
    { id: 'sari', name: 'Sarı', hex: '#FFFF00' },
    { id: 'mor', name: 'Mor', hex: '#800080' },
    { id: 'kahverengi', name: 'Kahverengi', hex: '#8B4513' },
    { id: 'gri', name: 'Gri', hex: '#808080' },
    { id: 'pembe', name: 'Pembe', hex: '#FF69B4' },
    { id: 'turuncu', name: 'Turuncu', hex: '#FFA500' },
    { id: 'bej', name: 'Bej', hex: '#F5F5DC' }
  ];
  
  const sizeOptions = [
    { id: 'xs', name: 'XS' },
    { id: 's', name: 'S' },
    { id: 'm', name: 'M' },
    { id: 'l', name: 'L' },
    { id: 'xl', name: 'XL' },
    { id: 'xxl', name: 'XXL' }
  ];
  
  // Formu güncelleme
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Otomatik slug oluştur
    if (name === 'name') {
      const slugValue = value.toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      setFormData(prev => ({
        ...prev,
        slug: slugValue
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
  
  // Renk seçme/kaldırma
  const toggleColor = (colorId) => {
    setFormData(prev => {
      if (prev.colors.includes(colorId)) {
        return {
          ...prev,
          colors: prev.colors.filter(c => c !== colorId)
        };
      } else {
        return {
          ...prev,
          colors: [...prev.colors, colorId]
        };
      }
    });
  };
  
  // Beden seçme/kaldırma
  const toggleSize = (sizeId) => {
    setFormData(prev => {
      if (prev.sizes.includes(sizeId)) {
        return {
          ...prev,
          sizes: prev.sizes.filter(s => s !== sizeId)
        };
      } else {
        return {
          ...prev,
          sizes: [...prev.sizes, sizeId]
        };
      }
    });
  };

  // Varyantları güncelleme
  const updateVariants = (newVariants) => {
    setFormData(prev => ({
      ...prev,
      variants: newVariants
    }));
  };
  
  // Mock görsel yükleme fonksiyonu
  const handleImageUpload = (e) => {
    // Gerçek projede API'ya dosya yüklenecek
    // Şimdilik mock URL oluşturuyoruz
    
    const files = Array.from(e.target.files);
    
    if (files.length > 0) {
      const newImages = files.map((file, index) => {
        // Mock bir URL oluştur
        const color = Math.floor(Math.random() * 16777215).toString(16);
        return {
          id: `img-${Date.now()}-${index}`,
          src: `https://placehold.co/800x1100/${color}/FFFFFF/png?text=DOVL`,
          alt: file.name
        };
      });
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };
  
  // Görsel silme
  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };
  
  // Form doğrulama
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Ürün adı gereklidir';
    if (!formData.slug.trim()) newErrors.slug = 'Slug gereklidir';
    if (!formData.description.trim()) newErrors.description = 'Açıklama gereklidir';
    if (!formData.price) newErrors.price = 'Fiyat gereklidir';
    else if (isNaN(formData.price) || Number(formData.price) <= 0) newErrors.price = 'Geçerli bir fiyat giriniz';
    
    if (formData.salePrice && (isNaN(formData.salePrice) || Number(formData.salePrice) <= 0)) {
      newErrors.salePrice = 'Geçerli bir indirimli fiyat giriniz';
    }
    
    if (!formData.category) newErrors.category = 'Kategori seçimi gereklidir';
    
    if (formData.colors.length === 0) newErrors.colors = 'En az bir renk seçiniz';
    if (formData.sizes.length === 0) newErrors.sizes = 'En az bir beden seçiniz';
    if (formData.images.length === 0) newErrors.images = 'En az bir görsel yükleyiniz';
    
    // Varyant kontrolü
    if (formData.variants.length === 0) {
      newErrors.variants = 'En az bir ürün varyantı oluşturmalısınız';
    } else {
      // Tüm varyantların geçerli stok değerine sahip olduğunu kontrol et
      const hasInvalidStock = formData.variants.some(variant => 
        isNaN(variant.stock) || variant.stock < 0
      );
      
      if (hasInvalidStock) {
        newErrors.variants = 'Tüm varyantlar için geçerli stok miktarı giriniz';
      }
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
      
      console.log('Ürün başarıyla eklendi:', formData);
      setSuccess(true);
      
      // Form resetleme
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: '',
        salePrice: '',
        category: '',
        stock: '',
        colors: [],
        sizes: [],
        images: [],
        variants: [],
        isNew: false,
        isActive: true
      });
      
      // Belirli bir süre sonra başarı mesajını kaldır
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (error) {
      console.error('Ürün eklenirken bir hata oluştu:', error);
      setErrors({ submit: 'Ürün eklenirken bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="admin-add-product">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Yeni Ürün Ekle</h1>
        <Link href="/admin/urunler" className="admin-back-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Ürünlere Dön
        </Link>
      </div>
      
      {success && (
        <div className="admin-alert admin-alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Ürün başarıyla eklendi!</span>
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
        <div className="admin-form-grid">
          <div className="admin-form-left">
            <div className="admin-panel">
              <div className="admin-panel-title">Temel Bilgiler</div>
              <div className="admin-panel-content">
                <div className="admin-form-group">
                  <label htmlFor="name" className="admin-form-label">Ürün Adı <span className="required">*</span></label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`admin-form-input ${errors.name ? 'admin-input-error' : ''}`}
                  />
                  {errors.name && <div className="admin-form-error">{errors.name}</div>}
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="slug" className="admin-form-label">Slug <span className="required">*</span></label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className={`admin-form-input ${errors.slug ? 'admin-input-error' : ''}`}
                  />
                  {errors.slug && <div className="admin-form-error">{errors.slug}</div>}
                  <div className="admin-form-hint">Otomatik oluşturulur, değiştirebilirsiniz</div>
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="description" className="admin-form-label">Ürün Açıklaması <span className="required">*</span></label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className={`admin-form-textarea ${errors.description ? 'admin-input-error' : ''}`}
                  ></textarea>
                  {errors.description && <div className="admin-form-error">{errors.description}</div>}
                </div>
                
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label htmlFor="price" className="admin-form-label">Fiyat (TL) <span className="required">*</span></label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`admin-form-input ${errors.price ? 'admin-input-error' : ''}`}
                    />
                    {errors.price && <div className="admin-form-error">{errors.price}</div>}
                  </div>
                  
                  <div className="admin-form-group">
                    <label htmlFor="salePrice" className="admin-form-label">İndirimli Fiyat (TL)</label>
                    <input
                      type="number"
                      id="salePrice"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`admin-form-input ${errors.salePrice ? 'admin-input-error' : ''}`}
                    />
                    {errors.salePrice && <div className="admin-form-error">{errors.salePrice}</div>}
                  </div>
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="category" className="admin-form-label">Kategori <span className="required">*</span></label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`admin-form-select ${errors.category ? 'admin-input-error' : ''}`}
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {errors.category && <div className="admin-form-error">{errors.category}</div>}
                </div>
                
                <div className="admin-form-row">
                  <div className="admin-form-group admin-checkbox-group">
                    <label className="admin-checkbox-label">
                      <input
                        type="checkbox"
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleChange}
                      />
                      <span>Yeni Ürün</span>
                    </label>
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
                  </div>
                </div>
              </div>
            </div>
            
            <div className="admin-panel">
              <div className="admin-panel-title">Ürün Varyantları</div>
              <div className="admin-panel-content">
                <div className="admin-form-group">
                  <label className="admin-form-label">Renkler <span className="required">*</span></label>
                  <ColorSelector 
                    colors={colorOptions}
                    selectedColors={formData.colors}
                    onToggle={toggleColor}
                  />
                  {errors.colors && <div className="admin-form-error">{errors.colors}</div>}
                </div>
                
                <div className="admin-form-group">
                  <label className="admin-form-label">Bedenler <span className="required">*</span></label>
                  <SizeSelector 
                    sizes={sizeOptions}
                    selectedSizes={formData.sizes}
                    onToggle={toggleSize}
                  />
                  {errors.sizes && <div className="admin-form-error">{errors.sizes}</div>}
                </div>
                
                <ProductVariants 
                  colors={colorOptions}
                  sizes={sizeOptions}
                  selectedColors={formData.colors}
                  selectedSizes={formData.sizes}
                  variants={formData.variants}
                  onChange={updateVariants}
                />
                {errors.variants && <div className="admin-form-error">{errors.variants}</div>}
              </div>
            </div>
            
            <div className="admin-panel">
              <div className="admin-panel-title">Görsel Yükleme</div>
              <div className="admin-panel-content">
                <div className="admin-upload-area">
                  <label htmlFor="imageUpload" className="admin-upload-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Görselleri Seç</span>
                  </label>
                  <input
                    type="file"
                    id="imageUpload"
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="admin-upload-input"
                  />
                  <div className="admin-upload-info">PNG, JPG, WEBP dosyaları kabul edilir. Maksimum dosya boyutu: 5MB.</div>
                </div>
                
                {errors.images && <div className="admin-form-error">{errors.images}</div>}
                
                {formData.images.length > 0 && (
                  <div className="admin-image-preview">
                    {formData.images.map(image => (
                      <div key={image.id} className="admin-image-item">
                        <img src={image.src} alt={image.alt} />
                        <button
                          type="button"
                          className="admin-image-remove"
                          onClick={() => removeImage(image.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="admin-form-actions">
          <Link href="/admin/urunler" className="admin-button admin-button-secondary">
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
            ) : 'Ürünü Kaydet'}
          </button>
        </div>
      </form>
    </div>
  );
}