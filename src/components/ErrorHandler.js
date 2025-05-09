"use client";

import React from 'react';

// Hata mesajı bileşeni
export const ErrorMessage = ({ error }) => {
  // API'den gelen hatayı göster, yoksa genel hata mesajı
  const errorMessage = error?.response?.data?.message || error?.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
  
  return (
    <div style={{ 
      backgroundColor: '#fff0f0', 
      border: '1px solid #ffcccc', 
      padding: '1rem', 
      borderRadius: '4px',
      color: '#cc0000',
      marginBottom: '1.5rem' 
    }}>
      <p>{errorMessage}</p>
    </div>
  );
};

// Sayfa yükleniyor bileşeni
export const LoadingSpinner = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      padding: '2rem 0' 
    }}>
      <div className="loading-spinner"></div>
    </div>
  );
};

// Boş veri durumu bileşeni
export const EmptyState = ({ message, actionText, actionLink, onActionClick }) => {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem 0' 
    }}>
      <p style={{ marginBottom: '1rem' }}>{message}</p>
      {actionText && (
        actionLink ? (
          <a href={actionLink} className="btn-primary" style={{ display: 'inline-block' }}>
            {actionText}
          </a>
        ) : onActionClick ? (
          <button 
            onClick={onActionClick}
            className="btn-primary" 
            style={{ display: 'inline-block', cursor: 'pointer' }}
          >
            {actionText}
          </button>
        ) : null
      )}
    </div>
  );
};

// API isteklerinde try-catch bloğu içindeki hataları işleyen yardımcı fonksiyon
export const handleApiError = (error, setError) => {
  console.error('API hatası:', error);
  setError(error);
  
  // 401 Yetkisiz hata durumunda oturumu sonlandır ve giriş sayfasına yönlendir
  if (error?.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/giris?redirect=' + encodeURIComponent(window.location.pathname);
  }
}; 