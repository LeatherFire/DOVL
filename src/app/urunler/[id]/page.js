"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  
  // Ürün verisi yükleme simülasyonu
  useEffect(() => {
    const timer = setTimeout(() => {
      // Gerçek projede API çağrısı yapılacak: fetch(`/api/products/${id}`)
      
      // Şimdilik mock veri kullanıyoruz
      const mockProduct = generateMockProduct(id);
      setProduct(mockProduct);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  // Mock ürün verisi oluşturma
  const generateMockProduct = (id) => {
    // Kategorilerin eşleştirilmesi
    const categories = {
      'elbise': { name: 'Elbise', slug: 'elbise' },
      'bluz': { name: 'Bluz', slug: 'bluz' },
      'etek': { name: 'Etek', slug: 'etek' },
      'pantolon': { name: 'Pantolon', slug: 'pantolon' },
      'aksesuar': { name: 'Aksesuar', slug: 'aksesuar' },
      'ceket': { name: 'Ceket', slug: 'ceket' }
    };
    
    // ID'den kategori bilgisini çıkaralım
    const categorySlug = id.split('-')[0];
    const category = categories[categorySlug] || { name: 'Diğer', slug: 'diger' };
    
    // Diğer ürün bilgilerini rastgele oluşturalım
    const colors = ['Siyah', 'Beyaz', 'Kırmızı', 'Mavi', 'Sarı', 'Yeşil', 'Mor', 'Kahverengi'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL'];
    const productTypes = ['Standart', 'Premium', 'Özel', 'Klasik', 'Modern'];
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    const type = productTypes[Math.floor(Math.random() * productTypes.length)];
    const isNew = Math.random() > 0.7;
    const hasDiscount = Math.random() > 0.5;
    const basePrice = Math.floor(Math.random() * 1000) + 300; // 300-1300 TL arası
    const discountRate = hasDiscount ? (Math.floor(Math.random() * 4) + 2) * 10 : 0; // %20, %30, %40, %50 indirimler
    const salePrice = hasDiscount ? Math.round(basePrice * (1 - discountRate / 100)) : null;
    
    // Ürün açıklaması
    const description = `Bu ${color.toLowerCase()} ${type.toLowerCase()} ${category.name.toLowerCase()}, modern tasarımı ve yüksek kaliteli kumaşıyla günlük veya özel kombinlerinize şıklık katacak. Rahat kesimi ve zarif duruşuyla her zaman için mükemmel bir seçim.`;
    
    // Ürün özellikleri
    const details = [
      "Yüksek kaliteli premium kumaş",
      "Çevre dostu üretim",
      "Nefes alabilen yapı",
      "Uzun ömürlü dayanıklılık",
      "Kolay bakım"
    ];
    
    // Renk kodu
    const colorHex = {
      'Siyah': '#000000',
      'Beyaz': '#FFFFFF',
      'Kırmızı': '#FF0000',
      'Mavi': '#0000FF',
      'Sarı': '#FFFF00',
      'Yeşil': '#008000',
      'Mor': '#800080',
      'Kahverengi': '#8B4513'
    }[color] || '#000000';
    
    // Çoklu ürün görselleri oluşturma
    const generateImages = (count) => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        src: `https://placehold.co/1200x1600/${colorHex.replace('#', '')}/${color === 'Beyaz' ? '000000' : 'FFFFFF'}/png?text=DOVL_${i + 1}`,
        alt: `${color} ${category.name} - Görsel ${i + 1}`
      }));
    };
    
    // Benzer ürünler
    const generateSimilarProducts = (count) => {
      return Array.from({ length: count }, (_, i) => {
        const similarColor = colors[Math.floor(Math.random() * colors.length)];
        const similarPrice = Math.floor(Math.random() * 800) + 300;
        const similarDiscount = Math.random() > 0.5;
        const similarSalePrice = similarDiscount ? Math.round(similarPrice * 0.7) : null;
        
        return {
          id: `${category.slug}-similar-${i + 1}`,
          name: `${similarColor} ${productTypes[Math.floor(Math.random() * productTypes.length)]} ${category.name}`,
          price: similarPrice,
          salePrice: similarSalePrice,
          image: `https://placehold.co/800x1100/${similarColor === 'Beyaz' ? 'FFFFFF' : similarColor === 'Siyah' ? '000000' : Math.floor(Math.random()*16777215).toString(16)}/${similarColor === 'Beyaz' ? '000000' : 'FFFFFF'}/png?text=DOVL`,
          isNew: Math.random() > 0.7
        };
      });
    };
    
    return {
      id,
      name: `${color} ${type} ${category.name}`,
      slug: `${color.toLowerCase()}-${type.toLowerCase()}-${category.slug}`,
      price: basePrice,
      salePrice: salePrice,
      images: generateImages(5),
      category: category,
      isNew: isNew,
      color: color,
      colorHex: colorHex,
      availableColors: colors.slice(0, 4), // 4 renk seçeneği
      sizes: sizes,
      selectedSize: '',
      stockLevel: Math.floor(Math.random() * 30) + 1, // 1-30 arası stok
      description: description,
      details: details,
      materialCare: [
        "Malzeme: %100 Pamuk",
        "Soğuk suda yıkayınız",
        "Düşük ısıda ütüleyiniz",
        "Kuru temizleme yapılmaz",
        "Çamaşır suyu kullanmayınız"
      ],
      modelInfo: {
        height: 175 + Math.floor(Math.random() * 10), // 175-184 cm
        size: sizes[Math.floor(Math.random() * sizes.length)]
      },
      similarProducts: generateSimilarProducts(4)
    };
  };
  
  // Boyut kılavuzunu göster/gizle
  const toggleSizeGuide = () => {
    setShowSizeGuide(!showSizeGuide);
  };
  
  // Miktar artırma
  const increaseQuantity = () => {
    if (product && selectedQuantity < product.stockLevel) {
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
  const addToCart = () => {
    if (!selectedSize) {
      alert('Lütfen bir beden seçiniz');
      return;
    }
    
    console.log('Sepete eklendi:', {
      product: product.name,
      size: selectedSize,
      quantity: selectedQuantity,
      price: product.salePrice || product.price
    });
    
    // Gerçek projede sepet state'ine ekleme yapılacak
    alert('Ürün sepetinize eklendi!');
  };
  
  // Favorilere ekleme
  const addToWishlist = () => {
    console.log('Favorilere eklendi:', product.name);
    // Gerçek projede favoriler state'ine ekleme yapılacak
    alert('Ürün favorilerinize eklendi!');
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
                    key={image.id} 
                    className={`product-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="product-thumbnail-image"
                    />
                  </div>
                ))}
              </div>
              
              <div className="product-image-main">
                <img 
                  src={product.images[selectedImage].src} 
                  alt={product.images[selectedImage].alt}
                  className="product-image-large"
                />
                
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
                <Link href={`/kategori/${product.category.slug}`} className="breadcrumb-link">{product.category.name}</Link>
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
              
              {/* Renk Seçenekleri */}
              <div className="product-option">
                <h3 className="option-title">Renk: <span className="selected-option">{product.color}</span></h3>
                <div className="color-options">
                  {product.availableColors.map(color => {
                    const isSelected = color === product.color;
                    
                    return (
                      <div 
                        key={color}
                        className={`color-option ${isSelected ? 'selected' : ''}`}
                        title={color}
                      >
                        <span 
                          className="color-swatch" 
                          style={{ 
                            backgroundColor: {
                              'Siyah': '#000000',
                              'Beyaz': '#FFFFFF',
                              'Kırmızı': '#FF0000',
                              'Mavi': '#0000FF',
                              'Sarı': '#FFFF00',
                              'Yeşil': '#008000',
                              'Mor': '#800080',
                              'Kahverengi': '#8B4513'
                            }[color] || '#000000',
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
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
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
                      if (value > 0 && value <= product.stockLevel) {
                        setSelectedQuantity(value);
                      }
                    }}
                    min="1"
                    max={product.stockLevel}
                  />
                  <button 
                    className="quantity-button" 
                    onClick={increaseQuantity}
                    disabled={selectedQuantity >= product.stockLevel}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                
                <button className="add-to-cart-button" onClick={addToCart}>
                  SEPETE EKLE
                </button>
                
                <button className="wishlist-button" onClick={addToWishlist}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
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
                    <p>Model Bilgisi: {product.modelInfo.height}cm boyunda ve {product.modelInfo.size} beden ürün giymektedir.</p>
                  </div>
                  
                  <div className={`tab-panel ${activeTab === 'details' ? 'active' : ''}`}>
                    <ul className="details-list">
                      {product.details.map((detail, index) => (
                        <li key={index} className="detail-item">{detail}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={`tab-panel ${activeTab === 'care' ? 'active' : ''}`}>
                    <ul className="care-list">
                      {product.materialCare.map((care, index) => (
                        <li key={index} className="care-item">{care}</li>
                      ))}
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
              <p>Not: Beden ölçüleri yaklaşık değerlerdir ve ürünün modelina göre değişiklik gösterebilir.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Benzer Ürünler */}
      <section className="section similar-products-section">
        <div className="container">
          <h2 className="section-title">BENZER ÜRÜNLER</h2>
          
          <div className="products-grid">
            {product.similarProducts.map((similarProduct) => (
              <Link 
                key={similarProduct.id} 
                href={`/urunler/${similarProduct.id}`}
                className="product"
              >
                <div className="product-image-container">
                  <img 
                    src={similarProduct.image}
                    alt={similarProduct.name}
                    className="product-image"
                  />
                  
                  <div className="product-tags">
                    {similarProduct.salePrice && (
                      <span className="product-tag product-tag-discount">
                        {Math.round((1 - similarProduct.salePrice / similarProduct.price) * 100)}%
                      </span>
                    )}
                    
                    {similarProduct.isNew && (
                      <span className="product-tag product-tag-new">
                        YENİ
                      </span>
                    )}
                  </div>
                  
                  <div className="product-quick-view">
                    HIZLI İNCELE
                  </div>
                </div>
                
                <h3 className="product-name">{similarProduct.name}</h3>
                
                <div className="product-price">
                  {similarProduct.salePrice ? (
                    <>
                      <span className="product-price-original">{similarProduct.price.toFixed(2)}TL</span>
                      <span className="product-price-current">{similarProduct.salePrice.toFixed(2)}TL</span>
                    </>
                  ) : (
                    <span className="product-price-current">{similarProduct.price.toFixed(2)}TL</span>
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