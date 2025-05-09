"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Hata oluştuğunda sunucu tarafında loglama yapmak için
    console.error(error);
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-container">
        <h1 className="error-code">500</h1>
        <div className="error-divider"></div>
        <h2 className="error-title">SUNUCU HATASI</h2>
        <p className="error-message">
          Üzgünüz, bir şeyler yanlış gitti. Teknik ekibimiz sorun üzerinde çalışıyor.
        </p>
        <div className="error-actions">
          <button onClick={reset} className="btn-primary error-btn">
            TEKRAR DENE
          </button>
          <Link href="/" className="btn-outline error-btn">
            ANA SAYFAYA DÖN
          </Link>
        </div>
      </div>
      <style jsx>{`
        .error-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 3rem 1rem;
          background-color: #f9f9f9;
        }
        
        .error-container {
          text-align: center;
          max-width: 600px;
          padding: 3rem;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }
        
        .error-code {
          font-size: 9rem;
          font-weight: 800;
          margin: 0;
          line-height: 1;
          letter-spacing: -3px;
          color: #000;
        }
        
        .error-divider {
          width: 80px;
          height: 4px;
          background-color: #000;
          margin: 1.5rem auto;
        }
        
        .error-title {
          font-size: 2.5rem;
          font-weight: 600;
          margin: 0 0 1.5rem;
          letter-spacing: 2px;
        }
        
        .error-message {
          font-size: 1.125rem;
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .error-actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .error-btn {
          display: block;
          padding: 1rem 2rem;
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 1px;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer; 
          border: none;
        }
        
        .btn-primary {
          background-color: #000;
          color: white;
          border: 2px solid #000;
        }
        
        .btn-primary:hover {
          background-color: #333;
          border-color: #333;
        }
        
        .btn-outline {
          background-color: transparent;
          border: 2px solid #000;
          color: #000;
        }
        
        .btn-outline:hover {
          background-color: #f5f5f5;
        }
        
        @media (min-width: 768px) {
          .error-actions {
            flex-direction: row;
            justify-content: center;
            gap: 1.5rem;
          }
          
          .error-btn {
            min-width: 200px;
          }
        }
      `}</style>
    </div>
  );
} 