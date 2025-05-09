"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAddresses, addAddress, updateAddress, removeAddress, setDefaultAddress } from '@/utils/api';
import { ErrorMessage, LoadingSpinner } from '@/components/ErrorHandler';

export default function AdreslerPage() {
  // Temel state'ler
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Adres formu görünürlüğü ve düzenlenen adres
  const [formVisible, setFormVisible] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  
  // Form verileri
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    address: '',
    district: '',
    city: '',
    postalCode: '',
    phone: '',
    isDefaultShipping: false,
    isDefaultBilling: false
  });
  
  const router = useRouter();

  // Adresleri yükle
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Adres listesini getiren fonksiyon
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      
      if (Array.isArray(data)) {
        setAddresses(data);
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error("Adresleri getirirken hata:", error);
      setError(error.message || "Adresler getirilirken bir hata oluştu");
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  // Form girdilerinin değişimini yönet
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Adres silme
  const handleDeleteAddress = async (id) => {
    if (window.confirm('Bu adresi silmek istediğinize emin misiniz?')) {
      try {
        await removeAddress(id);
        await fetchAddresses(); // Adresleri yeniden yükle
        alert("Adres başarıyla silindi");
      } catch (error) {
        console.error("Adres silinirken hata:", error);
        setError(error.message || "Adres silinirken bir hata oluştu");
      }
    }
  };

  // Düzenleme modunu başlat
  const handleEditAddress = (address) => {
    setEditingAddressId(address._id);
    setFormData({
      title: address.title || '',
      name: address.name || '',
      address: address.address || '',
      district: address.district || '',
      city: address.city || '',
      postalCode: address.postalCode || '',
      phone: address.phone || '',
      isDefaultShipping: address.isDefaultShipping || false,
      isDefaultBilling: address.isDefaultBilling || false
    });
    setFormVisible(true);
  };

  // Formu sıfırla ve kapat
  const resetForm = () => {
    setFormData({
      title: '',
      name: '',
      address: '',
      district: '',
      city: '',
      postalCode: '',
      phone: '',
      isDefaultShipping: false,
      isDefaultBilling: false
    });
    setEditingAddressId(null);
    setFormVisible(false);
  };

  // Form gönderimi (ekleme veya güncelleme)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingAddressId) {
        // Adres güncelleme
        await updateAddress(editingAddressId, formData);
        alert('Adres başarıyla güncellendi');
      } else {
        // Yeni adres ekleme
        await addAddress(formData);
        alert('Yeni adres başarıyla eklendi');
      }
      
      // Formu sıfırla ve adresleri yeniden yükle
      resetForm();
      await fetchAddresses();
      
    } catch (error) {
      console.error("Adres kaydedilirken hata:", error);
      setError(error.message || "Adres kaydedilirken bir hata oluştu");
    }
  };

  // Varsayılan adres ayarlama
  const handleSetDefault = async (addressId, type) => {
    try {
      await setDefaultAddress(addressId, type);
      await fetchAddresses();
      alert(`Varsayılan ${type === 'shipping' ? 'teslimat' : 'fatura'} adresi olarak ayarlandı`);
    } catch (error) {
      console.error("Varsayılan adres ayarlanırken hata:", error);
      setError(error.message || "Varsayılan adres ayarlanırken bir hata oluştu");
    }
  };

  // Çıkış işlemi
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/giris');
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
                <Link href="/hesabim/favoriler" className="account-menu-link">
                  Favorilerim
                </Link>
              </li>
              <li className="account-menu-item">
                <Link href="/hesabim/adresler" className="account-menu-link active">
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 className="account-content-title">Adreslerim</h2>
              {!formVisible && (
                <button 
                  className="btn-primary" 
                  onClick={() => setFormVisible(true)}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  + Yeni Adres Ekle
                </button>
              )}
            </div>
            
            {loading ? (
              <LoadingSpinner />
            ) : formVisible ? (
              <div className="address-form-container" style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
                <h3>{editingAddressId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Adres Başlığı <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Örn: Ev Adresi, İş Adresi vb."
                        required
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Ad Soyad <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      Adres <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Cadde, Sokak, Bina No, Daire No"
                      required
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </div>

                  <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        İlçe <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input 
                        type="text" 
                        name="district" 
                        value={formData.district}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        İl <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input 
                        type="text" 
                        name="city" 
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    </div>
                  </div>

                  <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Posta Kodu
                      </label>
                      <input 
                        type="text" 
                        name="postalCode" 
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Telefon <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0555 123 45 67"
                        required
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                          type="checkbox" 
                          name="isDefaultShipping"
                          checked={formData.isDefaultShipping}
                          onChange={handleInputChange}
                          style={{ marginRight: '0.5rem' }}
                        />
                        <span>Bu adresi varsayılan teslimat adresim yap</span>
                      </label>
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                          type="checkbox" 
                          name="isDefaultBilling"
                          checked={formData.isDefaultBilling}
                          onChange={handleInputChange}
                          style={{ marginRight: '0.5rem' }}
                        />
                        <span>Bu adresi varsayılan fatura adresim yap</span>
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      type="submit" 
                      className="btn-primary"
                      style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
                    >
                      {editingAddressId ? 'Adresi Güncelle' : 'Adresi Kaydet'}
                    </button>
                    <button 
                      type="button" 
                      style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: 'none', border: '1px solid #ddd' }}
                      onClick={resetForm}
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
            ) : addresses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <p style={{ marginBottom: '1rem' }}>Henüz kayıtlı adresiniz bulunmamaktadır.</p>
              </div>
            ) : (
              <div className="addresses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {addresses.map(address => (
                  <div key={address._id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1rem', position: 'relative' }}>
                    {address.isDefaultShipping && (
                      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: '#4caf50', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px' }}>
                        Teslimat Adresi
                      </div>
                    )}
                    {address.isDefaultBilling && (
                      <div style={{ position: 'absolute', top: address.isDefaultShipping ? '2rem' : '0.5rem', right: '0.5rem', backgroundColor: '#2196f3', color: 'white', padding: '0.25rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px' }}>
                        Fatura Adresi
                      </div>
                    )}
                    
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{address.title}</h3>
                    <div style={{ marginBottom: '1rem' }}>
                      <p>{address.name}</p>
                      <p>{address.address}</p>
                      <p>{address.district} / {address.city}</p>
                      {address.postalCode && <p>{address.postalCode}</p>}
                      <p>{address.phone}</p>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {!address.isDefaultShipping && (
                        <button 
                          onClick={() => handleSetDefault(address._id, 'shipping')}
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Teslimat Adresi Yap
                        </button>
                      )}
                      {!address.isDefaultBilling && (
                        <button 
                          onClick={() => handleSetDefault(address._id, 'billing')}
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Fatura Adresi Yap
                        </button>
                      )}
                      <button 
                        onClick={() => handleEditAddress(address)}
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#f9a825', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Düzenle
                      </button>
                      <button 
                        onClick={() => handleDeleteAddress(address._id)}
                        style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Sil
                      </button>
                    </div>
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