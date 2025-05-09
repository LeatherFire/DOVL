"use client";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({ error, reset }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="global-error-page">
          <div className="global-error-container">
            <h1 className="global-error-code">HATA</h1>
            <div className="global-error-divider"></div>
            <h2 className="global-error-title">KRİTİK HATA</h2>
            <p className="global-error-message">
              Üzgünüz, uygulamada beklenmedik bir hata oluştu. Teknik ekibimiz durumdan haberdar edildi.
            </p>
            <div className="global-error-actions">
              <button
                onClick={() => reset()}
                className="global-btn-primary global-error-btn"
              >
                SAYFAYI YENİLE
              </button>
            </div>
          </div>
        </div>
        <style jsx global>{`
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
          }

          html,
          body {
            max-width: 100vw;
            overflow-x: hidden;
            height: 100%;
            font-family: ${inter.style.fontFamily}, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
              Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
          }

          .global-error-page {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 2rem;
            background-color: #f9f9f9;
          }
          
          .global-error-container {
            text-align: center;
            max-width: 600px;
            padding: 3rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          }
          
          .global-error-code {
            font-size: 5rem;
            font-weight: 800;
            margin: 0;
            line-height: 1;
            letter-spacing: -1px;
            color: #ff3333;
          }
          
          .global-error-divider {
            width: 80px;
            height: 4px;
            background-color: #ff3333;
            margin: 1.5rem auto;
          }
          
          .global-error-title {
            font-size: 2.5rem;
            font-weight: 600;
            margin: 0 0 1.5rem;
            letter-spacing: 2px;
            color: #333;
          }
          
          .global-error-message {
            font-size: 1.125rem;
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
          }
          
          .global-error-actions {
            display: flex;
            justify-content: center;
          }
          
          .global-error-btn {
            display: inline-block;
            padding: 1rem 2rem;
            font-weight: 600;
            font-size: 0.9rem;
            letter-spacing: 1px;
            text-decoration: none;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
          }
          
          .global-btn-primary {
            background-color: #ff3333;
            color: white;
            border: 2px solid #ff3333;
            border-radius: 4px;
          }
          
          .global-btn-primary:hover {
            background-color: #e62e2e;
            border-color: #e62e2e;
          }
        `}</style>
      </body>
    </html>
  );
} 