"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getProductById, addToCart } from '../../../utils/api';

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState({type: '', message: ''});
  
  // Ürün verisi yükleme
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
        
        // Eğer varyantlar varsa ilk varyantın bedenini seç
        if (data.variants && data.variants.length > 0) {
          setSelectedSize(data.variants[0].size);
        }
      } catch (error) {
        console.error("Ürün yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Boyut kılavuzunu göster/gizle
  const toggleSizeGuide = () => {
    setShowSizeGuide(!showSizeGuide);
  };
  
  // Miktar artırma
  const increaseQuantity = () => {
    const selectedVariant = product?.variants?.find(v => v.size === selectedSize);
    const maxStock = selectedVariant?.stock || 0;
    
    if (selectedQuantity < maxStock) {
      setSelectedQuantity(prev => prev + 1);
    }
  };
  
  // Miktar azaltma
  const decreaseQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(prev => prev - 1);
    }
  };
  
  // Sepete ekleme
  const handleAddToCart = async () => {
    if (!selectedSize) {
      setCartMessage({type: 'error', message: 'Lütfen bir beden seçiniz'});
      return;
    }
    
    const selectedVariant = product.variants.find(v => v.size === selectedSize);
    if (!selectedVariant) {
      setCartMessage({type: 'error', message: 'Seçilen beden bulunamadı'});
      return;
    }
    
    if (selectedVariant.stock < selectedQuantity) {
      setCartMessage({type: 'error', message: `Seçilen miktar için yeterli stok yok. Mevcut stok: ${selectedVariant.stock}`});
      return;
    }
    
    setCartLoading(true);
    try {
      await addToCart({
        productId: product.id || product._id,
        variantSku: selectedVariant.sku,
        quantity: selectedQuantity
      });
      
      setCartMessage({type: 'success', message: 'Ürün sepetinize eklendi!'});
      // Başarı mesajı belirli bir süre sonra kaybolsun
      setTimeout(() => {
        setCartMessage({type: '', message: ''});
      }, 3000);
    } catch (error) {
      console.error("Sepete eklerken hata:", error);
      setCartMessage({type: 'error', message: error.message || 'Sepete eklerken bir hata oluştu'});
    } finally {
      setCartLoading(false);
    }
  };
  
  // Favorilere ekleme
  const addToWishlist = () => {
    setCartMessage({type: 'info', message: 'Favorilere ekleme özelliği yakında eklenecek!'});
    setTimeout(() => {
      setCartMessage({type: '', message: ''});
    }, 3000);
  };
  
  if (loading) {
    return (
      <div className="product-loading-container">
        <div className="loading-spinner"></div>
        <p>Ürün bilgileri yükleniyor...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="product-not-found">
        <h1>Ürün Bulunamadı</h1>
        <p>Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Link href="/urunler" className="btn btn-primary">Tüm Ürünlere Dön</Link>
      </div>
    );
  }
  
  // Seçili varyanı bul
  const selectedVariant = product.variants.find(v => v.size === selectedSize);
  const stockLevel = selectedVariant ? selectedVariant.stock : 0;
  
  return (
    <main>
      {/* Ürün Detay */}
      <section className="product-detail-section">
        <div className="container">
          <div className="product-detail">
            {/* Ürün Görselleri */}
            <div className="product-gallery">
              <div className="product-thumbnails">
                {product.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`product-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.alt || product.name}
                      className="product-thumbnail-image"
                    />
                  </div>
                ))}
              </div>
              
              <div className="product-image-main">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[selectedImage]?.url} 
                    alt={product.images[selectedImage]?.alt || product.name}
                    className="product-image-large"
                  />
                ) : (
                  <img 
                    src={`https://placehold.co/800x1100/000000/FFFFFF/png?text=DOVL`}
                    alt={product.name}
                    className="product-image-large"
                  />
                )}
                
                {product.isNew && (
                  <span className="product-badge product-badge-new">YENİ</span>
                )}
                
                {product.salePrice && (
                  <span className="product-badge product-badge-sale">
                    %{Math.round((1 - product.salePrice / product.price) * 100)}
                  </span>
                )}
              </div>
            </div>
            
            {/* Ürün Bilgileri */}
            <div className="product-info">
              {/* Ekmek Kırıntısı */}
              <div className="product-breadcrumb">
                <Link href="/" className="breadcrumb-link">Ana Sayfa</Link>
                <span className="breadcrumb-separator">/</span>
                {product.category_details ? (
                  <Link href={`/kategori/${product.category_details.slug}`} className="breadcrumb-link">
                    {product.category_details.name}
                  </Link>
                ) : (
                  <Link href={`/kategori/${product.category}`} className="breadcrumb-link">
                    Kategori
                  </Link>
                )}
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{product.name}</span>
              </div>
              
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-pricing">
                {product.salePrice ? (
                  <>
                    <span className="product-price-original">{product.price.toFixed(2)}TL</span>
                    <span className="product-price-current">{product.salePrice.toFixed(2)}TL</span>
                  </>
                ) : (
                  <span className="product-price-current">{product.price.toFixed(2)}TL</span>
                )}
              </div>
              
              {/* Renk Seçenekleri - API'den uygun şekilde gelmediği için şimdilik varsayılan renkle devam */}
              <div className="product-option">
                <h3 className="option-title">Renk: <span className="selected-option">
                  {selectedVariant?.colorName || "Standart"}
                </span></h3>
                <div className="color-options">
                  {Array.from(new Set(product.variants.map(v => v.colorName))).map(color => {
                    const colorVariant = product.variants.find(v => v.colorName === color);
                    const isSelected = colorVariant?.colorName === selectedVariant?.colorName;
                    
                    return (
                      <div 
                        key={color}
                        className={`color-option ${isSelected ? 'selected' : ''}`}
                        title={color}
                      >
                        <span 
                          className="color-swatch" 
                          style={{ 
                            backgroundColor: colorVariant?.colorHex || '#000000',
                            border: color === 'Beyaz' ? '1px solid #e0e0e0' : 'none'
                          }} 
                        ></span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Beden Seçenekleri */}
              <div className="product-option">
                <div className="option-header">
                  <h3 className="option-title">Beden</h3>
                  <button className="size-guide-button" onClick={toggleSizeGuide}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                    Beden Kılavuzu
                  </button>
                </div>
                
                <div className="size-options">
                  {product.variants.map(variant => {
                    const isSelected = selectedSize === variant.size;
                    const isDisabled = variant.stock <= 0;
                    
                    return (
                      <button 
                        key={variant.sku}
                        className={`size-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                        onClick={() => !isDisabled && setSelectedSize(variant.size)}
                        disabled={isDisabled}
                        style={isDisabled ? {opacity: 0.5, cursor: 'not-allowed'} : {}}
                      >
                        {variant.size}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Mesaj Alanı */}
              {cartMessage.message && (
                <div className={`message-container ${cartMessage.type}`} style={{
                  padding: '10px 15px',
                  marginBottom: '15px',
                  borderRadius: '4px',
                  backgroundColor: cartMessage.type === 'error' ? '#ffebee' : 
                                 cartMessage.type === 'success' ? '#e8f5e9' : 
                                 cartMessage.type === 'info' ? '#e3f2fd' : 'transparent',
                  color: cartMessage.type === 'error' ? '#b71c1c' : 
                         cartMessage.type === 'success' ? '#1b5e20' : 
                         cartMessage.type === 'info' ? '#0d47a1' : 'inherit',
                  border: cartMessage.type === 'error' ? '1px solid #ef9a9a' : 
                          cartMessage.type === 'success' ? '1px solid #a5d6a7' : 
                          cartMessage.type === 'info' ? '1px solid #90caf9' : 'none'
                }}>
                  {cartMessage.message}
                </div>
              )}
              
              {/* Adet Seçimi ve Sepete Ekle */}
              <div className="product-actions">
                <div className="quantity-selector">
                  <button 
                    className="quantity-button" 
                    onClick={decreaseQuantity}
                    disabled={selectedQuantity <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={selectedQuantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0 && value <= stockLevel) {
                        setSelectedQuantity(value);
                      }
                    }}
                    min="1"
                    max={stockLevel}
                  />
<button 
                   className="quantity-button" 
                   onClick={increaseQuantity}
                   disabled={selectedQuantity >= stockLevel}
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                   </svg>
                 </button>
               </div>
               
               <button 
                 className="add-to-cart-button" 
                 onClick={handleAddToCart}
                 disabled={cartLoading || stockLevel <= 0}
               >
                 {cartLoading ? 'EKLENİYOR...' : stockLevel <= 0 ? 'STOKTA YOK' : 'SEPETE EKLE'}
               </button>
               
               <button className="wishlist-button" onClick={addToWishlist}>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
               </button>
             </div>
             
             {/* Stok Durumu */}
             <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: stockLevel > 0 ? '#4caf50' : '#f44336' }}>
               {stockLevel > 0 ? `Stok: ${stockLevel} adet` : 'Stokta yok'}
             </div>
             
             {/* Ürün Detay Sekmeleri */}
             <div className="product-tabs">
               <div className="tabs-header">
                 <button 
                   className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                   onClick={() => setActiveTab('description')}
                 >
                   Ürün Açıklaması
                 </button>
                 <button 
                   className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                   onClick={() => setActiveTab('details')}
                 >
                   Ürün Detayları
                 </button>
                 <button 
                   className={`tab-button ${activeTab === 'care' ? 'active' : ''}`}
                   onClick={() => setActiveTab('care')}
                 >
                   Bakım Bilgileri
                 </button>
               </div>
               
               <div className="tabs-content">
                 <div className={`tab-panel ${activeTab === 'description' ? 'active' : ''}`}>
                   <p>{product.description}</p>
                   {product.richDescription && <p>{product.richDescription}</p>}
                 </div>
                 
                 <div className={`tab-panel ${activeTab === 'details' ? 'active' : ''}`}>
                   <ul className="details-list">
                     {product.attributes ? (
                       Object.entries(product.attributes).map(([key, value], index) => (
                         <li key={index} className="detail-item">{key}: {value}</li>
                       ))
                     ) : (
                       <>
                         <li className="detail-item">Yüksek kaliteli premium kumaş</li>
                         <li className="detail-item">Çevre dostu üretim</li>
                         <li className="detail-item">Nefes alabilen yapı</li>
                         <li className="detail-item">Uzun ömürlü dayanıklılık</li>
                       </>
                     )}
                   </ul>
                 </div>
                 
                 <div className={`tab-panel ${activeTab === 'care' ? 'active' : ''}`}>
                   <ul className="care-list">
                     <li className="care-item">Malzeme: %100 Pamuk</li>
                     <li className="care-item">Soğuk suda yıkayınız</li>
                     <li className="care-item">Düşük ısıda ütüleyiniz</li>
                     <li className="care-item">Kuru temizleme yapılmaz</li>
                     <li className="care-item">Çamaşır suyu kullanmayınız</li>
                   </ul>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>
     
     {/* Beden Kılavuzu Modal */}
     {showSizeGuide && (
       <div className="size-guide-modal" onClick={toggleSizeGuide}>
         <div className="size-guide-content" onClick={(e) => e.stopPropagation()}>
           <button className="size-guide-close" onClick={toggleSizeGuide}>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
           <h2 className="size-guide-title">Beden Kılavuzu</h2>
           <div className="size-guide-table-container">
             <table className="size-guide-table">
               <thead>
                 <tr>
                   <th>Beden</th>
                   <th>Göğüs (cm)</th>
                   <th>Bel (cm)</th>
                   <th>Kalça (cm)</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td>XS</td>
                   <td>82-85</td>
                   <td>60-63</td>
                   <td>87-90</td>
                 </tr>
                 <tr>
                   <td>S</td>
                   <td>86-89</td>
                   <td>64-67</td>
                   <td>91-94</td>
                 </tr>
                 <tr>
                   <td>M</td>
                   <td>90-93</td>
                   <td>68-71</td>
                   <td>95-98</td>
                 </tr>
                 <tr>
                   <td>L</td>
                   <td>94-97</td>
                   <td>72-75</td>
                   <td>99-102</td>
                 </tr>
                 <tr>
                   <td>XL</td>
                   <td>98-101</td>
                   <td>76-79</td>
                   <td>103-106</td>
                 </tr>
               </tbody>
             </table>
           </div>
           <div className="size-guide-notes">
             <p>Not: Beden ölçüleri yaklaşık değerlerdir ve ürünün modeline göre değişiklik gösterebilir.</p>
           </div>
         </div>
       </div>
     )}
     
     {/* Benzer Ürünler - Bu kısmı daha sonra API'den gelen benzer ürünlerle dolduracağız */}
     <section className="section similar-products-section">
       <div className="container">
         <h2 className="section-title">BENZER ÜRÜNLER</h2>
         
         <div className="products-grid">
           {Array.from({ length: 4 }).map((_, index) => (
             <Link 
               key={index} 
               href={`/urunler/similar-${index + 1}`}
               className="product"
             >
               <div className="product-image-container">
                 <img 
                   src={`https://placehold.co/800x1100/${['000000', 'FFFFFF', 'F5F5DC', '8B0000'][index]}/FFFFFF/png?text=DOVL`}
                   alt="Benzer Ürün"
                   className="product-image"
                 />
                 
                 <div className="product-tags">
                   {index % 2 === 0 && (
                     <span className="product-tag product-tag-discount">
                       %30
                     </span>
                   )}
                   
                   {index % 3 === 0 && (
                     <span className="product-tag product-tag-new">
                       YENİ
                     </span>
                   )}
                 </div>
                 
                 <div className="product-quick-view">
                   HIZLI İNCELE
                 </div>
               </div>
               
               <h3 className="product-name">Benzer {product.name} Ürün {index + 1}</h3>
               
               <div className="product-price">
                 {index % 2 === 0 ? (
                   <>
                     <span className="product-price-original">899.90TL</span>
                     <span className="product-price-current">629.90TL</span>
                   </>
                 ) : (
                   <span className="product-price-current">799.90TL</span>
                 )}
               </div>
             </Link>
           ))}
         </div>
       </div>
     </section>
   </main>
 );
}