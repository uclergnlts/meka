import { useEffect, useState } from "react";
import {
  Boxes,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Clock,
  ClipboardList,
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
  Timer,
  User,
  Wrench,
} from "lucide-react";
import { business } from "../../data/business.js";
import { categories } from "../../data/catalog.js";
import { api, assetUrl } from "../../services/apiClient.js";
import { useApiResource } from "../../hooks/useApiResource.js";

export function PublicSite({ page, setPage }) {
  const { data: products, error, isLoading } = useApiResource(api.publicProducts, []);
  return (
    <>
      <main>
        {(page === "home" || page === "products") && (error || isLoading) ? <p role="status">{error ? "Ürün listesine şu anda ulaşılamıyor." : "Ürünler yükleniyor…"}</p> : null}
        {page === "home" && <HomePage setPage={setPage} products={products} />}
        {page === "products" && <ProductsPage products={products} />}
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

function HomePage({ setPage, products }) {
  return (
    <>
      <section className="hero hero-pro" id="anasayfa">
        <img
          src="/meka-owner-hero-v2.webp"
          alt="MEKA Moto Garage mağazasında Metin Kalfa"
          fetchPriority="high"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="eyebrow">Simav · Kütahya</span>
          <h1>Motorunuz için doğru parça, güvenilir servis.</h1>
          <p>
            Bakım, yedek parça ve sürüş ekipmanı için doğrudan Metin Kalfa ile
            görüşün. İhtiyacınızı birlikte netleştirelim.
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
            <span><CheckCircle2 size={17} /> Açık bilgilendirme</span>
            <span><CheckCircle2 size={17} /> Modele uygun parça</span>
            <span><CheckCircle2 size={17} /> Doğrudan iletişim</span>
          </div>
        </div>
      </section>

      <section className="service-showcase" aria-label="Hizmet alanları">
        <article>
          <Wrench size={24} />
          <h2>Bakım ve kontrol</h2>
          <p>Yağ, fren, zincir ve genel kontroller motorunuzun ihtiyacına göre ele alınır.</p>
        </article>
        <article>
          <PackageCheck size={24} />
          <h2>Yedek parça</h2>
          <p>Marka ve model bilgisine göre uyumlu parçayı birlikte belirleriz.</p>
        </article>
        <article>
          <ShieldCheck size={24} />
          <h2>Sürüş ekipmanı</h2>
          <p>Kask, eldiven ve günlük kullanım aksesuarlarını mağazada inceleyebilirsiniz.</p>
        </article>
      </section>

      <section className="workshop-flow">
        <div className="section-heading">
          <div>
            <span className="eyebrow dark">Servis süreci</span>
            <h2>Servise geldiğinizde ne olur?</h2>
          </div>
          <button className="outline-btn" type="button" onClick={() => setPage("contact")}>
            İletişime geç <ChevronRight size={17} />
          </button>
        </div>
        <div className="flow-grid">
          <article>
            <CalendarClock size={22} />
            <h3>Önce sizi dinleriz</h3>
            <p>Motorun modeli, yaşadığınız sorun ve beklentiniz üzerinden kısa bir ön görüşme yaparız.</p>
          </article>
          <article>
            <Gauge size={22} />
            <h3>Motoru kontrol ederiz</h3>
            <p>Gerekli kontrollerin ardından yapılacak işlem ve ihtiyaç duyulan parçalar netleşir.</p>
          </article>
          <article>
            <Timer size={22} />
            <h3>Bilgi vererek teslim ederiz</h3>
            <p>Yapılan işlemi açıklarız; sonraki bakım için bilmeniz gerekenleri paylaşırız.</p>
          </article>
        </div>
      </section>

      <section className="brand-strip brand-strip-pro">
        <figure className="brand-photo-inline">
          <img src="/meka-storefront-v1.webp" alt="MEKA Moto Garage mağazası" loading="lazy" />
          <figcaption>Fatih Mahallesi · Simav</figcaption>
        </figure>
        <div>
          <span className="eyebrow dark">İletişim</span>
          <h2>Sorunuzu doğrudan Metin Kalfa'ya iletin.</h2>
          <div className="business-lines">
            <a href={business.phoneHref}><Phone size={18} /> {business.phone}</a>
            <a href={business.emailHref}><Mail size={18} /> {business.email}</a>
            <a href={business.instagramHref}><Instagram size={18} /> {business.instagram}</a>
            <span><MapPin size={18} /> {business.address} · {business.city}</span>
          </div>
        </div>
      </section>

      <ProductsPreview setPage={setPage} products={products} />

      <section className="home-cta">
        <div>
          <span className="eyebrow">Bir sorunuz mu var?</span>
          <h2>Gelmeden önce arayın, uygun zamanı ve stok durumunu öğrenin.</h2>
        </div>
        <button className="primary-btn" type="button" onClick={() => setPage("contact")}>
          İletişim bilgileri <ChevronRight size={18} />
        </button>
      </section>
    </>
  );
}

function ProductsPage({ products }) {
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
          <span className="eyebrow">Mağazadaki ürünler</span>
          <h2>Aradığınız parçayı birlikte bulalım.</h2>
          <p>
            Ürünler hakkında uyumluluk ve stok bilgisini mağazadan veya
            WhatsApp üzerinden öğrenebilirsiniz.
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

function AboutPage() {
  return (
    <>
      <section className="about-hero page-section" id="hakkimizda">
        <div className="about-hero-copy">
          <span className="eyebrow">Biz kimiz? · Hakkımızda</span>
          <h2>Simav'da motosiklet kullanıcılarının yanındayız.</h2>
          <p>
            {business.owner} tarafından işletilen {business.brand}; bakım, parça ve aksesuar
            ihtiyaçlarında kolay ulaşılabilen, ne yapılacağını açıkça anlatan yerel bir motosiklet
            işletmesidir.
          </p>
        </div>
        <figure className="about-team-photo">
          <img
            src="/meka-owner-about-v2.webp"
            alt="Metin Kalfa, MEKA Moto Garage mağaza girişinde"
            loading="lazy"
          />
          <figcaption>
            <strong>{business.owner}</strong>
            <span>{business.brand} · {business.city}</span>
          </figcaption>
        </figure>
      </section>

      <section className="section muted about-deep-section">
        <div className="about-grid">
          <article>
            <Gauge size={24} />
            <h3>Önce doğru ihtiyacı belirleriz</h3>
            <p>Motorun modeli ve kullanım şekline göre yapılacak işlemi birlikte netleştiririz.</p>
          </article>
          <article>
            <Boxes size={24} />
            <h3>Uyumlu parçaya bakarız</h3>
            <p>Parça seçiminde motorunuzun marka, model ve kullanım özelliklerini dikkate alırız.</p>
          </article>
          <article>
            <ClipboardList size={24} />
            <h3>Açık iletişim kurarız</h3>
            <p>İşlem ve ürün hakkında anlaşılır bilgi verir, kararınızı netleştirmenize yardımcı oluruz.</p>
          </article>
        </div>
      </section>

      <section className="operations-section">
        <div>
          <span className="eyebrow dark">Mağazada</span>
          <h2>Günlük kullanım için ihtiyaç duyduğunuz ürünler.</h2>
          <p>
            Marka ve model bilginizle uğradığınızda uygun parça ve ekipman seçeneklerini birlikte
            değerlendirebilir, güncel stok bilgisini doğrudan öğrenebilirsiniz.
          </p>
        </div>
        <div className="operations-list">
          <span><Boxes size={18} /> Yedek parça ve bakım ürünleri</span>
          <span><ShieldCheck size={18} /> Kask ve sürüş ekipmanı</span>
          <span><Wrench size={18} /> Bakım için ön değerlendirme</span>
        </div>
      </section>
    </>
  );
}

const faqItems = [
  ["Servis için randevu almam gerekiyor mu?", "Yoğunluğu beklemeden öğrenmek için gelmeden önce telefon veya Instagram üzerinden iletişime geçmenizi öneririz."],
  ["Hangi motosiklet markalarına hizmet veriyorsunuz?", "Model ve işlem uygunluğu değişebildiği için motosikletinizin marka, model ve yıl bilgisini paylaşarak teyit alabilirsiniz."],
  ["Yedek parça siparişi verebilir miyim?", "Evet. Parça kodu veya motosiklet bilgisi üzerinden uyumluluk ve tedarik durumu kontrol edildikten sonra bilgi verilir."],
  ["Sitedeki stok bilgileri kesin mi?", "Stok bilgileri bilgilendirme amaçlıdır. Güncel durum ve ürün uyumluluğu siparişten önce işletme tarafından teyit edilir."],
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
      <p className="legal-lead">Son güncelleme: 29 Ağustos 2026</p>
      {isKvkk ? (
        <div className="legal-copy">
          <h2>Veri sorumlusu</h2>
          <p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu; {business.address}, {business.city} adresinde faaliyet gösteren, işletme unvanı {business.brand} ve işletme sahibi {business.legalOperator} olan işletmedir.</p>
          <h2>İşletmenin faaliyet alanı</h2>
          <p>İşletmenin ruhsatta kayıtlı faaliyet konusu “{business.licensedActivity}”dır. İşletme, {business.licenseAuthority} tarafından {business.licenseIssueDate} tarihinde düzenlenen işyeri açma ve çalışma ruhsatıyla faaliyet göstermektedir.</p>
          <h2>İşlenen veriler ve amaçlar</h2>
          <p>Telefon, e-posta, WhatsApp veya Instagram üzerinden bizimle iletişim kurmanız hâlinde paylaştığınız ad-soyad, telefon, e-posta, motosiklet ve talep bilgileri; talebinizi yanıtlamak, ürün ve parça uygunluğunu değerlendirmek, sipariş veya müşteri iletişim sürecini yürütmek, muhasebe kayıtlarını oluşturmak ve yasal yükümlülükleri yerine getirmek amacıyla işlenebilir.</p>
          <h2>Toplama yöntemi ve hukuki sebep</h2>
          <p>Veriler mağaza ziyareti, telefon görüşmesi, e-posta, WhatsApp, Instagram ve internet sitesindeki iletişim bağlantıları üzerinden sözlü, yazılı veya elektronik yöntemlerle elde edilir. Veriler; sözleşmenin kurulması veya ifası, hukuki yükümlülüğün yerine getirilmesi, bir hakkın tesisi, kullanılması veya korunması, temel haklara zarar vermemek kaydıyla meşru menfaat ve gerektiğinde açık rıza hukuki sebeplerine dayanılarak işlenir.</p>
          <h2>Aktarım ve saklama</h2>
          <p>Veriler; sipariş ve satış sürecinin yürütülmesi, iletişim hizmetlerinin sağlanması veya yasal zorunlulukların yerine getirilmesi amacıyla yetkili kamu kurumları, mali müşavir, tedarikçi, kargo ve iletişim hizmeti sağlayıcılarıyla yalnızca gerekli ölçüde paylaşılabilir. Veriler ilgili mevzuatta öngörülen veya işleme amacı için gerekli süre boyunca saklanır; sürenin sonunda silinir, yok edilir veya anonim hâle getirilir.</p>
          <h2>Haklarınız</h2>
          <p>Kanunun 11. maddesi kapsamındaki bilgi alma, düzeltme, silme veya yok etme, aktarılan kişileri öğrenme ve işleme faaliyetlerine itiraz haklarınıza ilişkin taleplerinizi kimliğinizi doğrulamaya elverişli bilgilerle <a href={business.emailHref}>{business.email}</a> adresine veya {business.address}, {business.city} adresine iletebilirsiniz.</p>
        </div>
      ) : (
        <div className="legal-copy">
          <h2>Site kullanımı</h2>
          <p>Bu internet sitesi, {business.brand} unvanlı ve {business.legalOperator} tarafından işletilen işyerinin motosiklet parça ve aksesuar ürünleri hakkında bilgi vermesi ve iletişim kanallarına erişim sağlaması amacıyla sunulur.</p>
          <h2>Toplanan bilgiler</h2>
          <p>Site üzerinde üyelik, çevrim içi ödeme veya doğrudan mesaj formu bulunmaz. Telefon, e-posta ya da Instagram bağlantılarını kullanmanız hâlinde bilgileriniz ilgili kanalın koşulları ve KVKK Aydınlatma Metnimiz kapsamında değerlendirilir.</p>
          <h2>Teknik veriler ve dış bağlantılar</h2>
          <p>Barındırma ve güvenlik hizmetleri; IP adresi, tarayıcı türü ve erişim zamanı gibi sınırlı teknik kayıtları güvenlik ve hizmet sürekliliği amacıyla işleyebilir. Dış platformların kendi gizlilik uygulamalarından ilgili hizmet sağlayıcı sorumludur.</p>
          <h2>Çerezler</h2>
          <p>Mevcut sürüm reklam veya profilleme çerezi kullanmaz. Zorunlu teknik özellikler eklenirse bu politika güncellenir ve gerektiğinde kullanıcı tercihi alınır.</p>
          <h2>İletişim</h2>
          <p>Gizlilikle ilgili sorularınızı <a href={business.emailHref}>{business.email}</a> adresine veya {business.address}, {business.city} adresine iletebilirsiniz.</p>
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
        <a className="store-location-photo" href={business.mapsHref} target="_blank" rel="noreferrer">
          <img src="/meka-storefront-v1.webp" alt="MEKA Moto Garage mağaza cephesi" loading="lazy" />
          <span className="store-location-action">
            <strong>{business.brand}</strong>
            <small><Navigation size={16} /> Google Maps'te yol tarifi al</small>
          </span>
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

function ProductsPreview({ setPage, products }) {
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
      <ProductGrid limit={3} items={products} />
    </section>
  );
}

function ProductGrid({ limit, items = [] }) {
  const visibleProducts = limit ? items.slice(0, limit) : items;

  return (
    <div className="product-grid">
      {visibleProducts.map((product) => (
        <article className="product-card" key={product.id}>
          <div className="product-visual">
            {product.image?.startsWith("/uploads/") ? <img src={assetUrl(product.image)} alt={product.name} /> : <PackageCheck size={22} />}
          </div>
          <div className="product-info">
            <span>{product.category}</span>
            <h3>{product.name}</h3>
            <p>{product.brand} · {product.compatibility}</p>
            <div className="product-meta">
              <small>{product.tag}</small>

            </div>
            <div className="product-contact-row">
              <a href={`${business.whatsappHref}?text=${encodeURIComponent(`Merhaba, ${product.name} hakkında bilgi almak istiyorum.`)}`} target="_blank" rel="noreferrer">Bilgi al</a>
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
