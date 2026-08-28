import { useEffect, useState } from "react";
import {
  Boxes,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  ClipboardList,
  FileText,
  Gauge,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  PackageCheck,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Timer,
  User,
  Wrench,
} from "lucide-react";
import { business } from "../../data/business.js";
import { categories, products } from "../../data/catalog.js";
import { formatCurrency } from "../../utils/formatters.js";
import { getProductImages, PRODUCT_IMAGES_EVENT } from "../../utils/productImages.js";

export function PublicSite({ page, setPage }) {
  return (
    <>
      <main>
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "products" && <ProductsPage />}
        {(page === "who" || page === "about") && <AboutPage />}
        {page === "contact" && <ContactPage />}
        {page === "faq" && <FaqPage />}
        {page === "kvkk" && <LegalPage type="kvkk" />}
        {page === "privacy" && <LegalPage type="privacy" />}
      </main>
      <a className="floating-whatsapp" href={business.whatsappHref} target="_blank" rel="noreferrer" aria-label="WhatsApp üzerinden iletişime geç">
        <MessageCircle size={23} />
      </a>
      <SiteFooter setPage={setPage} />
    </>
  );
}

function HomePage({ setPage }) {
  return (
    <>
      <section className="hero hero-pro" id="anasayfa">
        <img src="/workshop-hero.png" alt="Modern motosiklet servis atölyesi" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="eyebrow">Simav motosiklet servis noktası</span>
          <h1>Servis, parça ve aksesuar tek adreste.</h1>
          <p>
            {business.brand}; bakım, arıza tespiti, yedek parça ve sürüş ekipmanını
            aynı işletme disipliniyle takip eden profesyonel motosiklet garajıdır.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" type="button" onClick={() => setPage("contact")}>
              Servis randevusu al <ChevronRight size={18} />
            </button>
            <button className="secondary-btn" type="button" onClick={() => setPage("products")}>
              Ürünleri incele
            </button>
          </div>
          <div className="hero-assurance">
            <span><CheckCircle2 size={17} /> Net teşhis</span>
            <span><CheckCircle2 size={17} /> Stok kontrollü parça</span>
            <span><CheckCircle2 size={17} /> Doğrudan iletişim</span>
          </div>
        </div>
      </section>

      <section className="service-showcase" aria-label="Hizmet alanları">
        <article>
          <Wrench size={24} />
          <span>01</span>
          <h2>Servis ve bakım</h2>
          <p>Periyodik bakım, arıza tespiti, fren, yağ, zincir ve genel kontrol işlemleri.</p>
        </article>
        <article>
          <PackageCheck size={24} />
          <span>02</span>
          <h2>Yedek parça</h2>
          <p>Uyumlu parça yönlendirmesi, stok kontrolü ve mağazadan hızlı teklif alma.</p>
        </article>
        <article>
          <ShieldCheck size={24} />
          <span>03</span>
          <h2>Aksesuar</h2>
          <p>Kask, eldiven, ekipman ve sürüş güvenliğini artıran tamamlayıcı ürünler.</p>
        </article>
      </section>

      <section className="workshop-flow">
        <div className="section-heading">
          <div>
            <span className="eyebrow dark">İş akışı</span>
            <h2>Motor içeri girer, süreç kayıtlı ilerler.</h2>
          </div>
          <button className="outline-btn" type="button" onClick={() => setPage("contact")}>
            İletişime geç <ChevronRight size={17} />
          </button>
        </div>
        <div className="flow-grid">
          <article>
            <CalendarClock size={22} />
            <h3>Randevu ve ön bilgi</h3>
            <p>İhtiyaç, model bilgisi ve şikayet netleştirilir; uygun zaman planlanır.</p>
          </article>
          <article>
            <Gauge size={22} />
            <h3>Kontrol ve teşhis</h3>
            <p>Servis kontrolü yapılır, gerekli parça ve işçilik kalemleri ayrıştırılır.</p>
          </article>
          <article>
            <Timer size={22} />
            <h3>Teslim ve takip</h3>
            <p>Yapılan işlem, kullanılan parça ve sonraki bakım ihtiyacı kayıt altında tutulur.</p>
          </article>
        </div>
      </section>

      <section className="brand-strip brand-strip-pro">
        <div className="logo-preview">
          <span>MEKA</span>
          <strong>MOTO GARAGE</strong>
        </div>
        <div>
          <span className="eyebrow dark">Kartvizit bilgileri işlendi</span>
          <h2>Metin Kalfa ile doğrudan iletişim.</h2>
          <div className="business-lines">
            <a href={business.phoneHref}><Phone size={18} /> {business.phone}</a>
            <a href={business.emailHref}><Mail size={18} /> {business.email}</a>
            <a href={business.instagramHref}><Instagram size={18} /> {business.instagram}</a>
            <span><MapPin size={18} /> {business.address} · {business.city}</span>
          </div>
        </div>
      </section>

      <ProductsPreview setPage={setPage} />

      <section className="home-cta">
        <div>
          <span className="eyebrow">Servis ve parça için hızlı dönüş</span>
          <h2>Motorun için doğru parçayı ve doğru işlemi birlikte netleştirelim.</h2>
        </div>
        <button className="primary-btn" type="button" onClick={() => setPage("contact")}>
          İletişim bilgileri <ChevronRight size={18} />
        </button>
      </section>
    </>
  );
}

function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [query, setQuery] = useState("");
  const categoryProducts = activeCategory === "Tümü"
    ? products
    : products.filter((product) => product.category === activeCategory);
  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const visibleProducts = normalizedQuery
    ? categoryProducts.filter((product) => [product.name, product.brand, product.category, product.compatibility, product.tag]
      .join(" ")
      .toLocaleLowerCase("tr-TR")
      .includes(normalizedQuery))
    : categoryProducts;

  return (
    <>
      <section className="products-hero page-section">
        <div>
          <span className="eyebrow">Ürün vitrini</span>
          <h2>Parçayı, uyumu ve stok durumunu net gör.</h2>
          <p>
            Online ödeme yok; ürünler mağaza iletişimi ve teklif akışı için listelenir.
            Uyum, stok ve kategori bilgisiyle doğru parçaya daha hızlı karar verilir.
          </p>
        </div>
        <div className="product-summary">
          <strong>{products.length}</strong>
          <span>aktif ürün</span>
          <small>Servis, bakım, yedek parça ve aksesuar</small>
        </div>
      </section>

      <section className="section products-section">
        <div className="product-toolbar">
          <div>
            <span className="eyebrow dark">Kategoriler</span>
            <h2>Yedek parça ve aksesuar vitrini</h2>
          </div>
          <label className="product-search">
            <Search size={17} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ürün, marka veya model ara"
              aria-label="Ürün ara"
            />
            <small>{visibleProducts.length} sonuç</small>
          </label>
        </div>
        <div className="category-tabs" aria-label="Ürün kategorileri">
          {categories.map((category) => (
            <button
              className={activeCategory === category ? "active" : ""}
              type="button"
              key={category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <ProductGrid items={visibleProducts} />
      </section>
    </>
  );
}

function WhoPage() {
  return (
    <>
      <section className="story-hero page-section" id="biz-kimiz">
        <div>
          <span className="eyebrow">Biz kimiz?</span>
          <h2>{business.brand}, Simav’da motosiklet kullanıcıları için pratik servis noktası.</h2>
          <p>
            Metin Kalfa yönetimindeki {business.brand}; bakım, arıza tespiti, yedek parça
            ve aksesuar ihtiyaçlarını tek noktadan takip eden yerel bir motosiklet işletmesidir.
          </p>
        </div>
        <div className="story-card">
          <Store size={28} />
          <strong>{business.owner}</strong>
          <span>{business.city}</span>
          <small>{business.address}</small>
        </div>
      </section>

      <section className="principle-section">
        <article>
          <CheckCircle2 size={22} />
          <h3>Net iletişim</h3>
          <p>Parça, işçilik ve servis ihtiyacı müşteriye açık şekilde aktarılır.</p>
        </article>
        <article>
          <PackageCheck size={22} />
          <h3>Doğru ürün</h3>
          <p>Uyumlu yedek parça ve aksesuar seçimi model ihtiyacına göre yapılır.</p>
        </article>
        <article>
          <ClipboardList size={22} />
          <h3>Kayıtlı takip</h3>
          <p>Servis, müşteri, stok ve fatura süreçleri panel üzerinden izlenir.</p>
        </article>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <section className="about-hero page-section" id="hakkimizda">
        <div>
          <span className="eyebrow">Biz kimiz? · Hakkımızda</span>
          <h2>Serviste titiz, parçada net, müşteride takipçiyiz.</h2>
          <p>
            {business.owner} yönetimindeki {business.brand}; Simav'da motosiklet bakım, arıza
            tespiti, yedek parça tedariği ve aksesuar danışmanlığını tek çatı altında sunar.
            Amacımız; sürücünün motorunu, yapılan işlemi ve ihtiyaç duyduğu parçayı açık şekilde
            takip edebilmesidir.
          </p>
        </div>
      </section>

      <section className="section muted about-deep-section">
        <div className="about-grid">
          <article>
            <Gauge size={24} />
            <h3>Doğru teşhis</h3>
            <p>Servis kayıtları, parça geçmişi ve müşteri notları birlikte değerlendirilir.</p>
          </article>
          <article>
            <Boxes size={24} />
            <h3>Stok disiplini</h3>
            <p>Kritik parçalar için minimum stok uyarıları ve sipariş takibi planlanır.</p>
          </article>
          <article>
            <ClipboardList size={24} />
            <h3>Şeffaf kayıt</h3>
            <p>Fatura, işlem geçmişi ve aylık bilanço panelden tek bakışta görülür.</p>
          </article>
        </div>
      </section>

      <section className="operations-section">
        <div>
          <span className="eyebrow dark">Panel yaklaşımı</span>
          <h2>Sadece vitrin değil, işletme takibi de düşünülüyor.</h2>
          <p>
            Arka panel; ürün takibi, stok yönetimi, müşteri kayıtları, servis süreçleri,
            fatura ve aylık bilanço gibi işletme operasyonlarını tek merkezde toplamak için tasarlanıyor.
          </p>
        </div>
        <div className="operations-list">
          <span><Boxes size={18} /> Ürün ve minimum stok takibi</span>
          <span><User size={18} /> Müşteri kayıtları ve servis geçmişi</span>
          <span><FileText size={18} /> Fatura ve aylık bilanço görünümü</span>
        </div>
      </section>
    </>
  );
}

const faqItems = [
  ["Servis için randevu almam gerekiyor mu?", "Yoğunluğu beklemeden öğrenmek için gelmeden önce telefon veya Instagram üzerinden iletişime geçmenizi öneririz."],
  ["Hangi motosiklet markalarına hizmet veriyorsunuz?", "Model ve işlem uygunluğu değişebildiği için motosikletinizin marka, model ve yıl bilgisini paylaşarak teyit alabilirsiniz."],
  ["Yedek parça siparişi verebilir miyim?", "Evet. Parça kodu veya motosiklet bilgisi üzerinden uyumluluk ve tedarik durumu kontrol edildikten sonra bilgi verilir."],
  ["Sitedeki fiyat ve stok bilgileri kesin mi?", "Fiyat ve stok bilgileri bilgilendirme amaçlıdır. Güncel durum ve ürün uyumluluğu siparişten önce işletme tarafından teyit edilir."],
  ["Servis işlemi ne kadar sürer?", "Süre; yapılacak işlem, parça durumu ve mevcut servis yoğunluğuna göre değişir. İlk kontrol sonrasında tahmini süre paylaşılır."],
  ["Ödeme seçenekleri nelerdir?", "Güncel ödeme seçeneklerini işlem veya ürün alımı öncesinde doğrudan işletmeden öğrenebilirsiniz."],
];

function FaqPage() {
  return (
    <section className="legal-page page-section faq-page">
      <span className="eyebrow">Yardım</span>
      <h1>Sıkça sorulan sorular</h1>
      <p className="legal-lead">Servis, ürün ve parça süreçleriyle ilgili en sık sorulan soruların kısa yanıtları.</p>
      <div className="faq-list">
        {faqItems.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function LegalPage({ type }) {
  const isKvkk = type === "kvkk";
  return (
    <section className="legal-page page-section">
      <span className="eyebrow">Yasal bilgilendirme</span>
      <h1>{isKvkk ? "KVKK Aydınlatma Metni" : "Gizlilik Politikası"}</h1>
      <p className="legal-lead">Son güncelleme: 28 Ağustos 2026</p>
      {isKvkk ? (
        <div className="legal-copy">
          <h2>Veri sorumlusu</h2>
          <p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verileriniz, {business.brand} adına {business.owner} tarafından veri sorumlusu sıfatıyla işlenebilir.</p>
          <h2>İşlenen veriler ve amaçlar</h2>
          <p>Telefon, e-posta veya Instagram üzerinden bizimle iletişim kurmanız hâlinde paylaştığınız kimlik, iletişim, motosiklet ve talep bilgileri; talebinizi yanıtlamak, servis veya ürün sürecini planlamak, kayıtları yürütmek ve yasal yükümlülükleri yerine getirmek amacıyla işlenebilir.</p>
          <h2>Toplama yöntemi ve hukuki sebep</h2>
          <p>Veriler elektronik veya sözlü iletişim kanalları üzerinden elde edilir; sözleşmenin kurulması veya ifası, hukuki yükümlülük, meşru menfaat ve gerektiğinde açık rıza hukuki sebeplerine dayanılarak işlenir.</p>
          <h2>Aktarım ve saklama</h2>
          <p>Veriler yalnızca hizmetin yürütülmesi veya yasal zorunluluk hâlinde yetkili kurumlar, hizmet sağlayıcılar ve iş ortaklarıyla amaçla sınırlı olarak paylaşılabilir; ilgili mevzuatta öngörülen veya işleme amacı için gerekli süre boyunca saklanır.</p>
          <h2>Haklarınız</h2>
          <p>Kanunun 11. maddesi kapsamındaki bilgi alma, düzeltme, silme veya yok etme ve işleme faaliyetlerine itiraz haklarınıza ilişkin taleplerinizi kimliğinizi doğrulamaya elverişli bilgilerle <a href={business.emailHref}>{business.email}</a> adresine veya işletme adresine iletebilirsiniz.</p>
        </div>
      ) : (
        <div className="legal-copy">
          <h2>Site kullanımı</h2>
          <p>Bu internet sitesi ürün ve hizmetler hakkında bilgi vermek ve işletmenin iletişim kanallarına ulaşmanızı sağlamak amacıyla sunulur.</p>
          <h2>Toplanan bilgiler</h2>
          <p>Site üzerinde üyelik, çevrim içi ödeme veya doğrudan mesaj formu bulunmaz. Telefon, e-posta ya da Instagram bağlantılarını kullanmanız hâlinde bilgileriniz ilgili kanalın koşulları ve KVKK Aydınlatma Metnimiz kapsamında değerlendirilir.</p>
          <h2>Teknik veriler ve dış bağlantılar</h2>
          <p>Barındırma ve güvenlik hizmetleri; IP adresi, tarayıcı türü ve erişim zamanı gibi sınırlı teknik kayıtları güvenlik ve hizmet sürekliliği amacıyla işleyebilir. Dış platformların kendi gizlilik uygulamalarından ilgili hizmet sağlayıcı sorumludur.</p>
          <h2>Çerezler</h2>
          <p>Mevcut sürüm reklam veya profilleme çerezi kullanmaz. Zorunlu teknik özellikler eklenirse bu politika güncellenir ve gerektiğinde kullanıcı tercihi alınır.</p>
          <h2>İletişim</h2>
          <p>Gizlilikle ilgili sorularınızı <a href={business.emailHref}>{business.email}</a> adresine iletebilirsiniz.</p>
        </div>
      )}
    </section>
  );
}

function SiteFooter({ setPage }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <strong>MEKA</strong>
          <span>Moto Garage</span>
          <p>Simav'da motosiklet servisi, bakım, yedek parça ve aksesuar desteği.</p>
        </div>
        <div>
          <h2>Hızlı bağlantılar</h2>
          <button type="button" onClick={() => setPage("products")}>Ürünler</button>
          <button type="button" onClick={() => setPage("about")}>Hakkımızda</button>
          <button type="button" onClick={() => setPage("faq")}>Sıkça sorulan sorular</button>
          <button type="button" onClick={() => setPage("contact")}>İletişim</button>
        </div>
        <div>
          <h2>İletişim</h2>
          <a href={business.phoneHref}>{business.phone}</a>
          <a href={business.emailHref}>{business.email}</a>
          <a href={business.instagramHref}>{business.instagram}</a>
          <span>{business.address}, {business.city}</span>
        </div>
        <div>
          <h2>Yasal</h2>
          <button type="button" onClick={() => setPage("kvkk")}>KVKK Aydınlatma Metni</button>
          <button type="button" onClick={() => setPage("privacy")}>Gizlilik Politikası</button>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {business.brand}. Tüm hakları saklıdır.</span>
        <a href="https://uclergnlts.com" target="_blank" rel="noreferrer">Site designed &amp; developed by uclergnlts.com</a>
      </div>
    </footer>
  );
}

function ContactPage() {
  const [appointment, setAppointment] = useState({ name: "", motorcycle: "", request: "" });

  const sendAppointment = (event) => {
    event.preventDefault();
    const message = [
      "Merhaba MEKA Moto Garage, servis randevusu hakkında bilgi almak istiyorum.",
      `Ad: ${appointment.name}`,
      `Motosiklet: ${appointment.motorcycle}`,
      `Talep: ${appointment.request}`,
    ].join("\n");
    window.open(`${business.whatsappHref}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section className="contact-hero page-section" id="iletisim">
        <div>
          <span className="eyebrow">İletişim</span>
          <h2>Parça sor, servis randevusu oluştur.</h2>
          <p>Telefon, e-posta, Instagram veya mağaza ziyaretiyle ürün ve servis bilgisi alabilirsiniz.</p>
          <div className="contact-quick-actions">
            <a className="primary-btn" href={business.phoneHref}><Phone size={18} /> Hemen ara</a>
            <a className="secondary-btn" href={business.whatsappHref} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp</a>
          </div>
        </div>
        <div className="contact-card contact-card-strong">
          <ContactRow icon={<User size={20} />} label="Yetkili" value={business.owner} />
          <ContactRow icon={<Phone size={20} />} label="Telefon" value={business.phone} href={business.phoneHref} />
          <ContactRow icon={<Mail size={20} />} label="E-posta" value={business.email} href={business.emailHref} />
          <ContactRow icon={<Instagram size={20} />} label="Instagram" value={business.instagram} href={business.instagramHref} />
          <ContactRow icon={<MapPin size={20} />} label="Adres" value={`${business.address} · ${business.city}`} />
        </div>
      </section>

      <section className="contact-detail-section">
        <div className="address-panel">
          <span className="eyebrow dark">Mağaza</span>
          <h2>{business.city}</h2>
          <p>{business.address}</p>
          <div className="address-lines">
            <span><Clock size={18} /> Servis ve ürün bilgisi için arayarak teyit alın.</span>
            <span><Wrench size={18} /> Bakım, arıza tespiti, parça ve aksesuar desteği.</span>
          </div>
        </div>
        <a className="map-placeholder" href={business.mapsHref} target="_blank" rel="noreferrer">
          <MapPin size={34} />
          <strong>{business.brand}</strong>
          <span>{business.city}</span>
          <small><Navigation size={16} /> Google Maps'te yol tarifi al</small>
        </a>
      </section>

      <section className="appointment-section">
        <div>
          <span className="eyebrow dark">Hızlı randevu</span>
          <h2>Servis talebini WhatsApp üzerinden ilet.</h2>
          <p>Bilgileri doldurduğunuzda hazır mesaj açılır. Randevu, işletmenin dönüşüyle kesinleşir.</p>
        </div>
        <form className="appointment-form" onSubmit={sendAppointment}>
          <label>Adınız<input value={appointment.name} onChange={(event) => setAppointment({ ...appointment, name: event.target.value })} required /></label>
          <label>Motosiklet marka/model<input value={appointment.motorcycle} onChange={(event) => setAppointment({ ...appointment, motorcycle: event.target.value })} placeholder="Örn. Yamaha MT-07" required /></label>
          <label>Servis talebi<textarea value={appointment.request} onChange={(event) => setAppointment({ ...appointment, request: event.target.value })} placeholder="Bakım veya arıza hakkında kısa bilgi" required /></label>
          <label className="appointment-consent"><input type="checkbox" required /> <span>Bilgilerimin talebimin yanıtlanması amacıyla kullanılmasını ve <a href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</a>'ni okuduğumu kabul ediyorum.</span></label>
          <button className="primary-btn" type="submit"><MessageCircle size={18} /> WhatsApp mesajını hazırla</button>
        </form>
      </section>
    </>
  );
}

function ProductsPreview({ setPage }) {
  return (
    <section className="section" id="urunler">
      <div className="section-heading">
        <div>
          <span className="eyebrow dark">Öne çıkanlar</span>
          <h2>Parça, bakım ve aksesuar</h2>
        </div>
        <button className="outline-btn" type="button" onClick={() => setPage("products")}>
          Tüm ürünler <ChevronRight size={17} />
        </button>
      </div>
      <ProductGrid limit={3} />
    </section>
  );
}

function ProductGrid({ limit, items = products }) {
  const visibleProducts = limit ? items.slice(0, limit) : items;
  const [productImages, setProductImages] = useState(getProductImages);

  useEffect(() => {
    const syncImages = (event) => setProductImages(event.detail ?? getProductImages());
    window.addEventListener(PRODUCT_IMAGES_EVENT, syncImages);
    return () => window.removeEventListener(PRODUCT_IMAGES_EVENT, syncImages);
  }, []);

  return (
    <div className="product-grid">
      {visibleProducts.map((product) => (
        <article className="product-card" key={product.id}>
          <div className={`product-visual ${product.image}`}>
            {productImages[product.id] ? <img src={productImages[product.id]} alt={product.name} /> : <Sparkles size={22} />}
          </div>
          <div className="product-info">
            <span>{product.category}</span>
            <h3>{product.name}</h3>
            <p>{product.brand} · {product.compatibility}</p>
            <div className="product-meta">
              <small>{product.tag}</small>
              <small>Stok: {product.stock}</small>
            </div>
            <div className="product-price-row">
              <strong>{formatCurrency(product.price)}</strong>
              <a href={`${business.whatsappHref}?text=${encodeURIComponent(`Merhaba, ${product.name} hakkında fiyat ve uyumluluk bilgisi almak istiyorum.`)}`} target="_blank" rel="noreferrer">Teklif al</a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function ContactRow({ icon, label, value, href }) {
  const content = (
    <>
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </>
  );

  return href ? (
    <a className="contact-row" href={href}>
      {content}
    </a>
  ) : (
    <div className="contact-row">{content}</div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="stat">
      {icon}
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
