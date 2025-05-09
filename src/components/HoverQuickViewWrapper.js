"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import HoverQuickView from "./HoverQuickView";
import { motion, AnimatePresence } from "framer-motion";

// Backdrop animasyon ayarları
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const HoverQuickViewWrapper = ({ children, product, className = "" }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [portalElement, setPortalElement] = useState(null);
  const timeoutRef = useRef(null);
  const wrapperRef = useRef(null);
  const quickViewRef = useRef(null);

  // Portal element'ini oluştur
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setPortalElement(document.body);
    }
  }, []);

  // Beden sayfayla birlikte scroll etmeyi engelle
  useEffect(() => {
    if (!portalElement) return;
    
    if (showQuickView) {
      document.body.style.overflow = 'hidden';
      
      // Mevcut "modal-root" elementini kontrol et, yoksa oluştur
      let modalRoot = document.getElementById('modal-root');
      if (!modalRoot) {
        modalRoot = document.createElement('div');
        modalRoot.id = 'modal-root';
        document.body.appendChild(modalRoot);
      }
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showQuickView, portalElement]);

  // Quick view modalı dışına tıklandığında kapatma
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showQuickView &&
        quickViewRef.current &&
        !quickViewRef.current.contains(event.target)
      ) {
        setShowQuickView(false);
      }
    };

    // Mouse quick view butonuna girdiğinde 
    const handleQuickViewButtonMouseEnter = (e) => {
      setHovered(true);
      // Mevcut timeout'u temizle
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Yeni timeout oluştur
      timeoutRef.current = setTimeout(() => {
        setShowQuickView(true);
      }, 1000); // 1 saniye bekle
    };

    // Mouse quick view butonundan çıktığında
    const handleQuickViewButtonMouseLeave = () => {
      setHovered(false);
      // Timeout'u temizle
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    // Quick View butonuna tıklandığında
    const handleQuickViewButtonClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Timeout'u temizle
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setShowQuickView(true);
    };

    // Quick view butonunu bul ve event listener'ları ekle
    const quickViewButton = wrapperRef.current?.querySelector('.product-quick-view');
    if (quickViewButton) {
      quickViewButton.addEventListener('mouseenter', handleQuickViewButtonMouseEnter);
      quickViewButton.addEventListener('mouseleave', handleQuickViewButtonMouseLeave);
      quickViewButton.addEventListener('click', handleQuickViewButtonClick);
    }
    
    // Click event listener'ı ekle
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (quickViewButton) {
        quickViewButton.removeEventListener('mouseenter', handleQuickViewButtonMouseEnter);
        quickViewButton.removeEventListener('mouseleave', handleQuickViewButtonMouseLeave);
        quickViewButton.removeEventListener('click', handleQuickViewButtonClick);
      }
      
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showQuickView]);

  // Popup'ı kapat
  const handleCloseQuickView = () => {
    setShowQuickView(false);
  };

  return (
    <div 
      className={`hover-quick-view-wrapper ${className} ${hovered ? 'hovered' : ''}`}
      ref={wrapperRef}
    >
      {children}
      
      {portalElement && createPortal(
        <AnimatePresence>
          {showQuickView && (
            <motion.div 
              className="global-overlay"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{zIndex: 9990}}
            >
              <motion.div 
                className="quick-view-overlay" 
                style={{zIndex: 9999}}
              >
                <div ref={quickViewRef} className="quick-view-container">
                  <HoverQuickView product={product} onClose={handleCloseQuickView} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        portalElement
      )}

      <style jsx global>{`
        .hover-quick-view-wrapper {
          position: relative;
        }
        
        .global-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9990;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
        }
        
        .quick-view-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px 0;
          overflow-y: auto;
          overflow-x: hidden;
        }
        
        .quick-view-container {
          max-width: 98%;
          width: 98%;
          max-height: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        
        @media (max-width: 768px) {
          .quick-view-overlay {
            padding: 20px 0;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default HoverQuickViewWrapper; 