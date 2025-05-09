"use client";

export default function KargoTeslimatPage() {
  return (
    <main className="section">
      <div className="container" style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        padding: '4rem 1rem' 
      }}>
        <h1 className="page-title">KARGO VE TESLİMAT</h1>
        
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          maxWidth: '700px',
          margin: '0 auto 3rem',
          lineHeight: 1.7
        }}>
          DOVL olarak siparişlerinizin en kısa sürede ve güvenli bir şekilde size ulaşması için anlaşmalı kargo firmalarımızla çalışmaktayız. Aşağıda kargo ve teslimat süreçlerimiz hakkında detaylı bilgi bulabilirsiniz.
        </p>
        
        <div className="shipping-info" style={{ marginBottom: '4rem' }}>
          <div className="info-block" style={{ 
            marginBottom: '2.5rem',
            padding: '1.5rem',
            border: '1px solid #eee',
            borderRadius: '4px'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 500,
              marginBottom: '1rem'
            }}>KARGO FİRMALARI</h2>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Siparişlerinizi teslim etmek için aşağıdaki güvenilir kargo firmaları ile çalışmaktayız:
            </p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1rem', 
                backgroundColor: '#f8f8f8', 
                borderRadius: '4px',
                height: '80px'
              }}>
                <div style={{ width: '60px', height: '40px', backgroundColor: '#ddd', marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '0.7rem' }}>Logo</div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 500 }}>Yurtiçi Kargo</h3>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>Tercih edilen kargo</p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1rem', 
                backgroundColor: '#f8f8f8', 
                borderRadius: '4px',
                height: '80px'
              }}>
                <div style={{ width: '60px', height: '40px', backgroundColor: '#ddd', marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '0.7rem' }}>Logo</div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 500 }}>Aras Kargo</h3>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>Alternatif kargo</p>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1rem', 
                backgroundColor: '#f8f8f8', 
                borderRadius: '4px',
                height: '80px'
              }}>
                <div style={{ width: '60px', height: '40px', backgroundColor: '#ddd', marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontSize: '0.7rem' }}>Logo</div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 500 }}>MNG Kargo</h3>
                  <p style={{ fontSize: '0.8rem', color: '#666' }}>Alternatif kargo</p>
                </div>
              </div>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
              * Kargo firmaları, gönderim yapılacak bölgeye göre değişiklik gösterebilir. Çeşitli sebeplerden dolayı, kargo firması tercihi yapılamayan durumlarda, siparişiniz anlaşmalı olduğumuz diğer kargo firmalarıyla gönderilecektir.
            </p>
          </div>
          
          <div className="info-block" style={{ 
            marginBottom: '2.5rem',
            padding: '1.5rem',
            border: '1px solid #eee',
            borderRadius: '4px'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 500,
              marginBottom: '1rem'
            }}>TESLİMAT SÜRELERİ</h2>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Siparişleriniz, ödeme onayını takiben en geç 2 iş günü içerisinde kargoya verilmektedir. Kargoya verilen siparişlerin teslimat süreleri şu şekildedir:
            </p>
            
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>İstanbul içi:</strong> Siparişiniz kargoya verildikten sonra 1-2 iş günü içerisinde teslim edilir.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Büyükşehirler:</strong> Siparişiniz kargoya verildikten sonra 1-3 iş günü içerisinde teslim edilir.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Diğer iller ve ilçeler:</strong> Siparişiniz kargoya verildikten sonra 2-4 iş günü içerisinde teslim edilir.
              </li>
              <li>
                <strong>Köy ve kırsal bölgeler:</strong> Siparişiniz kargoya verildikten sonra 3-5 iş günü içerisinde teslim edilir.
              </li>
            </ul>
            
            <div style={{ padding: '1rem', backgroundColor: '#f8f8f8', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Hızlı Teslimat: İstanbul İçi Aynı Gün Teslimat</p>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                İstanbul içindeki adreslerinize, saat 14:00'e kadar verilen siparişlerde aynı gün teslimat hizmetimiz bulunmaktadır. Bu hizmetten yararlanmak için sipariş sayfasında "Aynı Gün Teslimat" seçeneğini işaretlemeniz ve 29,90 TL teslimat ücretini ödemeniz gerekmektedir.
              </p>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
              * Belirtilen teslimat süreleri, kargo firmalarının standart teslimat süreleri baz alınarak hesaplanmıştır. Hava koşulları, resmi tatiller, yoğun dönemler veya beklenmedik durumlar sebebiyle teslimat sürelerinde gecikmeler yaşanabilir.
            </p>
          </div>
          
          <div className="info-block" style={{ 
            marginBottom: '2.5rem',
            padding: '1.5rem',
            border: '1px solid #eee',
            borderRadius: '4px'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 500,
              marginBottom: '1rem'
            }}>KARGO ÜCRETLERİ</h2>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
              DOVL'de kargo ücretlendirmesi şu şekildedir:
            </p>
            
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Standart Kargo:</strong> 250 TL ve üzeri alışverişlerinizde kargo ücretsizdir. 250 TL altındaki siparişlerinizde 29,90 TL kargo ücreti uygulanmaktadır.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>İstanbul İçi Aynı Gün Teslimat:</strong> Sipariş tutarından bağımsız olarak 49,90 TL ücret uygulanmaktadır.
              </li>
              <li>
                <strong>KKTC ve Yurt Dışı Gönderimler:</strong> KKTC için 89,90 TL, diğer ülkeler için mesafeye göre değişen kargo ücretleri uygulanmaktadır. Detaylı bilgi için lütfen müşteri hizmetlerimiz ile iletişime geçiniz.
              </li>
            </ul>
            
            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
              * Dönemsel kampanyalar ve özel günlerde, kargo ücretlerinde indirim veya ücretsiz kargo kampanyaları düzenlenebilir. Güncel kampanyalarımızı takip etmek için web sitemizi ve sosyal medya hesaplarımızı ziyaret edebilirsiniz.
            </p>
          </div>
          
          <div className="info-block" style={{ 
            marginBottom: '2.5rem',
            padding: '1.5rem',
            border: '1px solid #eee',
            borderRadius: '4px'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 500,
              marginBottom: '1rem'
            }}>KARGO TAKİBİ</h2>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Siparişiniz kargoya verildiğinde, kayıtlı e-posta adresinize otomatik olarak kargo takip numarası ve bağlantısı gönderilmektedir. Ayrıca, hesabınızdaki "Siparişlerim" sayfasından da kargo durumunu takip edebilirsiniz.
            </p>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Kargo takibinde yaşadığınız sorunlar için müşteri hizmetlerimize aşağıdaki kanallardan ulaşabilirsiniz:
            </p>
            
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem', lineHeight: 1.7 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                Telefon: +90 212 123 45 67 (Hafta içi 09:00-18:00)
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                E-posta: info@dovl.com
              </li>
              <li>
                <a href="/iletisim" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>İletişim Formu</a>
              </li>
            </ul>
          </div>
          
          <div className="info-block" style={{ 
            marginBottom: '2.5rem',
            padding: '1.5rem',
            border: '1px solid #eee',
            borderRadius: '4px'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 500,
              marginBottom: '1rem'
            }}>TESLİMAT KOŞULLARI</h2>
            
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                Teslimat, siparişte belirtilen adrese yapılmaktadır. Adres bilgilerinizin eksiksiz ve doğru olduğundan emin olunuz.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                Kargo teslimatı, imza karşılığında yapılmaktadır. Siparişinizi teslim alırken, kargo paketinin hasarsız olduğundan emin olunuz. Hasar gördüğünü düşündüğünüz paketleri teslim almayınız veya tutanak tutturunuz.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                Teslimat esnasında adresinizde bulunamazsanız, kargo görevlisi size bir bilgilendirme notu bırakacaktır. Bu durumda, kargo firmasının bildirdiği şubeye giderek siparişinizi teslim alabilir veya yeniden teslimat talebinde bulunabilirsiniz.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                Kapıda ödeme seçeneğiyle verilen siparişlerde, teslimat sırasında ödeme yapmanız gerekmektedir. Ödeme yapmadığınız takdirde, siparişiniz teslim edilmeyecektir.
              </li>
              <li>
                3 kez başarısız teslimat denemesi sonrasında, siparişiniz kargo firmasının en yakın şubesinde 3 gün boyunca bekletilecektir. Bu süre içinde teslim alınmayan siparişler, firmamıza iade edilecektir.
              </li>
            </ul>
          </div>
        </div>
        
        {/* Teslimat Bilgilendirme CTA */}
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
          }}>HIZLI TESLİMAT İÇİN BİZİ TERCİH EDİN</h2>
          
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            Siparişinizin hazırlanması ve kargoya verilmesi sürecinde, en yüksek kalite standartlarında hizmet sunmak için çalışıyoruz. Size en iyi alışveriş deneyimini yaşatmak için, teslimat sürecimizi sürekli olarak geliştirmeye devam ediyoruz.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/urunler" style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              padding: '0.75rem 1.5rem',
              borderRadius: '2px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              letterSpacing: '0.05em'
            }}>
              ALIŞVERİŞE BAŞLA
            </a>
            
            <a href="/iletisim" style={{
              backgroundColor: 'transparent',
              color: 'var(--color-primary)',
              padding: '0.75rem 1.5rem',
              borderRadius: '2px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              border: '1px solid var(--color-primary)'
            }}>
              BİZE ULAŞIN
            </a>
          </div>
        </div>
        
      </div>
    </main>
  );
} 