"use client";
import { useState } from 'react';
import Link from 'next/link';
import { forgotPassword } from '../../utils/api';


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Şifre sıfırlama hatası:", error);
      setError(error.message || 'Şifre sıfırlama isteği gönderilirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 className="page-title">ŞİFREMİ UNUTTUM</h1>
        
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

        {isSubmitted ? (
          <div style={{ 
            backgroundColor: '#e8f5e9', 
            color: '#1b5e20', 
            padding: '1.5rem', 
            borderRadius: '4px', 
            marginBottom: '1.5rem',
            textAlign: 'center' 
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Şifre Sıfırlama Bağlantısı Gönderildi</h3>
            <p style={{ marginBottom: '1rem' }}>E-posta adresinize şifre sıfırlama bağlantısı gönderdik. Lütfen gelen kutunuzu kontrol edin.</p>
            <Link href="/giris" className="btn" style={{ 
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              display: 'inline-block',
              marginTop: '0.5rem'
            }}>
              GİRİŞ SAYFASINA DÖN
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Şifrenizi sıfırlamak için kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı e-posta adresinize gönderilecektir.
            </p>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">E-posta</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {isLoading ? 'GÖNDERİLİYOR...' : 'ŞİFRE SIFIRLAMA BAĞLANTISI GÖNDER'}
            </button>
            
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link href="/giris" style={{ color: 'var(--color-primary)' }}>
                Giriş sayfasına dön
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}