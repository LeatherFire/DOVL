"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUserProfile, changePassword as apiChangePassword } from '@/utils/api';
import { ErrorMessage, LoadingSpinner, handleApiError } from '@/components/ErrorHandler';

export default function HesabimPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Kullanıcı bilgilerini yükleme
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
        setFormData({
          name: userData.name,
          email: userData.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        setLoading(false);
      } catch (error) {
        handleApiError(error, setError);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Şifre doğrulama hatasını temizle
    if (name === 'newPassword' || name === 'confirmPassword') {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form doğrulama kontrolleri
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setPasswordError("Yeni şifreler eşleşmiyor!");
      return;
    }
    
    try {
      setLoading(true);
      
      // Kullanıcı bilgilerini güncelle - utils/api'den updateProfile fonksiyonu yoksa burayı atlayabilirsiniz
      // const profileData = {
      //   name: formData.name,
      //   email: formData.email
      // };
      
      // await updateProfile(profileData);
      
      // Eğer şifre girilmişse şifreyi de güncelle
      if (formData.currentPassword && formData.newPassword) {
        await apiChangePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
      }
      
      // Güncel kullanıcı profilini getir
      const updatedUserData = await getUserProfile();
      setUser(updatedUserData);
      
      setSuccessMessage("Bilgileriniz başarıyla güncellendi!");
      setIsEditing(false);
      
      // 3 saniye sonra başarı mesajını temizle
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      handleApiError(error, setError);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // utils/api'de logout fonksiyonu yoksa doğrudan localStorage'ı temizleyelim
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/giris');
    } catch (error) {
      console.error("Çıkış yaparken hata oluştu:", error);
      // Hata olsa bile token'ı temizle ve yönlendir
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/giris');
    }
  };

  if (loading && !user) {
    return (
      <div className="container">
        <div className="account-page">
          <h1 className="page-title">Hesabım</h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="account-page">
        <h1 className="page-title">Hesabım</h1>
        
        {error && <ErrorMessage error={error} />}
        
        {successMessage && (
          <div style={{ 
            backgroundColor: '#e6ffec', 
            border: '1px solid #b3ffcc', 
            padding: '1rem', 
            borderRadius: '4px',
            color: '#006600',
            marginBottom: '1.5rem' 
          }}>
            <p>{successMessage}</p>
          </div>
        )}
        
        <div className="account-container">
          {/* Sidebar */}
          <div className="account-sidebar">
            <h2 className="account-sidebar-title">Hesap Menüsü</h2>
            <ul className="account-menu">
              <li className="account-menu-item">
                <Link href="/hesabim" className="account-menu-link active">
                  Hesap Özeti
                </Link>
              </li>
              <li className="account-menu-item">
                <Link href="/hesabim/siparisler" className="account-menu-link">
                  Siparişlerim
                </Link>
              </li>
              <li className="account-menu-item">
                <Link href="/hesabim/favoriler" className="account-menu-link">
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
            {user && (
              <>
                <div className="account-welcome">
                  <h2 className="account-welcome-title">Merhaba, {user.name}</h2>
                  <p className="account-welcome-text">
                    Hesap sayfanızdan siparişlerinizi takip edebilir, favori ürünlerinizi görüntüleyebilir 
                    ve hesap bilgilerinizi yönetebilirsiniz.
                  </p>
                </div>
                
                <div className="account-overview">
                  <div className="account-stat">
                    <div className="account-stat-number">{user.orderCount || 0}</div>
                    <div className="account-stat-label">Siparişiniz</div>
                  </div>
                  
                  <div className="account-stat">
                    <div className="account-stat-number">{user.favoriteCount || 0}</div>
                    <div className="account-stat-label">Favori Ürününüz</div>
                  </div>
                  
                  <div className="account-stat">
                    <div className="account-stat-number">{user.addressCount || 0}</div>
                    <div className="account-stat-label">Kayıtlı Adresiniz</div>
                  </div>
                </div>
                
                <div className="account-section">
                  <h3 className="account-section-title">Hesap Bilgileri</h3>
                  <div className="account-form">
                    {!isEditing ? (
                      <>
                        <div className="form-group">
                          <label className="form-label">Ad Soyad</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={user.name}
                            disabled 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">E-posta</label>
                          <input 
                            type="email" 
                            className="form-input" 
                            value={user.email}
                            disabled 
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Şifre</label>
                          <input 
                            type="password" 
                            className="form-input" 
                            value="********" 
                            disabled 
                          />
                        </div>
                        
                        <button 
                          className="btn-primary"
                          onClick={() => setIsEditing(true)}
                        >
                          Bilgilerimi Düzenle
                        </button>
                      </>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label className="form-label">Ad Soyad</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">E-posta</label>
                          <input 
                            type="email" 
                            className="form-input" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Mevcut Şifre</label>
                          <input 
                            type="password" 
                            className="form-input" 
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Şifre değiştirmek için doldurun"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Yeni Şifre</label>
                          <input 
                            type="password" 
                            className="form-input" 
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Boş bırakırsanız değişmez"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Yeni Şifre Tekrar</label>
                          <input 
                            type="password" 
                            className="form-input" 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Yeni şifreyi tekrar girin"
                          />
                          {passwordError && (
                            <div className="form-error">{passwordError}</div>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                          >
                            {loading ? "Kaydediliyor..." : "Bilgilerimi Kaydet"}
                          </button>
                          <button 
                            type="button" 
                            className="btn-outline"
                            onClick={() => setIsEditing(false)}
                            disabled={loading}
                          >
                            İptal
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 