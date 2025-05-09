"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCart, createOrder } from '../../utils/api';

export default function OdemePage() {
  return (
    <main className="section">
      <div className="container" style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        padding: '4rem 1rem' 
      }}>
        <h1 className="page-title">ÖDEME SEÇENEKLERİ</h1>
        
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          maxWidth: '700px',
          margin: '0 auto 3rem',
          lineHeight: 1.7
        }}>
          DOVL olarak size güvenli ve kolay ödeme seçenekleri sunuyoruz. İhtiyaçlarınıza en uygun ödeme yöntemini seçerek, alışverişinizi güvenle tamamlayabilirsiniz.
        </p>
        
        <div className="payment-methods" style={{ marginBottom: '4rem' }}>
          <div className="payment-method" style={{ 
            marginBottom: '2.5rem',
            padding: '1.5rem',
            border: '1px solid #eee',
            borderRadius: '4px'
          }}>
            <div className="payment-method-header" style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div className="payment-method-icon" style={{ 
                width: '3rem',
                height: '3rem',
                backgroundColor: 'var(--color-primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 500
              }}>KREDİ/BANKA KARTI</h2>
            </div>
            
            <div className="payment-method-content" style={{ lineHeight: 1.7 }}>
              <p style={{ marginBottom: '1rem' }}>
                Visa, Mastercard, American Express ve Troy logolu tüm kredi ve banka kartları ile güvenli ödeme yapabilirsiniz. Ödemeleriniz, uluslararası güvenlik standartlarına uygun olarak 3D Secure sistemi ile korunmaktadır.
              </p>
              
              <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                Taksit Seçenekleri
              </h3>
              
              <p style={{ marginBottom: '1rem' }}>
                Aşağıdaki bankaların kredi kartları ile taksitli alışveriş yapabilirsiniz:
              </p>
              
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Yapı Kredi Bankası - 3, 6, 9 taksit</li>
                <li style={{ marginBottom: '0.5rem' }}>İş Bankası - 3, 6, 9 taksit</li>
                <li style={{ marginBottom: '0.5rem' }}>Garanti Bankası - 3, 6, 9 taksit</li>
                <li style={{ marginBottom: '0.5rem' }}>Akbank - 3, 6, 9 taksit</li>
                <li style={{ marginBottom: '0.5rem' }}>QNB Finansbank - 3, 6 taksit</li>
                <li>Ziraat Bankası - 3, 6 taksit</li>
              </ul>
              
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                * Taksit seçenekleri bankaların kampanyalarına göre değişiklik gösterebilir.
              </p>
            </div>
          </div>
          
          <div className="payment-method" style={{ 
            marginBottom: '2.5rem',
            padding: '1.5rem',
            border: '1px solid #eee',
            borderRadius: '4px'
          }}>
            <div className="payment-method-header" style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div className="payment-method-icon" style={{ 
                width: '3rem',
                height: '3rem',
                backgroundColor: 'var(--color-primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 500
              }}>HAVALE/EFT</h2>
            </div>
            
            <div className="payment-method-content" style={{ lineHeight: 1.7 }}>
              <p style={{ marginBottom: '1rem' }}>
                Banka hesaplarımıza havale veya EFT yoluyla ödeme yapabilirsiniz. Ödemeniz onaylandıktan sonra siparişiniz hazırlanmaya başlanacaktır.
              </p>
              
              <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                Banka Hesap Bilgilerimiz
              </h3>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{ padding: '1rem', backgroundColor: '#f8f8f8', borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>Garanti Bankası</h4>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Hesap Sahibi: DOVL Tekstil A.Ş.</p>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>IBAN: TR12 3456 7890 1234 5678 9012 34</p>
                </div>
                
                <div style={{ padding: '1rem', backgroundColor: '#f8f8f8', borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.5rem' }}>İş Bankası</h4>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Hesap Sahibi: DOVL Tekstil A.Ş.</p>
                  <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>IBAN: TR98 7654 3210 9876 5432 1098 76</p>
                </div>
              </div>
              
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                * Havale/EFT ile ödeme yaptıktan sonra, sipariş numaranızı ve ödeme dekontunuzu <a href="mailto:info@dovl.com" style={{ color: 'inherit' }}>info@dovl.com</a> adresine göndermenizi rica ederiz.
              </p>
            </div>
          </div>
          
          <div className="payment-method" style={{ 
            marginBottom: '2.5rem',
            padding: '1.5rem',
            border: '1px solid #eee',
            borderRadius: '4px'
          }}>
            <div className="payment-method-header" style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div className="payment-method-icon" style={{ 
                width: '3rem',
                height: '3rem',
                backgroundColor: 'var(--color-primary)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 500
              }}>KAPIDA ÖDEME</h2>
            </div>
            
            <div className="payment-method-content" style={{ lineHeight: 1.7 }}>
              <p style={{ marginBottom: '1rem' }}>
                Siparişinizi teslim alırken kapıda ödeme yapabilirsiniz. Kapıda ödeme seçeneğinde, +10 TL hizmet bedeli uygulanmaktadır.
              </p>
              
              <h3 style={{ fontSize: '1.1rem', fontWeight: 500, marginTop: '1.5rem', marginBottom: '0.75rem' }}>
                Kapıda Ödeme Seçenekleri
              </h3>
              
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>Kapıda Nakit Ödeme</li>
                <li>Kapıda Kredi Kartı ile Ödeme (Taksit seçeneği bulunmamaktadır)</li>
              </ul>
              
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                * Kapıda ödeme seçeneği, 3.000 TL ve altındaki siparişlerde geçerlidir.
              </p>
            </div>
          </div>
        </div>
        
        {/* Güvenli Ödeme Bilgisi */}
        <div style={{ 
          padding: '2rem',
          backgroundColor: '#f8f8f8',
          borderRadius: '4px',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 500, 
            marginBottom: '1rem'
          }}>GÜVENLİ ÖDEME</h2>
          
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            Tüm ödeme işlemleriniz, SSL sertifikası ile şifrelenerek güvenle gerçekleştirilmektedir. Kişisel bilgileriniz ve kart bilgileriniz, en yüksek güvenlik standartlarında korunmaktadır.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '80px', height: '50px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '0.8rem' }}>Visa</div>
            <div style={{ width: '80px', height: '50px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '0.8rem' }}>Mastercard</div>
            <div style={{ width: '80px', height: '50px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '0.8rem' }}>Amex</div>
            <div style={{ width: '80px', height: '50px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '0.8rem' }}>Troy</div>
            <div style={{ width: '80px', height: '50px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '0.8rem' }}>3D Secure</div>
          </div>
          
          <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
            Ödeme sayfasındaki tüm bilgiler 128-bit SSL sertifikası ile şifrelenmektedir.<br />
            Kredi kartı bilgileriniz kesinlikle saklanmamaktadır.
          </p>
        </div>
        
        {/* Kullanım Koşulları ve Gizlilik Politikası Linkleri */}
        <div style={{ 
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#666'
        }}>
          <p>Siparişinizi tamamlamadan önce lütfen aşağıdaki sayfaları inceleyiniz:</p>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/kosullar" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Kullanım Koşulları</Link>
            <Link href="/gizlilik" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Gizlilik Politikası</Link>
            <Link href="/iade-ve-degisim" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>İade ve Değişim Koşulları</Link>
          </div>
        </div>
        
      </div>
    </main>
  );
}