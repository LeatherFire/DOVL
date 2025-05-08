"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../utils/api';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginUser(formData);
      
      // Başarılı giriş sonrası kullanıcıyı yönlendir
      const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/hesabim';
      router.push(redirectPath);
    } catch (error) {
      console.error("Giriş hatası:", error);
      setError(error.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 className="page-title">GİRİŞ YAP</h1>
        
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

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Şifre</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div style={{ marginTop: '1rem', marginBottom: '1rem', textAlign: 'right' }}>
            <Link href="/sifremi-unuttum" style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>
              Şifremi Unuttum
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="btn" 
            style={{ 
              width: '100%', 
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              marginTop: '1rem'
            }}
            disabled={isLoading}
          >
            {isLoading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center' }}>
          <p>Henüz hesabınız yok mu?</p>
          <Link href="/kayit" className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
            HEMEN KAYIT OL
          </Link>
        </div>
      </div>
    </main>
  );
}