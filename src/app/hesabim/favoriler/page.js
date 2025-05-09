"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getFavorites, removeFromFavorites, addToCart as apiAddToCart } from '@/utils/api';
import { ErrorMessage, LoadingSpinner, EmptyState } from '@/components/ErrorHandler';

export default function FavorilerPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await getFavorites();
        
        // API'den gelen veri yapısını kontrol edelim
        console.log("Favoriler API yanıtı:", data);
        
        // favorites alanını veya diziyi işle
        if (data && data.favorites && Array.isArray(data.favorites)) {
          // API yanıtı { favorites: [...] } şeklinde ise
          setFavorites(data.favorites);
        } else if (Array.isArray(data)) {
          // API yanıtı direkt dizi şeklinde ise
          setFavorites(data);
        } else {
          // Hiç veri yoksa boş dizi
          setFavorites([]);
        }
      } catch (error) {
        console.error("Favorileri getirirken hata:", error);
        setError(error.message || "Favoriler getirilirken bir hata oluştu");
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (id) => {
    try {
      if (window.confirm('Bu ürünü favorilerinizden çıkarmak istediğinize emin misiniz?')) {
        await removeFromFavorites(id);
        // Favorilerden kaldırılan öğeyi listeden çıkartan
        setFavorites(favorites.filter(item => item.id !== id && item._id !== id));
      }
    } catch (error) {
      console.error("Favorilerden kaldırırken hata:", error);
      setError(error.message || "Favorilerden kaldırırken bir hata oluştu");
    }
  };
  
  const addToCart = async (item) => {
    try {
      // Sepete ekle
      await apiAddToCart({
        productId: item.productId || item.id,
        quantity: 1,
        // Eğer varsa variantSku bilgisini ekle
        ...(item.variantSku && { variantSku: item.variantSku })
      });
      
      alert(`"${item.product?.name || 'Ürün'}" sepete eklendi.`);
      
      // İsteğe bağlı olarak favorilerden kaldırma seçeneği sunulabilir
      const removeFromFavorites = window.confirm(`"${item.product?.name || 'Ürün'}" favorilerinizden kaldırılsın mı?`);
      if (removeFromFavorites) {
        await removeFavorite(item.id || item._id);
      }
    } catch (error) {
      console.error("Sepete eklerken hata:", error);
      setError(error.message || "Sepete eklerken bir hata oluştu");
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/giris');
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/giris');
    }
  };

  return (
    <div className="container">
      <div className="account-page">
        <h1 className="page-title">Hesabım</h1>
        
        {error && <ErrorMessage error={error} />}
        
        <div className="account-container">
          {/* Sidebar */}
          <div className="account-sidebar">
            <h2 className="account-sidebar-title">Hesap Menüsü</h2>
            <ul className="account-menu">
              <li className="account-menu-item">
                <Link href="/hesabim" className="account-menu-link">
                  Hesap Özeti
                </Link>
              </li>
              <li className="account-menu-item">
                <Link href="/hesabim/siparisler" className="account-menu-link">
                  Siparişlerim
                </Link>
              </li>
              <li className="account-menu-item">
                <Link href="/hesabim/favoriler" className="account-menu-link active">
                  Favorilerim
                </Link>
              </li>
              <li className="account-menu-item">
                <Link href="/hesabim/adresler" className="account-menu-link">
                  Adreslerim
                </Link>
              </li>
              <li className="account-menu-item">
                <button 
                  className="account-menu-link" 
                  style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                  onClick={handleLogout}
                >
                  Çıkış Yap
                </button>
              </li>
            </ul>
          </div>
          
          {/* İçerik */}
          <div className="account-content">
            <h2 className="account-content-title">Favorilerim ({favorites.length})</h2>
            
            {loading ? (
              <LoadingSpinner />
            ) : favorites.length === 0 ? (
              <EmptyState 
                message="Favori listenizde henüz bir ürün yok." 
                actionText="Alışverişe Başla" 
                actionLink="/urunler" 
              />
            ) : (
              <div className="favorites-grid">
                {favorites.map((item) => (
                  <div className="favorites-item" key={item.id || item._id}>
                    <button 
                      className="favorites-remove" 
                      onClick={() => removeFavorite(item.id || item._id)}
                      aria-label="Favorilerden kaldır"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                    </button>
                    
                    <Link href={`/urunler/${item.product?.id || item.productId}`} className="favorites-image">
                      <img 
                        src={item.product?.image || '/placeholder-product.jpg'} 
                        alt={item.product?.name || 'Ürün'}
                        width={220}
                        height={293}
                        style={{ objectFit: 'cover' }}
                      />
                    </Link>
                    
                    <Link href={`/urunler/${item.product?.id || item.productId}`} className="favorites-name">
                      {item.product?.name || 'Ürün Adı'}
                    </Link>
                    
                    <div className="favorites-price">
                      {item.product?.salePrice && (
                        <span className="favorites-price-original">{item.product.price?.toFixed(2)}₺</span>
                      )}
                      <span className="favorites-price-current">
                        {item.product?.salePrice?.toFixed(2) || item.product?.price?.toFixed(2) || '0.00'}₺
                      </span>
                    </div>
                    
                    {item.product?.inStock ? (
                      <button 
                        className="favorites-add"
                        onClick={() => addToCart(item)}
                      >
                        Sepete Ekle
                      </button>
                    ) : (
                      <button className="favorites-add" disabled style={{ backgroundColor: '#ccc', cursor: 'default' }}>
                        Stokta Yok
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 