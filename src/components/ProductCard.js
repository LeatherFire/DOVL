"use client";
import { useState } from "react";
import Link from "next/link";
import HoverQuickViewWrapper from "./HoverQuickViewWrapper";

const ProductCard = ({ product, onQuickView }) => {
  if (!product) return null;

  // Ürünün indirim yüzdesini hesaplama
  const calculateDiscountPercentage = () => {
    if (product.salePrice && product.price) {
      return Math.round((1 - product.salePrice / product.price) * 100);
    }
    return 0;
  };

  // Ana ürün görselini alma
  const getMainImage = () => {
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      // URL doğrudan bir string olarak geldiyse
      if (typeof firstImage === 'string') {
        return firstImage;
      }
      // URL bir nesne içindeyse (örn: {url: '...'})
      if (typeof firstImage === 'object' && firstImage !== null) {
        return firstImage.url || firstImage.src || firstImage.path || '';
      }
    }
    return "https://placehold.co/800x1100/000000/FFFFFF/png?text=DOVL";
  };

  return (
    <HoverQuickViewWrapper product={product}>
      <div className="product-card-container">
        <Link href={`/urunler/${product.slug || product.id || product._id}`} className="product">
          <div className="product-image-container">
            <img
              src={getMainImage()}
              alt={product.name}
              className="product-image"
            />

            <div className="product-tags">
              {product.salePrice && (
                <span className="product-tag product-tag-discount">
                  {calculateDiscountPercentage()}%
                </span>
              )}

              {product.isNew && (
                <span className="product-tag product-tag-new">
                  YENİ
                </span>
              )}
            </div>
            
            <div 
              className="product-quick-view"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onQuickView) onQuickView(product, e);
              }}
            >
              HIZLI İNCELE
            </div>
          </div>

          <h3 className="product-name">{product.name}</h3>

          <div className="product-price">
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
        </Link>
      </div>
    </HoverQuickViewWrapper>
  );
};

export default ProductCard; 