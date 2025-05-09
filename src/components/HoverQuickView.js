"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { addToCart } from '../utils/api';
import { motion } from 'framer-motion';

// Modal için animasyon varyantları
const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.9,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400, 
      damping: 25,
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

const HoverQuickView = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [images, setImages] = useState([]);
  const modalRef = useRef(null);

  // ESC tuşu ile kapatma
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    // Modalı görünür olduktan sonra otomatik focus et
    if (modalRef.current) {
      modalRef.current.focus();
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Ürün görselleri işlemi
  useEffect(() => {
    if (product && product.images) {
      // Resimleri normalize et (farklı formatlara uygun hale getir)
      const normalizedImages = product.images.map(img => {
        if (typeof img === 'string') return { url: img };
        return img;
      });
      setImages(normalizedImages);
    }
  }, [product]);

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

  // Mesajı temizle
  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

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
    clearMessage();
    
    try {
      await addToCart({
        productId: product.id || product._id,
        variantSku: selectedVariant.sku,
        quantity: quantity
      });

      setMessage({ type: "success", text: "Ürün sepetinize eklendi!" });
      
      // Sepet güncellendiğinde cartUpdated event'ini tetikle
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event('cartUpdated'));
      }
      
      // 3 saniye sonra mesajı temizle
      setTimeout(clearMessage, 3000);
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

  if (!product) return null;

  return (
    <motion.div 
      className="hover-quick-view-inner" 
      ref={modalRef}
      tabIndex={-1}
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="hover-quick-view-content">
        <motion.button 
          className="hover-quick-view-close" 
          onClick={onClose} 
          aria-label="Kapat"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
        
        <div className="hover-quick-view-product">
          <motion.div 
            className="hover-quick-view-image"
            variants={contentVariants}
          >
            <motion.img
              src={
                images.length > 0
                  ? images[selectedImage]?.url
                  : "https://placehold.co/400x550/000000/FFFFFF/png?text=DOVL"
              }
              alt={product.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              key={selectedImage} // Resim değiştiğinde animasyonu yeniden çalıştır
            />
            
            {images.length > 1 && (
              <motion.div 
                className="hover-quick-view-thumbnails"
                variants={contentVariants}
              >
                {images.slice(0, 4).map((image, index) => (
                  <motion.div 
                    key={index} 
                    className={`hover-quick-view-thumbnail ${selectedImage === index ? 'active' : ''}`}
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
          
          <motion.div 
            className="hover-quick-view-details"
            variants={contentVariants}
          >
            <motion.h3 
              className="hover-quick-view-name"
              variants={contentVariants}
            >{product.name}</motion.h3>
            
            <motion.div 
              className="hover-quick-view-price"
              variants={contentVariants}
            >
              {product.salePrice ? (
                <>
                  <span className="hover-quick-view-price-original">
                    {product.price.toFixed(2)}TL
                  </span>
                  <span className="hover-quick-view-price-current">
                    {product.salePrice.toFixed(2)}TL
                  </span>
                </>
              ) : (
                <span className="hover-quick-view-price-current">
                  {product.price.toFixed(2)}TL
                </span>
              )}
            </motion.div>
            
            <motion.div 
              className="hover-quick-view-description"
              variants={contentVariants}
            >
              <p>{product.description}</p>
            </motion.div>
            
            {/* Beden Seçimi */}
            {product.variants && product.variants.length > 0 && (
              <motion.div 
                className="hover-quick-view-sizes"
                variants={contentVariants}
              >
                <h4>Beden:</h4>
                <div className="hover-quick-view-size-options">
                  {product.variants.map((variant) => {
                    const isSelected = selectedSize === variant.size;
                    const isDisabled = variant.stock <= 0;

                    return (
                      <motion.button
                        key={variant.sku || variant.size}
                        className={`size-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                        onClick={() => !isDisabled && setSelectedSize(variant.size)}
                        disabled={isDisabled}
                        title={isDisabled ? 'Stokta yok' : ''}
                        whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}}
                        whileTap={!isDisabled ? { scale: 0.95 } : {}}
                        transition={{ duration: 0.2 }}
                      >
                        {variant.size}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
            
            {/* Miktar Seçimi */}
            <motion.div 
              className="hover-quick-view-quantity"
              variants={contentVariants}
            >
              <h4>Adet:</h4>
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
            
            {/* Mesaj Gösterimi */}
            {message.text && (
              <motion.div 
                className={`hover-quick-view-message ${message.type}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {message.text}
              </motion.div>
            )}
            
            <motion.div 
              className="hover-quick-view-actions"
              variants={contentVariants}
            >
              <motion.button 
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedSize}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {addingToCart ? "EKLENİYOR..." : "SEPETE EKLE"}
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link href={`/urunler/${product.slug || product.id || product._id}`} className="view-details-button">
                  ÜRÜN DETAYI
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .hover-quick-view-inner {
          position: relative;
          background: white;
          width: 100%;
          max-width: 1200px;
          border-radius: 12px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          overflow-y: auto;
          overflow-x: hidden;
          z-index: 10000;
          margin: 0 auto;
          max-height: calc(100vh - 100px);
          outline: none;
        }
        
        .hover-quick-view-content {
          padding: 35px 30px;
          width: 100%;
          box-sizing: border-box;
        }
        
        .hover-quick-view-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          cursor: pointer;
          z-index: 10;
          color: #333;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .hover-quick-view-product {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 40px;
          align-items: start;
          width: 100%;
        }
        
        .hover-quick-view-image {
          position: relative;
          width: 100%;
        }
        
        .hover-quick-view-image img {
          width: 100%;
          height: auto;
          border-radius: 8px;
          object-fit: cover;
          max-height: 600px;
        }
        
        .hover-quick-view-thumbnails {
          display: flex;
          gap: 12px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        
        .hover-quick-view-thumbnail {
          width: 70px;
          height: 70px;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }
        
        .hover-quick-view-thumbnail.active {
          border-color: #000;
        }
        
        .hover-quick-view-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .hover-quick-view-details {
          padding: 0;
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .hover-quick-view-name {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 20px;
          word-break: break-word;
        }
        
        .hover-quick-view-price {
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .hover-quick-view-price-original {
          font-size: 20px;
          color: #999;
          text-decoration: line-through;
        }
        
        .hover-quick-view-price-current {
          font-size: 26px;
          font-weight: 600;
          color: #000;
        }
        
        .hover-quick-view-description {
          margin-bottom: 24px;
          color: #666;
          line-height: 1.6;
          word-break: break-word;
          font-size: 16px;
        }
        
        .hover-quick-view-sizes,
        .hover-quick-view-quantity {
          margin-bottom: 24px;
          width: 100%;
        }
        
        .hover-quick-view-sizes h4,
        .hover-quick-view-quantity h4 {
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        
        .hover-quick-view-size-options {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        
        .size-option {
          padding: 10px 18px;
          min-width: 50px;
          text-align: center;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
          font-size: 16px;
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
        }
        
        .quantity-button {
          width: 40px;
          height: 40px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }
        
        .quantity-input {
          width: 60px;
          height: 40px;
          border: 1px solid #ddd;
          text-align: center;
          margin: 0 8px;
          border-radius: 4px;
          font-size: 16px;
        }
        
        .hover-quick-view-message {
          padding: 16px;
          margin-bottom: 24px;
          border-radius: 6px;
          font-weight: 500;
          width: 100%;
          font-size: 15px;
        }
        
        .hover-quick-view-message.error {
          background-color: #fee;
          color: #d00;
          border: 1px solid #fcc;
        }
        
        .hover-quick-view-message.success {
          background-color: #efe;
          color: #080;
          border: 1px solid #cfc;
        }
        
        .hover-quick-view-actions {
          display: flex;
          gap: 15px;
          width: 100%;
        }
        
        .add-to-cart-button {
          flex: 1;
          padding: 16px 20px;
          background-color: #000;
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 500;
          letter-spacing: 1px;
          transition: background-color 0.3s ease;
          border-radius: 4px;
          width: 100%;
          font-size: 16px;
        }
        
        .add-to-cart-button:hover {
          background-color: #222;
        }
        
        .add-to-cart-button:disabled {
          background-color: #999;
          cursor: not-allowed;
        }
        
        .view-details-button {
          flex: 1;
          padding: 16px 20px;
          background-color: white;
          color: #000;
          border: 1px solid #000;
          text-align: center;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          display: block;
          border-radius: 4px;
          width: 100%;
          font-size: 16px;
        }
        
        .view-details-button:hover {
          background-color: #f5f5f5;
        }
        
        @media (max-width: 992px) {
          .hover-quick-view-product {
            gap: 40px;
          }
          
          .hover-quick-view-content {
            padding: 30px;
          }
        }
        
        @media (max-width: 768px) {
          .hover-quick-view-inner {
            width: 95%;
            max-height: 90vh;
            overflow-y: auto;
          }
          
          .hover-quick-view-content {
            padding: 25px 20px;
          }
          
          .hover-quick-view-product {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .hover-quick-view-name {
            font-size: 22px;
          }
          
          .hover-quick-view-price-current {
            font-size: 22px;
          }
          
          .hover-quick-view-actions {
            flex-direction: column;
          }
          
          .add-to-cart-button,
          .view-details-button {
            padding: 14px 20px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default HoverQuickView; 