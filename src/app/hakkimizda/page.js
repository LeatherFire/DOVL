"use client";
import Link from 'next/link';

export default function HakkimizdaPage() {
  return (
    <main className="section">
      <div className="container" style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: '4rem 1rem' 
      }}>
        <h1 className="page-title">HAKKIMIZDA</h1>
        
        <div className="content-section">
          <div className="about-banner" style={{
            position: 'relative',
            height: '400px',
            marginBottom: '3rem',
            overflow: 'hidden',
            borderRadius: '4px'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url("https://placehold.co/1200x500/1a1a1a/ffffff/?text=DOVL+FASHION")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.8
            }}></div>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              color: 'var(--color-white)',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.5rem',
                fontWeight: 300,
                letterSpacing: '0.2em',
                marginBottom: '1rem'
              }}>DOVL</div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 300,
                letterSpacing: '0.1em'
              }}>PREMIUM KADIN GİYİM</div>
            </div>
          </div>
          
          <h2 className="section-title" style={{ 
            fontSize: '1.5rem', 
            fontWeight: 500,
            marginBottom: '1.5rem'
          }}>HİKAYEMİZ</h2>
          
          <p style={{ marginBottom: '2rem', lineHeight: 1.7 }}>
            2015 yılında İstanbul'da kurulan DOVL, modern kadının şıklığını ve özgüvenini yansıtan tasarımlar sunma vizyonuyla doğdu. Kurucumuz Deniz Öz'ün moda dünyasındaki 15 yıllık deneyimi ve yaratıcı yaklaşımı ile DOVL, kısa sürede Türkiye'nin en sevilen kadın giyim markalarından biri haline geldi.
          </p>
          
          <p style={{ marginBottom: '2rem', lineHeight: 1.7 }}>
            Markamızın ismi, kurucumuzun adı ve soyadının baş harflerinden gelmektedir ve aynı zamanda "özel" anlamına gelen "özvl" kelimesini çağrıştırmaktadır. Bu isim, her bir tasarımımıza kattığımız özel dokunuşun ve her bir müşterimize sunduğumuz ayrıcalıklı deneyimin simgesidir.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem',
            margin: '3rem 0'
          }}>
            <div style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              padding: '2.5rem 2rem',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 500, 
                marginBottom: '1rem',
                fontFamily: 'var(--font-heading)'
              }}>VİZYONUMUZ</h3>
              <p style={{ lineHeight: 1.7 }}>
                Modern kadının özgün stilini yansıtan, zamansız tasarımlarla global moda dünyasında iz bırakan bir marka olmak.
              </p>
            </div>
            
            <div style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              padding: '2.5rem 2rem',
              borderRadius: '4px',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 500, 
                marginBottom: '1rem',
                fontFamily: 'var(--font-heading)'
              }}>MİSYONUMUZ</h3>
              <p style={{ lineHeight: 1.7 }}>
                Kaliteli kumaşlar ve kusursuz işçilikle üretilmiş, özgün tasarımlarımızı erişilebilir bir lüks anlayışıyla sunarak kadınları güçlendirmek ve özgüvenlerini artırmak.
              </p>
            </div>
          </div>
          
          <h2 className="section-title" style={{ 
            fontSize: '1.5rem', 
            fontWeight: 500,
            marginBottom: '1.5rem'
          }}>TASARIM FELSEFEMİZ</h2>
          
          <p style={{ marginBottom: '2rem', lineHeight: 1.7 }}>
            DOVL olarak, "az çoktur" felsefesini benimsiyoruz. Her sezon sınırlı sayıda, ancak yüksek kalitede parçalar tasarlıyor, trend odaklı hızlı moda akımının aksine, zamansız ve sürdürülebilir bir şıklığı savunuyoruz. Tasarımlarımızın her biri, günlük şıklığı özel günlere taşıyabilecek, yıllar boyunca gardırobunuzda kalacak ve her zaman sizi en iyi şekilde hissettirecek parçalar olarak hayat buluyor.
          </p>
          
          <p style={{ marginBottom: '2rem', lineHeight: 1.7 }}>
            Kumaş seçimlerimizde doğal ve çevreye duyarlı materyallere öncelik veriyor, her bir dikişin kusursuz olmasına özen gösteriyoruz. İstanbul'daki atölyemizde, deneyimli ustalarımızın ellerinde hayat bulan tasarımlarımız, hem görünüşüyle hem de hissettirdikleriyle fark yaratıyor.
          </p>
          
          <div style={{ 
            marginTop: '3rem',
            position: 'relative',
            height: '250px',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url("https://placehold.co/1200x300/1a1a1a/ffffff/?text=BİZE+KATILIN")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'var(--color-white)',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <h3 style={{ 
                fontSize: '1.75rem', 
                fontWeight: 300, 
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-heading)',
                letterSpacing: '0.1em'
              }}>DOVL AİLESİNE KATILIN</h3>
              
              <Link href="/iletisim" className="btn" style={{ 
                backgroundColor: 'var(--color-white)',
                color: 'var(--color-primary)',
                padding: '0.75rem 2rem',
                borderRadius: '2px',
                fontWeight: 500,
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                display: 'inline-block'
              }}>
                BİZE ULAŞIN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 