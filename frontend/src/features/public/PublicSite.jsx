import { useState } from "react";
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

export function PublicSite({ page, setPage, setView }) {
  return (
    <main>
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "products" && <ProductsPage />}
      {page === "who" && <WhoPage />}
      {page === "about" && <AboutPage />}
      {page === "contact" && <ContactPage setView={setView} />}
    </main>
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
  const visibleProducts = activeCategory === "Tümü"
    ? products
    : products.filter((product) => product.category === activeCategory);

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
          <div className="search-pill">
            <Search size={17} />
            <span>{visibleProducts.length} ürün listeleniyor</span>
          </div>
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
          <span className="eyebrow">Hakkımızda</span>
          <h2>Serviste titiz, parçada net, müşteride takipçiyiz.</h2>
          <p>
            {business.brand}; motosiklet bakım, arıza tespiti, yedek parça tedariği ve aksesuar
            danışmanlığını tek çatı altında sunar. Amaç; sürücünün motorunu, yapılan işlemi ve
            ihtiyaç duyduğu parçayı açık şekilde takip edebilmesidir.
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

function ContactPage({ setView }) {
  return (
    <>
      <section className="contact-hero page-section" id="iletisim">
        <div>
          <span className="eyebrow">İletişim</span>
          <h2>Parça sor, servis randevusu oluştur.</h2>
          <p>Telefon, e-posta, Instagram veya mağaza ziyaretiyle ürün ve servis bilgisi alabilirsiniz.</p>
          <div className="contact-quick-actions">
            <a className="primary-btn" href={business.phoneHref}><Phone size={18} /> Hemen ara</a>
            <a className="secondary-btn" href={business.instagramHref}><Instagram size={18} /> Instagram</a>
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
        <div className="map-placeholder">
          <MapPin size={34} />
          <strong>{business.brand}</strong>
          <span>{business.city}</span>
        </div>
        <button className="outline-btn" type="button" onClick={() => setView("admin")}>
          Yönetim panelini görüntüle
        </button>
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

  return (
    <div className="product-grid">
      {visibleProducts.map((product) => (
        <article className="product-card" key={product.id}>
          <div className={`product-visual ${product.image}`}>
            <Sparkles size={22} />
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
              <a href={business.phoneHref}>Teklif al</a>
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
