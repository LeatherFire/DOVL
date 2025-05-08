"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../utils/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    phone: ''
  });
  const [confirmPassword, setConfirmPassword] = useState('');
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
    
    // Şifre kontrolü
    if (formData.password !== confirmPassword) {
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
      await registerUser(formData);
      
      // Başarılı kayıt sonrası giriş sayfasına yönlendir
      router.push('/giris?message=register_success');
    } catch (error) {
      console.error("Kayıt hatası:", error);
      setError(error.message || 'Kayıt olurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="section">
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 className="page-title">HESAP OLUŞTUR</h1>
        
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
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Ad</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="surname" className="form-label">Soyad</label>
              <input
                type="text"
                id="surname"
                name="surname"
                className="form-input"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
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
            <label htmlFor="phone" className="form-label">Telefon</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              placeholder="5XX XXX XX XX"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">Şifre</label>
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
              <label htmlFor="confirmPassword" className="form-label">Şifre Tekrar</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength="6"
                required
              />
            </div>
          </div>
          
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-checkbox">
              <input
                type="checkbox"
                required
              />
              <span className="checkbox-text">
                <Link href="/kosullar" className="terms-link" target="_blank">Üyelik Koşulları</Link>'nı ve 
                <Link href="/gizlilik" className="terms-link" target="_blank"> Gizlilik Politikası</Link>'nı okudum ve kabul ediyorum.
              </span>
            </label>
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
            {isLoading ? 'KAYIT YAPILIYOR...' : 'KAYIT OL'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center' }}>
          <p>Zaten bir hesabınız var mı?</p>
          <Link href="/giris" className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
            GİRİŞ YAP
          </Link>
        </div>
      </div>
    </main>
  );
}