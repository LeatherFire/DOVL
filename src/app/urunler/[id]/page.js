"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  getProductById,
  getSimilarProducts,
  addToCart,
  addToFavorites,
} from "../../../utils/api";
import HoverQuickViewWrapper from "../../../components/HoverQuickViewWrapper";
import ProductCard from "../../../components/ProductCard";
import "../../../components/product-styles.css";
// Swiper için gerekli importlar
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
// Swiper stilleri
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion, AnimatePresence } from "framer-motion";

// Modal animasyon varyantları
const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

// İçerik animasyonları
const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 } 
  }
};

// QuickViewModal Komponenti
const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Ürün yüklendiğinde varsayılan beden seçimi
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      // Stokta olan ilk bedeni seç
      const availableVariant = product.variants.find(v => v.stock > 0);
      if (availableVariant) {
        setSelectedSize(availableVariant.size);
      }
    }
  }, [product]);

  // Sepete ekleme fonksiyonu
  const handleAddToCart = async () => {
    if (!selectedSize) {
      setMessage({ type: "error", text: "Lütfen bir beden seçiniz" });
      return;
    }

    const selectedVariant = product.variants.find(v => v.size === selectedSize);
    if (!selectedVariant) {
      setMessage({ type: "error", text: "Seçilen beden bulunamadı" });
      return;
    }

    if (selectedVariant.stock < quantity) {
      setMessage({ 
        type: "error", 
        text: `Seçilen miktar için yeterli stok yok. Mevcut stok: ${selectedVariant.stock}` 
      });
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart({
        productId: product.id || product._id,
        variantSku: selectedVariant.sku,
        quantity: quantity
      });

      setMessage({ type: "success", text: "Ürün sepetinize eklendi!" });
      
      // 3 saniye sonra mesajı temizle
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Sepete eklerken hata:", error);
      setMessage({ 
        type: "error", 
        text: error.message || "Sepete eklerken bir hata oluştu" 
      });
    } finally {
      setAddingToCart(false);
    }
  };

  // Modal açık değilse hiçbir şey render etme
  if (!isOpen || !product) return null;

  return (
    <motion.div 
      className="quick-view-modal" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="quick-view-content" 
        onClick={e => e.stopPropagation()}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.button 
          className="quick-view-close" 
          onClick={onClose}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        <div className="quick-view-grid">
          {/* Sol - Ürün Görselleri */}
          <motion.div 
            className="quick-view-images"
            variants={contentVariants}
          >
            <div className="main-image">
              <motion.img 
                src={product.images && product.images.length > 0 
                  ? product.images[selectedImage]?.url 
                  : "https://placehold.co/800x1100/000000/FFFFFF/png?text=DOVL"
                }
                alt={product.name}
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <motion.div 
                className="image-thumbnails"
                variants={contentVariants}
              >
                {product.images.slice(0, 4).map((image, index) => (
                  <motion.div 
                    key={index} 
                    className={`image-thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img src={image.url} alt={`${product.name} - ${index + 1}`} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Sağ - Ürün Bilgileri */}
          <motion.div 
            className="quick-view-details"
            variants={contentVariants}
          >
            <motion.h2 
              className="quick-view-title"
              variants={contentVariants}
            >
              {product.name}
            </motion.h2>
            
            <motion.div 
              className="quick-view-price"
              variants={contentVariants}
            >
              {product.salePrice ? (
                <>
                  <span className="price-original">{product.price.toFixed(2)}TL</span>
                  <span className="price-current">{product.salePrice.toFixed(2)}TL</span>
                </>
              ) : (
                <span className="price-current">{product.price.toFixed(2)}TL</span>
              )}
            </motion.div>

            <motion.div 
              className="quick-view-description"
              variants={contentVariants}
            >
              <p>{product.description}</p>
            </motion.div>

            {/* Beden Seçimi */}
            <motion.div 
              className="quick-view-sizes"
              variants={contentVariants}
            >
              <h3>Beden:</h3>
              <div className="size-options">
                {product.variants && product.variants.map((variant) => {
                  const isSelected = selectedSize === variant.size;
                  const isDisabled = variant.stock <= 0;

                  return (
                    <motion.button
                      key={variant.sku}
                      className={`size-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                      onClick={() => !isDisabled && setSelectedSize(variant.size)}
                      disabled={isDisabled}
                      whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}}
                      whileTap={!isDisabled ? { scale: 0.95 } : {}}
                    >
                      {variant.size}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>

            {/* Miktar Seçimi */}
            <motion.div 
              className="quick-view-quantity"
              variants={contentVariants}
            >
              <h3>Adet:</h3>
              <div className="quantity-selector">
                <motion.button 
                  className="quantity-button"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  whileHover={quantity > 1 ? { scale: 1.1 } : {}}
                  whileTap={quantity > 1 ? { scale: 0.9 } : {}}
                >
                  -
                </motion.button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value > 0) setQuantity(value);
                  }} 
                  min="1"
                  className="quantity-input"
                />
                <motion.button 
                  className="quantity-button"
                  onClick={() => setQuantity(quantity + 1)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  +
                </motion.button>
              </div>
            </motion.div>

            {/* Mesaj Alanı */}
            {message.text && (
              <motion.div 
                className={`quick-view-message ${message.type}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {message.text}
              </motion.div>
            )}

            {/* Sepete Ekle ve Ürün Detayı Butonları */}
            <motion.div 
              className="quick-view-actions"
              variants={contentVariants}
            >
              <motion.button 
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {addingToCart ? "EKLENİYOR..." : "SEPETE EKLE"}
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link 
                  href={`/urunler/${product.slug || product.id}`}
                  className="view-details-button"
                >
                  ÜRÜN DETAYLARI
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [cartLoading, setCartLoading] = useState(false);
  const [cartMessage, setCartMessage] = useState({ type: "", message: "" });

  const [similarProducts, setSimilarProducts] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);
  
  // Hızlı inceleme için state'ler
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedQuickProduct, setSelectedQuickProduct] = useState(null);

  // Ürün verisi yükleme
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);

        // Varsayılan renk seçimi - ilk rengi al
        if (data.variants && data.variants.length > 0) {
          const uniqueColors = Array.from(new Set(data.variants.map(v => v.colorName)));
          if (uniqueColors.length > 0) {
            setSelectedColor(uniqueColors[0]);
            
            // Seçilen renk için stokta olan ilk bedeni seç
            const colorVariants = data.variants.filter(v => v.colorName === uniqueColors[0]);
            if (colorVariants.length > 0) {
              const availableVariant = colorVariants.find(v => v.stock > 0);
              if (availableVariant) {
                setSelectedSize(availableVariant.size);
              } else {
                // Stokta yoksa ilk bedeni seç
                setSelectedSize(colorVariants[0].size);
              }
            }
          }
        }

        // Benzer ürünleri getir
        try {
          const similarData = await getSimilarProducts(id);
          setSimilarProducts(similarData.data || []);
        } catch (similarError) {
          console.error("Benzer ürünler yüklenirken hata:", similarError);
          setSimilarProducts([]);
        } finally {
          setSimilarLoading(false);
        }
      } catch (error) {
        console.error("Ürün yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Renk değiştirildiğinde o renge ait stokta olan ilk bedeni seç
  useEffect(() => {
    if (product && selectedColor) {
      const colorVariants = product.variants.filter(v => v.colorName === selectedColor);
      if (colorVariants.length > 0) {
        const availableVariant = colorVariants.find(v => v.stock > 0);
        if (availableVariant) {
          setSelectedSize(availableVariant.size);
        } else {
          // Stokta yoksa ilk bedeni seç
          setSelectedSize(colorVariants[0].size);
        }
      }
    }
  }, [selectedColor, product]);

  // Renk seçimi fonksiyonu
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Boyut kılavuzunu göster/gizle
  const toggleSizeGuide = () => {
    setShowSizeGuide(!showSizeGuide);
  };

  // Miktar artırma
  const increaseQuantity = () => {
    const selectedVariant = product?.variants?.find(
      (v) => v.size === selectedSize
    );
    const maxStock = selectedVariant?.stock || 0;

    if (selectedQuantity < maxStock) {
      setSelectedQuantity((prev) => prev + 1);
    }
  };

  // Miktar azaltma
  const decreaseQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity((prev) => prev - 1);
    }
  };

  // Sepete ekleme
  const handleAddToCart = async () => {
    if (!selectedSize) {
      setCartMessage({ type: "error", message: "Lütfen bir beden seçiniz" });
      return;
    }

    const selectedVariant = product.variants.find(
      (v) => v.size === selectedSize
    );
    if (!selectedVariant) {
      setCartMessage({ type: "error", message: "Seçilen beden bulunamadı" });
      return;
    }

    if (selectedVariant.stock < selectedQuantity) {
      setCartMessage({
        type: "error",
        message: `Seçilen miktar için yeterli stok yok. Mevcut stok: ${selectedVariant.stock}`,
      });
      return;
    }

    setCartLoading(true);
    try {
      await addToCart({
        productId: product.id || product._id,
        variantSku: selectedVariant.sku,
        quantity: selectedQuantity,
      });

      setCartMessage({ type: "success", message: "Ürün sepetinize eklendi!" });
      
      // Sepet güncellendiğinde cartUpdated event'ini tetikle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event('cartUpdated'));
      }
      
      // Başarı mesajı belirli bir süre sonra kaybolsun
      setTimeout(() => {
        setCartMessage({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Sepete eklerken hata:", error);
      setCartMessage({
        type: "error",
        message: error.message || "Sepete eklerken bir hata oluştu",
      });
    } finally {
      setCartLoading(false);
    }
  };

  // Favorilere ekleme
  const addToWishlist = async () => {
    try {
      setCartMessage({ type: "info", message: "Favorilere ekleniyor..." });
      
      const response = await addToFavorites(product.id || product._id);
      
      setCartMessage({ type: "success", message: "Ürün favorilerinize eklendi!" });
      
      setTimeout(() => {
        setCartMessage({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Favorilere eklerken hata:", error);
      
      // Eğer ürün zaten favorilerde ise
      if (error.message.includes("zaten favorilerinizde")) {
        setCartMessage({
          type: "info",
          message: "Bu ürün zaten favorilerinizde."
        });
      } else {
        setCartMessage({
          type: "error",
          message: error.message || "Favorilere eklerken bir hata oluştu"
        });
      }
      
      setTimeout(() => {
        setCartMessage({ type: "", message: "" });
      }, 3000);
    }
  };

  // Hızlı inceleme modalını açma fonksiyonu
  const openQuickView = (product, e) => {
    if (e) {
      e.preventDefault(); // Link yönlendirmesini engelle
      e.stopPropagation(); // Event'in başka elementlere geçmesini engelle
    }
    setSelectedQuickProduct(product);
    setQuickViewOpen(true);
  };

  // Hızlı inceleme modalını kapatma fonksiyonu
  const closeQuickView = () => {
    setQuickViewOpen(false);
  };

  // Seçili renge göre bedenleri filtrele
  const getFilteredSizes = () => {
    if (!product || !selectedColor) return [];
    
    return product.variants
      .filter(v => v.colorName === selectedColor)
      .sort((a, b) => {
        // Beden sıralaması için yardımcı fonksiyon
        const sizeOrder = { "XS": 1, "S": 2, "M": 3, "L": 4, "XL": 5, "XXL": 6 };
        const aOrder = sizeOrder[a.size] || 999;
        const bOrder = sizeOrder[b.size] || 999;
        return aOrder - bOrder;
      });
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
        <Link href="/urunler" className="btn btn-primary">
          Tüm Ürünlere Dön
        </Link>
      </div>
    );
  }

  // Seçili varyanı bul - renk ve bedene göre
  const selectedVariant = product?.variants?.find(
    (v) => v.size === selectedSize && v.colorName === selectedColor
  );
  const stockLevel = selectedVariant ? selectedVariant.stock : 0;

  // Renk seçimine göre bedenleri filtrele
  const filteredVariants = getFilteredSizes();

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
                    className={`product-thumbnail ${
                      selectedImage === index ? "active" : ""
                    }`}
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
                <Link href="/" className="breadcrumb-link">
                  Ana Sayfa
                </Link>
                <span className="breadcrumb-separator">/</span>
                {product.category_details ? (
                  <Link
                    href={`/kategori/${product.category_details.slug}`}
                    className="breadcrumb-link"
                  >
                    {product.category_details.name}
                  </Link>
                ) : (
                  <Link
                    href={`/kategori/${product.category}`}
                    className="breadcrumb-link"
                  >
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
                    <span className="product-price-original">
                      {product.price.toFixed(2)}TL
                    </span>
                    <span className="product-price-current">
                      {product.salePrice.toFixed(2)}TL
                    </span>
                  </>
                ) : (
                  <span className="product-price-current">
                    {product.price.toFixed(2)}TL
                  </span>
                )}
              </div>

              {/* Renk Seçenekleri */}
              <div className="product-option">
                <div className="option-header">
                  <h3 className="option-title">
                    Renk: 
                    <span className="selected-option">
                      {selectedColor || "Standart"}
                    </span>
                  </h3>
                </div>
                <div className="color-options">
                  {product && Array.from(
                    new Set(product.variants.map((v) => v.colorName))
                  ).map((color) => {
                    const colorVariant = product.variants.find(
                      (v) => v.colorName === color
                    );
                    const isSelected = selectedColor === color;
                    const isWhite = color.toLowerCase() === "beyaz" || 
                                   colorVariant?.colorHex?.toLowerCase() === "#ffffff" || 
                                   colorVariant?.colorHex?.toLowerCase() === "#fff";

                    return (
                      <div
                        key={color}
                        className={`color-option ${
                          isSelected ? "selected" : ""
                        } ${isWhite ? "white-color" : ""}`}
                        onClick={() => handleColorSelect(color)}
                        title={color}
                      >
                        <span
                          className="color-swatch"
                          style={{
                            backgroundColor: colorVariant?.colorHex || "#000000",
                          }}
                        ></span>
                        {isSelected && (
                          <span className="color-selected-indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Beden Seçenekleri */}
              <div className="product-option">
                <div className="option-header">
                  <h3 className="option-title">Beden</h3>
                  <button
                    className="size-guide-button"
                    onClick={toggleSizeGuide}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                    </svg>
                    Beden Kılavuzu
                  </button>
                </div>

                <div className="size-options">
                  {filteredVariants.map((variant) => {
                    const isSelected = selectedSize === variant.size;
                    const isDisabled = variant.stock <= 0;

                    return (
                      <button
                        key={variant.sku}
                        className={`size-option ${
                          isSelected ? "selected" : ""
                        } ${isDisabled ? "disabled" : ""}`}
                        onClick={() =>
                          !isDisabled && setSelectedSize(variant.size)
                        }
                        disabled={isDisabled}
                        style={
                          isDisabled
                            ? { opacity: 0.5, cursor: "not-allowed" }
                            : {}
                        }
                      >
                        {variant.size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mesaj Alanı */}
              {cartMessage.message && (
                <div
                  className={`message-container ${cartMessage.type}`}
                  style={{
                    padding: "10px 15px",
                    marginBottom: "15px",
                    borderRadius: "4px",
                    backgroundColor:
                      cartMessage.type === "error"
                        ? "#ffebee"
                        : cartMessage.type === "success"
                        ? "#e8f5e9"
                        : cartMessage.type === "info"
                        ? "#e3f2fd"
                        : "transparent",
                    color:
                      cartMessage.type === "error"
                        ? "#b71c1c"
                        : cartMessage.type === "success"
                        ? "#1b5e20"
                        : cartMessage.type === "info"
                        ? "#0d47a1"
                        : "inherit",
                    border:
                      cartMessage.type === "error"
                        ? "1px solid #ef9a9a"
                        : cartMessage.type === "success"
                        ? "1px solid #a5d6a7"
                        : cartMessage.type === "info"
                        ? "1px solid #90caf9"
                        : "none",
                  }}
                >
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 12H4"
                      />
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>

                <button
                  className="add-to-cart-button"
                  onClick={handleAddToCart}
                  disabled={cartLoading || stockLevel <= 0}
                >
                  {cartLoading
                    ? "EKLENİYOR..."
                    : stockLevel <= 0
                    ? "STOKTA YOK"
                    : "SEPETE EKLE"}
                </button>

                <button className="wishlist-button" onClick={addToWishlist}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    width="20"
                    height="20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Stok Durumu */}
              <div
                style={{
                  marginTop: "1rem",
                  fontSize: "0.9rem",
                  color: stockLevel > 0 ? "#4caf50" : "#f44336",
                }}
              >
                {stockLevel > 0 ? `Stok: ${stockLevel} adet` : "Stokta yok"}
              </div>

              {/* Ürün Detay Sekmeleri */}
              <div className="product-tabs">
                <div className="tabs-header">
                  <button
                    className={`tab-button ${
                      activeTab === "description" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("description")}
                  >
                    Ürün Açıklaması
                  </button>
                  <button
                    className={`tab-button ${
                      activeTab === "details" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    Ürün Detayları
                  </button>
                  <button
                    className={`tab-button ${
                      activeTab === "care" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("care")}
                  >
                    Bakım Bilgileri
                  </button>
                </div>

                <div className="tabs-content">
                  <div
                    className={`tab-panel ${
                      activeTab === "description" ? "active" : ""
                    }`}
                  >
                    <p>{product.description}</p>
                    {product.richDescription && (
                      <p>{product.richDescription}</p>
                    )}
                  </div>

                  <div
                    className={`tab-panel ${
                      activeTab === "details" ? "active" : ""
                    }`}
                  >
                    <ul className="details-list">
                      {product.attributes ? (
                        Object.entries(product.attributes).map(
                          ([key, value], index) => (
                            <li key={index} className="detail-item">
                              {key}: {value}
                            </li>
                          )
                        )
                      ) : (
                        <>
                          <li className="detail-item">
                            Yüksek kaliteli premium kumaş
                          </li>
                          <li className="detail-item">Çevre dostu üretim</li>
                          <li className="detail-item">Nefes alabilen yapı</li>
                          <li className="detail-item">
                            Uzun ömürlü dayanıklılık
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div
                    className={`tab-panel ${
                      activeTab === "care" ? "active" : ""
                    }`}
                  >
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
          <div
            className="size-guide-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="size-guide-close" onClick={toggleSizeGuide}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="24"
                height="24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
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
              <p>
                Not: Beden ölçüleri yaklaşık değerlerdir ve ürünün modeline göre
                değişiklik gösterebilir.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Benzer Ürünler */}
      <section className="section similar-products-section">
        <div className="container">
          <h2 className="section-title">BENZER ÜRÜNLER</h2>

          {similarLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Benzer ürünler yükleniyor...</p>
            </div>
          ) : similarProducts.length === 0 ? (
            <p style={{ textAlign: "center" }}>Benzer ürün bulunamadı.</p>
          ) : (
            <div className="products-carousel">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 10 },
                  640: { slidesPerView: 2, spaceBetween: 15 },
                  768: { slidesPerView: 3, spaceBetween: 15 },
                  1024: { slidesPerView: 4, spaceBetween: 20 },
                }}
              >
                {similarProducts.map((similarProduct) => (
                  <SwiperSlide key={similarProduct.id || similarProduct._id}>
                    <ProductCard 
                      product={similarProduct} 
                      onQuickView={openQuickView}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </section>

      {/* QuickView Modal */}
      <AnimatePresence>
        {quickViewOpen && selectedQuickProduct && (
          <QuickViewModal
            product={selectedQuickProduct}
            isOpen={quickViewOpen}
            onClose={closeQuickView}
          />
        )}
      </AnimatePresence>

      {/* Hızlı İnceleme stil kuralları */}
      <style jsx global>{`
        .product-card-container {
          position: relative;
          overflow: hidden;
        }
        
        .product-image-container {
          position: relative;
          overflow: hidden;
        }
        
        .product-quick-view {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          text-align: center;
          padding: 10px 0;
          transform: translateY(100%);
          transition: transform 0.3s ease;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 1px;
          z-index: 10;
        }
        
        .product-image-container:hover .product-quick-view {
          transform: translateY(0);
        }
        
        /* Hover davranışını değiştir */
        .product-quick-view:hover {
          background-color: rgba(0, 0, 0, 0.85);
        }
        
        /* Hızlı İnceleme Modal Stilleri */
        .quick-view-modal {
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
          padding: 20px;
        }
        
        .quick-view-content {
          background: white;
          max-width: 1000px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .quick-view-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: transparent;
          border: none;
          cursor: pointer;
          z-index: 10;
        }
        
        .quick-view-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        
        @media (max-width: 768px) {
          .quick-view-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .quick-view-images {
          display: flex;
          flex-direction: column;
        }
        
        .main-image {
          width: 100%;
          margin-bottom: 15px;
        }
        
        .main-image img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        
        .image-thumbnails {
          display: flex;
          gap: 10px;
        }
        
        .image-thumbnail {
          width: 70px;
          height: 70px;
          cursor: pointer;
          border: 2px solid transparent;
        }
        
        .image-thumbnail.active {
          border-color: #333;
        }
        
        .image-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .quick-view-details {
          display: flex;
          flex-direction: column;
        }
        
        .quick-view-title {
          font-size: 24px;
          font-weight: 500;
          margin-bottom: 15px;
        }
        
        .quick-view-price {
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .price-original {
          text-decoration: line-through;
          color: #999;
          margin-right: 10px;
        }
        
        .price-current {
          font-weight: 600;
          color: #000;
        }
        
        .quick-view-description {
          margin-bottom: 20px;
          color: #555;
          line-height: 1.5;
        }
        
        .quick-view-sizes h3,
        .quick-view-quantity h3 {
          margin-bottom: 10px;
          font-size: 16px;
          font-weight: 500;
        }
        
        .size-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .size-option {
          padding: 8px 16px;
          min-width: 45px;
          text-align: center;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 2px;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        .size-option:hover:not(.disabled) {
          border-color: #888;
        }
        
        .size-option.selected {
          border-color: #000;
          background: #000;
          color: white;
        }
        
        .size-option.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          text-decoration: line-through;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .quantity-button {
          width: 35px;
          height: 35px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          font-size: 18px;
          cursor: pointer;
        }
        
        .quantity-input {
          width: 50px;
          height: 35px;
          border: 1px solid #ddd;
          text-align: center;
          margin: 0 5px;
        }
        
        .quick-view-message {
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        
        .quick-view-message.error {
          background-color: #fff0f0;
          color: #e53e3e;
          border: 1px solid #f5b7b7;
        }
        
        .quick-view-message.success {
          background-color: #f0fff4;
          color: #38a169;
          border: 1px solid #b7f5c6;
        }
        
        .quick-view-actions {
          display: flex;
          gap: 15px;
        }
        
        .add-to-cart-button {
          flex: 1;
          padding: 12px 20px;
          background-color: #000;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 500;
          letter-spacing: 1px;
          transition: background-color 0.3s ease;
        }
        
        .add-to-cart-button:hover {
          background-color: #333;
        }
        
        .view-details-button {
          flex: 1;
          padding: 12px 20px;
          background-color: white;
          color: #000;
          border: 1px solid #000;
          text-align: center;
          font-weight: 500;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }
        
        .view-details-button:hover {
          background-color: #f5f5f5;
        }

        .option-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .option-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .selected-option {
          font-weight: 400;
          color: #666;
          padding-left: 5px;
        }
        
        .color-options {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
        }
        
        .color-option {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          padding: 0;
          background-color: #fff;
          border: 2px solid #e5e5e5;
          transition: all 0.2s ease;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }
        
        .color-option.selected {
          border: 2px solid #000;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }
        
        .color-option:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }
        
        .color-swatch {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 0;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          background-size: cover;
          background-position: center;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        
        .color-selected-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          text-shadow: 0 0 2px rgba(0,0,0,0.5);
          filter: drop-shadow(0px 0px 1px rgba(0,0,0,0.3));
        }

        .size-guide-button {
          display: flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          padding: 0;
        }
        
        .size-guide-button:hover {
          color: #000;
          text-decoration: underline;
        }

        .color-option.white-color {
          background: #f9f9f9;
          border: 2px solid #e0e0e0;
        }
        
        .color-option.white-color.selected {
          border: 2px solid #000;
        }
        
        .color-option.white-color .color-selected-indicator {
          color: #000;
          text-shadow: none;
        }

        /* Swiper Carousel Stilleri */
        .products-carousel {
          position: relative;
          margin: 0 -10px 40px;
          padding: 0 10px;
        }
        
        .products-carousel .swiper-button-next,
        .products-carousel .swiper-button-prev {
          color: #000;
          background: rgba(255, 255, 255, 0.8);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .products-carousel .swiper-button-next:after,
        .products-carousel .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }
        
        .products-carousel .swiper-button-disabled {
          opacity: 0.35;
        }
        
        .products-carousel .swiper-pagination {
          bottom: -30px;
        }
        
        .products-carousel .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
        }
        
        .products-carousel .swiper-pagination-bullet-active {
          background: #000;
        }
        
        @media (max-width: 768px) {
          .products-carousel .swiper-button-next,
          .products-carousel .swiper-button-prev {
            width: 30px;
            height: 30px;
          }
          
          .products-carousel .swiper-button-next:after,
          .products-carousel .swiper-button-prev:after {
            font-size: 14px;
          }
        }
      `}</style>
    </main>
  );
}
