"use client";

export default function IadeDegisimPage() {
  return (
    <main className="section">
      <div className="container" style={{ 
        maxWidth: '900px', 
        margin: '0 auto', 
        padding: '4rem 1rem' 
      }}>
        <h1 className="page-title">İADE VE DEĞİŞİM</h1>
        
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          maxWidth: '700px',
          margin: '0 auto 3rem',
          lineHeight: 1.7
        }}>
          DOVL olarak, ürünlerimizden memnun kalmanız bizim için önemlidir. Beklentilerinizi karşılamayan ürünleri kolayca iade edebilir veya değiştirebilirsiniz. Aşağıda iade ve değişim politikamız hakkında detaylı bilgi bulabilirsiniz.
        </p>
        
        <div className="return-exchange-info" style={{ marginBottom: '4rem' }}>
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
            }}>İADE KOŞULLARI</h2>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
              DOVL'den satın aldığınız ürünleri, aşağıdaki koşullar dahilinde iade edebilirsiniz:
            </p>
            
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                İade işlemleri, ürünü teslim aldığınız tarihten itibaren 14 gün içerisinde gerçekleştirilmelidir.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                İade etmek istediğiniz ürünler, kullanılmamış, yıkanmamış, ütülenmemiş ve deforme olmamış durumda olmalıdır.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                Ürünlerin etiketleri çıkarılmamış, orijinal ambalajları açılmamış veya zarar görmemiş olmalıdır.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                Hediye paketinde gönderilen ürünler için, hediye paketi açılmadan veya hasar görmeden iade edilmelidir.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                İç giyim, mayo, bikini, kozmetik ürünleri, kişisel bakım ürünleri ve aksesuar gruplarındaki ürünler, hijyen koşulları gereği iade edilemez.
              </li>
              <li>
                Özel kampanyalar dahilinde satın alınan indirimli ürünler, aksi belirtilmedikçe iade edilebilir.
              </li>
            </ul>
            
            <div style={{ padding: '1rem', backgroundColor: '#f8f8f8', borderRadius: '4px', marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Önemli Not:</p>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                İade etmek istediğiniz ürünlerle ilgili tüm haklarınız, 6502 Sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında korunmaktadır.
              </p>
            </div>
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
            }}>DEĞİŞİM KOŞULLARI</h2>
            
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Satın aldığınız ürünleri, aşağıdaki koşullar dahilinde değiştirebilirsiniz:
            </p>
            
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                Değişim işlemleri, ürünü teslim aldığınız tarihten itibaren 14 gün içerisinde gerçekleştirilmelidir.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                Değiştirmek istediğiniz ürünler, kullanılmamış, yıkanmamış, ütülenmemiş ve deforme olmamış durumda olmalıdır.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                Ürün değişimi, stoklar dahilinde aynı ürünün farklı beden veya rengi ile yapılabilir.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                Stokta olmayan ürünler için, eşdeğer fiyattaki başka bir ürünle değişim yapılabilir. Eğer değişim yapılacak yeni ürünün fiyatı daha yüksekse, aradaki farkı ödemeniz istenecektir.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                İç giyim, mayo, bikini, kozmetik ürünleri, kişisel bakım ürünleri ve aksesuar gruplarındaki ürünler, hijyen koşulları gereği değiştirilemez.
              </li>
              <li>
                Özel kampanyalar dahilinde satın alınan indirimli ürünler, aksi belirtilmedikçe değiştirilebilir.
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
            }}>İADE VE DEĞİŞİM SÜRECİ</h2>
            
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              İade veya değişim işleminizi başlatmak için aşağıdaki adımları izleyebilirsiniz:
            </p>
            
            <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>İade/Değişim Talebi Oluşturma:</strong> Hesabınızdaki "Siparişlerim" sayfasından iade veya değişim yapmak istediğiniz ürünü seçerek "İade/Değişim Talebi Oluştur" butonuna tıklayın. Hesabınız yoksa, müşteri hizmetlerimizle iletişime geçerek talebinizi iletebilirsiniz.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>İade/Değişim Formu Doldurma:</strong> Açılan formda, iade veya değişim sebebinizi ve tercihlerinizi belirtin. Değişim işlemi için, istediğiniz yeni ürünün beden veya rengini seçin.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Ürünü Paketleme:</strong> İade veya değişim yapmak istediğiniz ürünü, orijinal etiketleri ve ambalajıyla birlikte paketleyin. Paket içerisine iade/değişim formunun çıktısını veya sipariş numaranızı içeren bir not ekleyin.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Kargo Gönderimi:</strong> Paketinizi, anlaşmalı kargo firmalarımızdan biriyle aşağıdaki adrese gönderin:<br/>
                <div style={{ padding: '0.5rem 1rem', backgroundColor: '#f8f8f8', borderRadius: '4px', margin: '0.5rem 0' }}>
                  DOVL İade/Değişim Departmanı<br/>
                  Atatürk Mah. İnönü Cad. No:123, Merkez / İstanbul
                </div>
              </li>
              <li>
                <strong>İade/Değişim Onayı ve İşlem:</strong> Paketiniz bize ulaştıktan sonra, ürün kontrolü yapılacak ve talebiniz uygun bulunduğu takdirde iade veya değişim işleminiz gerçekleştirilecektir. İade işlemlerinde, ödeme iadeniz en geç 14 iş günü içerisinde gerçekleştirilecektir.
              </li>
            </ol>
            
            <div style={{ padding: '1rem', backgroundColor: '#f8f8f8', borderRadius: '4px' }}>
              <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Kargo Ücretleri:</p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '0', lineHeight: 1.6, fontSize: '0.9rem' }}>
                <li style={{ marginBottom: '0.5rem' }}>
                  <strong>Ürün Hatası Nedeniyle İade/Değişim:</strong> Ürün hatası, yanlış ürün gönderimi veya taşıma sırasında hasar oluşması durumunda, kargo ücreti firmamız tarafından karşılanacaktır.
                </li>
                <li>
                  <strong>Müşteri Kaynaklı İade/Değişim:</strong> Beğenmeme, fikir değişikliği veya yanlış beden seçimi gibi müşteri kaynaklı sebeplerle yapılan iade/değişimlerde, kargo ücreti müşteri tarafından karşılanacaktır.
                </li>
              </ul>
            </div>
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
            }}>ÖDEME İADELERİ</h2>
            
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              İade işleminiz onaylandıktan sonra, ödeme iadesi aşağıdaki şekilde gerçekleştirilecektir:
            </p>
            
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', lineHeight: 1.7 }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Kredi Kartı ile Yapılan Ödemelerde:</strong> İade tutarı, ödeme yaptığınız kredi kartına 14 iş günü içerisinde iade edilecektir. Bankanızın işlem sürelerinden kaynaklı olarak, iade tutarının kart hesabınıza yansıması 1-2 gün sürebilir.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Havale/EFT ile Yapılan Ödemelerde:</strong> İade tutarı, belirttiğiniz banka hesabına 14 iş günü içerisinde iade edilecektir.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Kapıda Ödeme ile Yapılan Ödemelerde:</strong> İade tutarı, belirttiğiniz banka hesabına 14 iş günü içerisinde iade edilecektir. Hesap bilgilerinizi müşteri hizmetlerimize iletmeniz gerekmektedir.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Taksitli Alışverişlerde:</strong> İade tutarı, bankanız tarafından kalan taksitlerinizin iptal edilmesi ve ödenen taksitlerin iade edilmesi şeklinde gerçekleştirilecektir.
              </li>
              <li>
                <strong>Hediye Çeki/Promosyon Kodu ile Yapılan Ödemelerde:</strong> İade tutarı, aynı tutarda yeni bir hediye çeki/promosyon kodu olarak tarafınıza iletilecektir.
              </li>
            </ul>
            
            <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
              * İade işlemlerinde, kargo ücretleri iade tutarından düşülebilir. Promosyon veya hediye olarak verilen ürünlerin iadesi yapılamaz.
            </p>
          </div>
        </div>
        
        {/* İade/Değişim İletişim CTA */}
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
          }}>BİZE ULAŞIN</h2>
          
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            İade ve değişim işlemleri hakkında sorularınız için müşteri hizmetlerimizle iletişime geçebilirsiniz.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/iletisim" style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              padding: '0.75rem 1.5rem',
              borderRadius: '2px',
              textDecoration: 'none',
              fontWeight: 500,
              fontSize: '0.9rem',
              letterSpacing: '0.05em'
            }}>
              BİZE YAZIN
            </a>
            
            <a href="tel:+902121234567" style={{
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
              +90 212 123 45 67
            </a>
          </div>
        </div>
        
      </div>
    </main>
  );
} 