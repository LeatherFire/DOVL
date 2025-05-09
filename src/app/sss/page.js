"use client";
import { useState } from 'react';

export default function SSSPage() {
  // Sıkça sorulan sorular ve cevaplar
  const faqs = [
    {
      id: 1,
      question: "Siparişim ne zaman elime ulaşır?",
      answer: "Siparişleriniz, ödeme onayından sonra ortalama 1-3 iş günü içerisinde kargoya verilmektedir. Kargoya verildikten sonra, İstanbul içi teslimatlar genellikle 1 iş günü, İstanbul dışı teslimatlar ise 1-3 iş günü içerisinde tamamlanmaktadır. Cumartesi günleri de teslimat yapılmaktadır."
    },
    {
      id: 2,
      question: "Kargo ücreti ne kadar?",
      answer: "250 TL ve üzeri alışverişlerinizde kargo ücretsizdir. 250 TL altındaki siparişlerinizde ise 29,90 TL kargo ücreti uygulanmaktadır."
    },
    {
      id: 3,
      question: "Kapıda ödeme seçeneği mevcut mu?",
      answer: "Evet, kapıda ödeme seçeneğimiz mevcuttur. Kapıda ödeme seçeneğini tercih ettiğiniz takdirde, +10 TL kapıda ödeme hizmet bedeli eklenecektir. Kapıda ödeme ile hem nakit hem de kredi kartı ile ödeme yapabilirsiniz."
    },
    {
      id: 4,
      question: "Yurt dışına teslimat yapıyor musunuz?",
      answer: "Evet, KKTC ve diğer ülkelere de teslimat yapmaktayız. Yurt dışı gönderimlerinde kargo ücreti ülkeye göre değişiklik göstermektedir. Detaylı bilgi için müşteri hizmetlerimiz ile iletişime geçebilirsiniz."
    },
    {
      id: 5,
      question: "Sipariş verdikten sonra iptal edebilir miyim?",
      answer: "Siparişiniz kargoya verilmeden önce iptal edebilirsiniz. Bunun için müşteri hizmetlerimiz ile iletişime geçmeniz yeterlidir. Kargoya verilen siparişlerde iptal işlemi yapılamamaktadır. Bu durumda ürünü teslim aldıktan sonra iade prosedürünü izleyebilirsiniz."
    },
    {
      id: 6,
      question: "Ürün değişimi nasıl yapılır?",
      answer: "Satın aldığınız ürünü, teslim tarihinden itibaren 14 gün içerisinde orijinal ambalajında ve etiketleri çıkarılmamış şekilde iade edebilir veya değiştirebilirsiniz. Değişim için hesabınızdan iade talebinde bulunmanız ve ürünü belirtilen adrese göndermeniz gerekmektedir. Detaylı bilgi için İade ve Değişim sayfamızı inceleyebilirsiniz."
    },
    {
      id: 7,
      question: "İndirim kuponlarını nasıl kullanabilirim?",
      answer: "İndirim kuponlarını, sepet sayfasında ilgili alana kupon kodunu girerek kullanabilirsiniz. Kupon kodları büyük-küçük harf duyarlı olabilir, bu nedenle kodunuzu tam olarak girdiğinizden emin olun. Her kuponun kullanım koşulları değişiklik gösterebilir, kupon detaylarını kontrol etmenizi öneririz."
    },
    {
      id: 8,
      question: "Bir beden rehberiniz var mı?",
      answer: "Evet, her ürün sayfasında 'Beden Rehberi' butonuna tıklayarak detaylı beden bilgilerine ulaşabilirsiniz. Ayrıca ürün detay sayfasında model ölçüleri ve giydiği beden bilgisi de bulunmaktadır. Beden seçiminde yardıma ihtiyacınız olursa müşteri hizmetlerimiz ile iletişime geçebilirsiniz."
    },
    {
      id: 9,
      question: "Ürünleri mağazada deneyebilir miyim?",
      answer: "Evet, İstanbul mağazamızda ürünlerimizi deneyebilirsiniz. Mağaza adresimiz: Atatürk Mah. İnönü Cad. No:123, Merkez / İstanbul. Çalışma saatlerimiz: Hafta içi 10:00-19:00, Cumartesi 10:00-18:00. Pazar günleri mağazamız kapalıdır."
    },
    {
      id: 10,
      question: "Sipariş durumumu nasıl takip edebilirim?",
      answer: "Siparişiniz kargoya verildikten sonra, kayıtlı e-posta adresinize kargo takip numarası ve bağlantısı gönderilecektir. Ayrıca hesabınızdan 'Siparişlerim' sayfasına girerek tüm siparişlerinizin durumunu takip edebilirsiniz."
    }
  ];

  // Açık olan soru ID'sini takip etmek için state
  const [openFaqId, setOpenFaqId] = useState(null);

  // Akordiyon toggle fonksiyonu
  const toggleFaq = (id) => {
    if (openFaqId === id) {
      setOpenFaqId(null); // Açıksa kapat
    } else {
      setOpenFaqId(id); // Kapalıysa aç
    }
  };

  return (
    <main className="section">
      <div className="container" style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '4rem 1rem' 
      }}>
        <h1 className="page-title">SIKÇA SORULAN SORULAR</h1>
        
        <p style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }}>
          Aşağıda müşterilerimizin en sık sorduğu soruları ve cevaplarını bulabilirsiniz. Eğer sorunuzun cevabını burada bulamazsanız, lütfen <a href="/iletisim" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>iletişim formu</a> aracılığıyla bize ulaşın.
        </p>
        
        <div className="faq-list">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className="faq-item"
              style={{
                marginBottom: '1rem',
                border: '1px solid #eee',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <div 
                className="faq-question" 
                onClick={() => toggleFaq(faq.id)}
                style={{
                  padding: '1.25rem',
                  backgroundColor: openFaqId === faq.id ? 'var(--color-primary)' : '#f8f8f8',
                  color: openFaqId === faq.id ? 'var(--color-white)' : 'inherit',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: 500,
                  transition: 'all 0.3s ease'
                }}
              >
                {faq.question}
                <span style={{ transition: 'transform 0.3s ease', transform: openFaqId === faq.id ? 'rotate(45deg)' : 'rotate(0)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
              </div>
              
              <div 
                className="faq-answer"
                style={{
                  padding: openFaqId === faq.id ? '1.25rem' : '0 1.25rem',
                  maxHeight: openFaqId === faq.id ? '1000px' : '0',
                  opacity: openFaqId === faq.id ? 1 : 0,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  lineHeight: 1.7
                }}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
        
        {/* İletişim CTA */}
        <div style={{ 
          marginTop: '3rem',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f8f8f8',
          borderRadius: '4px'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 500, 
            marginBottom: '1rem'
          }}>HALA SORUNUZ MU VAR?</h2>
          
          <p style={{ marginBottom: '1.5rem' }}>
            Yanıtını bulamadığınız sorularınız için müşteri hizmetlerimizle iletişime geçebilirsiniz.
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