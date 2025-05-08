"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

export default function RootLayout({ children }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  
  // Scroll olayını dinleyelim (sticky header için)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menüyü aç/kapat
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) setIsSearchOpen(false);
  };

  // Arama panelini aç/kapat
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) setIsMenuOpen(false);
  };

  return (
    <html lang="tr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300;400;500;600;700&family=Raleway:wght@100;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* Üst bilgi bandı - Kampanya duyurusu */}
        <div className="announcement-bar" style={{ 
          backgroundColor: 'var(--color-primary)', 
          color: 'var(--color-white)', 
          textAlign: 'center', 
          padding: '0.75rem 0',
          overflow: 'hidden' 
        }}>
          <div className="marquee">
            Tüm Siparişlerde Ücretsiz Kargo | İstanbul İçi Aynı Gün Teslimat Fırsatı | %50 İndirim Kampanyası | Tüm Siparişlerde Ücretsiz Kargo | İstanbul İçi Aynı Gün Teslimat Fırsatı | %50 İndirim Kampanyası
          </div>
        </div>

        {/* Header */}
        <header className={`header ${isScrolled || pathname !== '/' ? 'header-white' : 'header-transparent'}`}>
          <div className="container">
            <div className="header-inner">
              {/* Hamburger Menü */}
              <button 
                onClick={toggleMenu}
                className="hamburger"
                aria-label="Menüyü Aç"
                style={{ color: isScrolled || pathname !== '/' ? 'var(--color-primary)' : 'var(--color-white)' }}
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>

              {/* Logo */}
              <Link href="/" className="logo" style={{ 
                color: isScrolled || pathname !== '/' ? 'var(--color-primary)' : 'var(--color-white)',
              }}>
                <div className="logo-main">DOVL</div>
                <div className="logo-sub">FASHION</div>
              </Link>

              {/* Sağ İkonlar */}
              <div className="header-icons" style={{ 
                color: isScrolled || pathname !== '/' ? 'var(--color-primary)' : 'var(--color-white)',
              }}>
                {/* Arama */}
                <button 
                  onClick={toggleSearch}
                  className="header-icon"
                  aria-label="Arama"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* Hesap */}
                <Link 
                  href="/hesabim" 
                  className="header-icon"
                  aria-label="Hesabım"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>

                {/* Favoriler */}
                <Link 
                  href="/hesabim/favoriler" 
                  className="header-icon"
                  aria-label="Favorilerim"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </Link>

                {/* Sepet */}
                <Link 
                  href="/sepet" 
                  className="header-icon"
                  aria-label="Sepetim"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="cart-count">0</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Menü Açılır Panel */}
          <div 
            className={`menu ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <div 
              className="menu-inner"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="menu-items">
                <li className="menu-item">
                  <Link 
                    href="/"
                    className={`menu-link ${pathname === '/' ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ana Sayfa
                  </Link>
                </li>
                <li className="menu-item">
                  <Link 
                    href="/urunler"
                    className={`menu-link ${pathname.startsWith('/urunler') ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tüm Ürünler
                  </Link>
                </li>
                <li className="menu-item">
                  <Link 
                    href="/kategori/elbise"
                    className={`menu-link ${pathname === '/kategori/elbise' ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Elbise
                  </Link>
                </li>
                <li className="menu-item">
                  <Link 
                    href="/kategori/bluz"
                    className={`menu-link ${pathname === '/kategori/bluz' ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Bluz
                  </Link>
                </li>
                <li className="menu-item">
                  <Link 
                    href="/kategori/etek"
                    className={`menu-link ${pathname === '/kategori/etek' ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Etek
                  </Link>
                </li>
                <li className="menu-item">
                  <Link 
                    href="/kategori/pantolon"
                    className={`menu-link ${pathname === '/kategori/pantolon' ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pantolon
                  </Link>
                </li>
                <li className="menu-item">
                  <Link 
                    href="/hakkimizda"
                    className={`menu-link ${pathname === '/hakkimizda' ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hakkımızda
                  </Link>
                </li>
                <li className="menu-item">
                  <Link 
                    href="/iletisim"
                    className={`menu-link ${pathname === '/iletisim' ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    İletişim
                  </Link>
                </li>
              </ul>
              
              <div className="menu-footer">
                <div className="menu-socials">
                  <a href="#" className="menu-social">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                  <a href="#" className="menu-social">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="menu-social">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </a>
                </div>
                
                <p>
                  info@dovl.com<br />
                  +90 212 123 45 67
                </p>
              </div>
            </div>
          </div>

          {/* Arama Açılır Panel */}
          <div 
            className={`search-panel ${isSearchOpen ? 'active' : ''}`}
            onClick={() => setIsSearchOpen(false)}
          >
            <div 
              className="search-content"
              onClick={(e) => e.stopPropagation()}
            >
              <form className="search-form">
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Ne aramıştınız?" 
                  autoFocus={isSearchOpen}
                />
                <button className="search-button" type="submit">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
              
              <div className="search-popular">
                <span>Popüler Aramalar:</span>
                <a href="/kategori/elbise">Elbise</a>
                <a href="/kategori/bluz">Bluz</a>
                <a href="/kategori/etek">Etek</a>
              </div>
            </div>
          </div>
        </header>

        {/* Header için boşluk bırakma (sadece ana sayfa dışındaki sayfalarda) */}
        <div style={{ height: pathname === '/' ? '0' : '6rem' }}></div>

        {/* Ana İçerik */}
        {children}

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              {/* Logo ve Sosyal Medya */}
              <div>
                <div className="footer-logo">DOVL</div>
                <p className="footer-text">Modern, şık ve kaliteli kadın giyim ürünleri. Zamansız tasarımlar ve yüksek kaliteli kumaşlarla sizlere hizmet veriyoruz.</p>
                <div className="footer-socials">
                  <a href="#" className="footer-social">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                  <a href="#" className="footer-social">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="footer-social">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </a>
                  <a href="#" className="footer-social">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </a>
                  <a href="#" className="footer-social">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v21.528l-2.58-2.28-1.452-1.344-1.536-1.428.636 2.22h-13.608c-1.356 0-2.46-1.104-2.46-2.472v-16.224c0-1.368 1.104-2.472 2.46-2.472h16.08zm-4.632 15.672c2.652-.084 3.672-1.824 3.672-1.824 0-3.864-1.728-6.996-1.728-6.996-1.728-1.296-3.372-1.26-3.372-1.26l-.168.192c2.04.624 2.988 1.524 2.988 1.524-1.248-.684-2.472-1.02-3.612-1.152-.864-.096-1.692-.072-2.424.024l-.204.024c-.42.036-1.44.192-2.724.756-.444.204-.708.348-.708.348s.996-.948 3.156-1.572l-.12-.144s-1.644-.036-3.372 1.26c0 0-1.728 3.132-1.728 6.996 0 0 1.008 1.74 3.66 1.824 0 0 .444-.54.804-.996-1.524-.456-2.1-1.416-2.1-1.416l.336.204.048.036.047.027.014.006.047.027c.3.168.6.3.876.408.492.192 1.08.384 1.764.516.9.168 1.956.228 3.108.012.564-.096 1.14-.264 1.74-.516.42-.156.888-.384 1.38-.708 0 0-.6.984-2.172 1.428.36.456.792.972.792.972zm-5.58-5.604c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332.012-.732-.54-1.332-1.224-1.332zm4.38 0c-.684 0-1.224.6-1.224 1.332 0 .732.552 1.332 1.224 1.332.684 0 1.224-.6 1.224-1.332 0-.732-.54-1.332-1.224-1.332z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Hızlı Linkler */}
              <div>
                <h3 className="footer-heading">HIZLI BAĞLANTILAR</h3>
                <ul className="footer-links">
                  <li className="footer-link"><Link href="/hakkimizda">Hakkımızda</Link></li>
                  <li className="footer-link"><Link href="/iletisim">İletişim</Link></li>
                  <li className="footer-link"><Link href="/sss">Sıkça Sorulan Sorular</Link></li>
                  <li className="footer-link"><Link href="/odeme">Ödeme Seçenekleri</Link></li>
                  <li className="footer-link"><Link href="/kargo-ve-teslimat">Kargo ve Teslimat</Link></li>
                  <li className="footer-link"><Link href="/iade-ve-degisim">İade ve Değişim</Link></li>
                </ul>
              </div>

              {/* Kategoriler */}
              <div>
                <h3 className="footer-heading">KATEGORİLER</h3>
                <ul className="footer-links">
                  <li className="footer-link"><Link href="/kategori/elbise">Elbise</Link></li>
                  <li className="footer-link"><Link href="/kategori/bluz">Bluz</Link></li>
                  <li className="footer-link"><Link href="/kategori/etek">Etek</Link></li>
                  <li className="footer-link"><Link href="/kategori/pantolon">Pantolon</Link></li>
                  <li className="footer-link"><Link href="/kategori/aksesuar">Aksesuar</Link></li>
                  <li className="footer-link"><Link href="/kategori/ceket">Ceket</Link></li>
                </ul>
              </div>

              {/* İletişim */}
              <div>
                <h3 className="footer-heading">BİZE ULAŞIN</h3>
                <div className="footer-contact-item">
                  <div className="footer-contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="footer-contact-text">
                    Atatürk Mah. İnönü Cad. No:123,<br />Merkez / İstanbul
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="footer-contact-text">
                    info@dovl.com
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="footer-contact-text">
                    +90 212 123 45 67
                  </div>
                </div>
                <div className="footer-contact-item">
                  <div className="footer-contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="footer-contact-text">
                    Pazartesi - Cumartesi: 09:00 - 18:00
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="footer-payment">
                <img src="https://placehold.co/400x50/000000/FFFFFF/png?text=ÖDEME+METODLARI" alt="Ödeme Metodları" style={{ height: '2rem' }} />
              </div>
              <p className="footer-copyright">© 2025 DOVL Fashion. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}