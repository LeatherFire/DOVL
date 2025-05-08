"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '../../utils/api';


export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Token yoksa giriş sayfasına yönlendir
    if (!token) {
      router.push('/giris');
    }
  }, [token, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

// handleSubmit fonksiyonunu güncelle
const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    // Şifre kontrolü
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
  
    // Şifre uzunluğu kontrolü
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      return;
    }
  
    setIsLoading(true);
  
    try {
      await resetPassword(token, formData.password);
      setSuccess(true);
    } catch (error) {
      console.error("Şifre değiştirme hatası:", error);
      setError(error.message || 'Şifre değiştirilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null; // useEffect içinde yönlendirme yapılıyor
  }

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 className="page-title">ŞİFRE SIFIRLAMA</h1>
        
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#b71c1c', 
            padding: '1rem', 
            borderRadius: '4px', 
            marginBottom: '1.5rem' 
          }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ 
            backgroundColor: '#e8f5e9', 
            color: '#1b5e20', 
            padding: '1.5rem', 
            borderRadius: '4px', 
            marginBottom: '1.5rem',
            textAlign: 'center' 
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Şifreniz Başarıyla Değiştirildi</h3>
            <p style={{ marginBottom: '1rem' }}>Yeni şifreniz ile giriş yapabilirsiniz.</p>
            <Link href="/giris" className="btn" style={{ 
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              display: 'inline-block',
              marginTop: '0.5rem'
            }}>
              GİRİŞ YAP
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Lütfen yeni şifrenizi belirleyin.
            </p>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Yeni Şifre</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Yeni Şifre Tekrar</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength="6"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn" 
              style={{ 
                width: '100%', 
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                marginTop: '1.5rem'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'İŞLEM YAPILIYOR...' : 'ŞİFREMİ DEĞİŞTİR'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}