"use client";
import { useState } from 'react';

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simüle edilmiş form gönderme işlemi
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus({
        success: true,
        message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
      });
      
      // Formu sıfırla
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Status mesajını 5 saniye sonra sil
      setTimeout(() => {
        setSubmitStatus({ success: false, message: '' });
      }, 5000);
    }, 1500);
  };
  
  return (
    <main className="section">
      <div className="container" style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: '4rem 1rem' 
      }}>
        <h1 className="page-title">İLETİŞİM</h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          <div>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 500, 
              marginBottom: '1.5rem'
            }}>BİZE ULAŞIN</h2>
            
            <div className="contact-items">
              <div className="contact-item" style={{ marginBottom: '1.5rem' }}>
                <div className="contact-icon" style={{ 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.75rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span style={{ fontWeight: 500 }}>Adres</span>
                </div>
                <div className="contact-text" style={{ lineHeight: 1.6 }}>
                  Atatürk Mah. İnönü Cad. No:123,<br />
                  Merkez / İstanbul
                </div>
              </div>
              
              <div className="contact-item" style={{ marginBottom: '1.5rem' }}>
                <div className="contact-icon" style={{ 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.75rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span style={{ fontWeight: 500 }}>E-posta</span>
                </div>
                <div className="contact-text" style={{ lineHeight: 1.6 }}>
                  <a href="mailto:info@dovl.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                    info@dovl.com
                  </a>
                </div>
              </div>
              
              <div className="contact-item" style={{ marginBottom: '1.5rem' }}>
                <div className="contact-icon" style={{ 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.75rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span style={{ fontWeight: 500 }}>Telefon</span>
                </div>
                <div className="contact-text" style={{ lineHeight: 1.6 }}>
                  <a href="tel:+902121234567" style={{ color: 'inherit', textDecoration: 'none' }}>
                    +90 212 123 45 67
                  </a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon" style={{ 
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.75rem' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span style={{ fontWeight: 500 }}>Çalışma Saatleri</span>
                </div>
                <div className="contact-text" style={{ lineHeight: 1.6 }}>
                  Pazartesi - Cumartesi: 09:00 - 18:00<br />
                  Pazar: Kapalı
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 500, 
                marginBottom: '1rem'
              }}>BİZİ TAKİP EDİN</h3>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" className="social-icon" style={{ 
                  width: '2.5rem', 
                  height: '2.5rem',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                
                <a href="#" className="social-icon" style={{ 
                  width: '2.5rem', 
                  height: '2.5rem',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                
                <a href="#" className="social-icon" style={{ 
                  width: '2.5rem', 
                  height: '2.5rem',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                
                <a href="#" className="social-icon" style={{ 
                  width: '2.5rem', 
                  height: '2.5rem',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem' }}>
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 500, 
              marginBottom: '1.5rem'
            }}>BİZE YAZIN</h2>
            
            {submitStatus.message && (
              <div style={{ 
                backgroundColor: submitStatus.success ? '#e8f5e9' : '#ffebee', 
                color: submitStatus.success ? '#2e7d32' : '#b71c1c', 
                padding: '1rem', 
                borderRadius: '4px',
                marginBottom: '1.5rem' 
              }}>
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="name" className="form-label" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontSize: '0.9rem'
                }}>
                  Adınız Soyadınız
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '2px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="email" className="form-label" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontSize: '0.9rem'
                }}>
                  E-posta Adresiniz
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '2px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="subject" className="form-label" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontSize: '0.9rem'
                }}>
                  Konu
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '2px',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                  required
                />
              </div>
              
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="message" className="form-label" style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontSize: '0.9rem'
                }}>
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-textarea"
                  style={{ 
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '2px',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    minHeight: '120px',
                    resize: 'vertical'
                  }}
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn" 
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-white)',
                  padding: '0.75rem 2rem',
                  borderRadius: '2px',
                  border: 'none',
                  fontWeight: 500,
                  fontSize: '0.9rem',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  width: '100%'
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'GÖNDERİLİYOR...' : 'GÖNDER'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Harita bölümü */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 500, 
            marginBottom: '1.5rem'
          }}>MAĞAZAMIZ</h2>
          
          <div className="map-container" style={{ 
            width: '100%',
            height: '400px',
            backgroundColor: '#f5f5f5',
            position: 'relative',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            {/* Harita yerine placeholder görsel */}
            <div style={{ 
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#eee',
              color: '#666',
              fontSize: '1.25rem',
              textAlign: 'center'
            }}>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '3rem', height: '3rem', margin: '0 auto', display: 'block', marginBottom: '1rem', color: '#999' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p>DOVL Mağazası - İstanbul</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: '#777' }}>Atatürk Mah. İnönü Cad. No:123, Merkez / İstanbul</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 