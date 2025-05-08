// src/app/admin/layout.js
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './admin.css';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  
  // Admin giriş kontrolü (gerçek projede API ile kontrol edilecek)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Sayfa yüklendiğinde oturum kontrolü
  useEffect(() => {
    // Gerçek projede API ile kontrol yapılacak
    // Şimdilik mock olarak true kabul ediyoruz
    const checkAuth = () => {
      // localStorage.getItem('adminToken') ? setIsAuthenticated(true) : setIsAuthenticated(false);
      setIsAuthenticated(true); // Mock auth
    };
    
    checkAuth();
  }, []);
  
  // Sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Giriş yapılmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-form">
          <h1>DOVL YÖNETİM PANELİ</h1>
          <p>Giriş yapmanız gerekiyor.</p>
          <Link href="/admin/login" className="btn btn-primary">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <h1 className="admin-logo">DOVL</h1>
          <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="admin-navigation">
          <ul className="admin-menu">
            <li className="admin-menu-item">
              <Link href="/admin" className={`admin-menu-link ${pathname === '/admin' ? 'active' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </Link>
            </li>
            
            <li className="admin-menu-item">
              <Link href="/admin/urunler" className={`admin-menu-link ${pathname.startsWith('/admin/urunler') ? 'active' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Ürünler</span>
              </Link>
            </li>
            
            <li className="admin-menu-item">
              <Link href="/admin/siparisler" className={`admin-menu-link ${pathname.startsWith('/admin/siparisler') ? 'active' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>Siparişler</span>
              </Link>
            </li>
            
            <li className="admin-menu-item">
              <Link href="/admin/kampanyalar" className={`admin-menu-link ${pathname.startsWith('/admin/kampanyalar') ? 'active' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Kampanyalar</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="admin-sidebar-footer">
          <Link href="/" className="admin-view-site" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Siteyi Görüntüle</span>
          </Link>
          
          <button className="admin-logout">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-header">
          <button 
            className="admin-menu-toggle" 
            onClick={toggleSidebar}
            aria-label="Menüyü Aç/Kapat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="admin-search">
            <input
              type="text"
              placeholder="Arama..."
              className="admin-search-input"
            />
            <button className="admin-search-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          <div className="admin-user-menu">
            <div className="admin-user-info">
              <span className="admin-user-name">Admin Kullanıcı</span>
              <span className="admin-user-role">Yönetici</span>
            </div>
            <div className="admin-user-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="32" height="32">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </header>
        
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}