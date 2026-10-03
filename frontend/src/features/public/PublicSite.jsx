import { useState } from "react";
import {
  Boxes,
  CalendarClock,
  ChevronRight,
  Clock,
  Gauge,
  Instagram,
  MapPin,
  MessageCircle,
  Navigation,
  PackageCheck,
  PackageSearch,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  Timer,
  Wrench,
  Award,
  X,
  Zap,
} from "lucide-react";
import { business } from "../../data/business.js";
import { categories } from "../../data/catalog.js";
import { api, assetUrl } from "../../services/apiClient.js";
import { useApiResource } from "../../hooks/useApiResource.js";

// The owner's first name the way customers address him in messages ("{ustaAdi()}").
const ustaAdi = () => `${business.owner.split(" ")[0]} Usta`;

export function PublicSite({ page, setPage }) {
  const { data: products, error, isLoading } = useApiResource(api.publicProducts, []);
  return (
    <>
      <main>
        {(page === "home" || page === "products") && (error || isLoading) ? <p className="site-status" role="status">{error ? "Ürün listesine şu anda ulaşılamıyor." : "Ürünler yükleniyor…"}</p> : null}
        {page === "home" && <HomePage setPage={setPage} products={products} />}
        {page === "products" && <ProductsPage products={products} />}
        {page === "about" && <AboutPage />}
        {page === "contact" && <ContactPage />}
        {page === "faq" && <FaqPage />}
        {page === "kvkk" && <LegalPage type="kvkk" setPage={setPage} />}
        {page === "privacy" && <LegalPage type="privacy" setPage={setPage} />}
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
      {/* 1. Hero Section - Bespoke Industrial Workshop */}
      <section className="hero hero-pro" id="anasayfa">
        <img
          src="/meka-owner-hero-v2.webp"
          alt={`MEKA Moto Garage Simav atölyesinde ${business.owner}`}
          fetchPriority="high"
        />
        <div className="hero-overlay" />
        <div className="hero-clean-layout">
          <div className="hero-clean-content">
            <div className="hero-stamp-bar">
              <span className="stamp-code">MEKA // SİMAV</span>
              <span className="stamp-divider">|</span>
              <span className="stamp-text">{business.address.toLocaleUpperCase("tr-TR")}</span>
            </div>

            <h1 className="hero-clean-title">
              Motosikletinize Doğru Teşhis, Dükkânınızda Hazır Parça.
            </h1>

            <p className="hero-clean-desc">
              Gereksiz masraf yok, aracı sekreter yok. Simav'daki atölyemizde doğrudan ustanızla muhatap olun; periyodik bakımını gözünüzün önünde yapalım, aradığınız parçayı raftan anında verelim.
            </p>

            <div className="hero-clean-actions">
              <a href={business.phoneHref} className="hero-btn-phone">
                <Phone size={18} /> Ustayı Ara ({business.phone})
              </a>
              <a
                href={`${business.whatsappHref}?text=${encodeURIComponent(`Selamın aleyküm ${ustaAdi()}, motosikletim için danışmak istiyorum.`)}`}
                target="_blank"
                rel="noreferrer"
                className="hero-btn-wa"
              >
                <MessageCircle size={18} /> WhatsApp ile Parça Sor
              </a>
            </div>

            <div className="hero-clean-strip">
              <span className="hero-clean-strip-item">
                <Wrench size={15} /> {business.owner} Ustalığı
              </span>
              <span className="hero-clean-strip-item">
                <Clock size={15} /> Pzt – Cmt: 08:30 – 19:30
              </span>
              <span className="hero-clean-strip-item">
                <ShieldCheck size={15} /> Orijinal Madeni Yağ &amp; Parça
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Workshop Guarantee Ledger (Replaces floating bubbly pills) */}
      <section className="workshop-guarantee-bar" aria-label="Atölye Garantisi">
        <div className="guarantee-col">
          <span className="guarantee-tag">[ PRENSİP 01 ]</span>
          <h3>Sağlam Parçaya Dokunmayız</h3>
          <p>Çalışan parçayı asla değiştirmeyiz. Neyi neden değiştirdiğimizi eski parçayı göstererek açıklarız.</p>
        </div>
        <div className="guarantee-col">
          <span className="guarantee-tag">[ PRENSİP 02 ]</span>
          <h3>Masrafı Baştan Konuşuruz</h3>
          <p>Tahmini masrafı ve parça alternatiflerini işe başlamadan önce konuşur; sürpriz hesap çıkarmayız.</p>
        </div>
        <div className="guarantee-col">
          <span className="guarantee-tag">[ PRENSİP 03 ]</span>
          <h3>Doğrudan Ustayla Muhatapsınız</h3>
          <p>Aracı yok; motoru dinleyen de lifte alıp anahtarı vuran da doğrudan {business.owner}'dır.</p>
        </div>
      </section>

      {/* 3. Technical Service Ledger (Replaces generic 3 cards) */}
      <section className="workshop-ledger-section" aria-label="Mekanik Servis ve Parça Cetveli">
        <div className="workshop-ledger-wrap">
          <div className="ledger-sidebar">
            <span className="stamp-code">// ATÖLYE & SERVİS LİFTİ</span>
            <h2>Motosikletiniz İçin Dükkânda Ne Yapıyoruz?</h2>
            <p>
              CG 125/150, Scooter, Cup, Küb, Drift, CBF, YBR ve tüm modeller için el emeği, dürüst işçilik ve kaliteli parça montajı.
            </p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a href={business.phoneHref} className="hero-btn-phone">
                <Phone size={17} /> Ustaya Danış ({business.phone})
              </a>
              <button className="hero-btn-parts" type="button" onClick={() => setPage("products")}>
                <Boxes size={16} /> Parçaları Gör
              </button>
            </div>
          </div>

          <div className="ledger-rows">
            <div className="ledger-row">
              <span className="ledger-num">01</span>
              <div className="ledger-body">
                <h3>Madeni Yağ & Periyodik Bakım İstasyonu</h3>
                <p>
                  Gözünüzün önünde kapağı açılan Motul, Castrol ve Putoline 10W-40 / 15W-50 madeni yağlar; yağ filtresi, buji kontrolü, hava filtresi ve zincir temizleme & C4 yağlama.
                </p>
                <div className="ledger-tags">
                  <span className="ledger-tag">Motul 5100 / 7100</span>
                  <span className="ledger-tag">Castrol Power1</span>
                  <span className="ledger-tag">Putoline</span>
                  <span className="ledger-tag">NGK Buji</span>
                  <span className="ledger-tag">Dot4 Hidrolik</span>
                </div>
              </div>
            </div>

            <div className="ledger-row">
              <span className="ledger-num">02</span>
              <div className="ledger-body">
                <h3>Varyatör, Debriyaj & Mekanik Revizyon</h3>
                <p>
                  Scooter varyatör bilya ve kızak bakımı, Bando / Gates kayış değişimi, CG debriyaj balata ve sac setleri, silindir-piston yenileme, conta ve subap ayarı.
                </p>
                <div className="ledger-tags">
                  <span className="ledger-tag">Bando Kayış</span>
                  <span className="ledger-tag">Varyatör Bilyası</span>
                  <span className="ledger-tag">CG Debriyaj Balatası</span>
                  <span className="ledger-tag">Subap Ayarı</span>
                </div>
              </div>
            </div>

            <div className="ledger-row">
              <span className="ledger-num">03</span>
              <div className="ledger-body">
                <h3>Fren, Zincir-Dişli & Yürüyen Aksam</h3>
                <p>
                  Ön ve arka fren balataları, disk ve kampana kontrolü, hidrolik yenileme, zincir gerdirme ve zincir-dişli seti değişimi.
                </p>
                <div className="ledger-tags">
                  <span className="ledger-tag">Ön/Arka Balata</span>
                  <span className="ledger-tag">Fren Diski</span>
                  <span className="ledger-tag">Zincir & Dişli Seti</span>
                  <span className="ledger-tag">Teker Rulmanı</span>
                </div>
              </div>
            </div>

            <div className="ledger-row">
              <span className="ledger-num">04</span>
              <div className="ledger-body">
                <h3>Elektrik, Akü & Sürüş Ekipmanları</h3>
                <p>
                  Kışın tek marşta çalıştıran jel ve kuru motosiklet aküleri, LED zenon far ampulleri, sinyal ve şarj donanımları, ECE 22.06 kasklar ve alarmlı disk kilitleri.
                </p>
                <div className="ledger-tags">
                  <span className="ledger-tag">Jel Akü</span>
                  <span className="ledger-tag">LED Zenon Far</span>
                  <span className="ledger-tag">ECE 22.06 Kask</span>
                  <span className="ledger-tag">Alarmlı Disk Kilidi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Industrial Linear Process Track (Replaces generic step cards) */}
      <section className="workshop-track-section">
        <div className="section-heading">
          <div>
            <span className="stamp-code">// ATÖLYE İŞLEYİŞİ</span>
            <h2>Atölyemizde İşler Nasıl Yürür?</h2>
          </div>
          <p className="section-subtext">
            Sürpriz hesap yok, gizli saklı yok. Motorunuz gözünüzün önünde incelenir.
          </p>
        </div>

        <div className="workshop-track-grid">
          <div className="track-step">
            <div className="track-step-num">
              <span>01 // GİRİŞ</span>
              <CalendarClock size={20} color="var(--meka-red)" />
            </div>
            <h3 className="track-step-title">Motorun Sesini Birlikte Dinleriz</h3>
            <p className="track-step-desc">
              Dükkânın önüne çekin; çekişinde, sesinde veya gidişinde hissettiğiniz şikâyeti dinler, ustalık tecrübemizle ilk teşhisi koyarız.
            </p>
          </div>

          <div className="track-step">
            <div className="track-step-num">
              <span>02 // TEŞHİS</span>
              <Gauge size={20} color="var(--meka-red)" />
            </div>
            <h3 className="track-step-title">Masrafı & Parçayı Baştan Konuşuruz</h3>
            <p className="track-step-desc">
              Gözünüzün önünde söker, ne değişecekse gösteririz. Onayınızı almadan fazladan tek bir vida takıp gereksiz masraf açmayız.
            </p>
          </div>

          <div className="track-step">
            <div className="track-step-num">
              <span>03 // TESLİM</span>
              <Timer size={20} color="var(--meka-red)" />
            </div>
            <h3 className="track-step-title">Test Sürüşü & Eski Parçayla Teslim</h3>
            <p className="track-step-desc">
              Montaj bitince zincir ve frenleri test ederiz. Sökülen eski parçaları elinize teslim ederek güvenle yola uğurlarız.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Brand Storefront Strip (Authentic Simav Esnafı) */}
      <section className="brand-strip brand-strip-pro">
        <figure className="brand-photo-inline">
          <img src="/meka-storefront-v1.webp" alt="MEKA Moto Garage Simav Fatih Mahallesi mağazası" loading="lazy" />
          <div className="brand-photo-badge">
            <span className="status-live-dot" />
            <span>{business.address} · {business.city}</span>
          </div>
        </figure>
        <div className="brand-strip-content">
          <span className="eyebrow red-light">METİN KALFA · MEKA MOTO GARAGE</span>
          <h2>"Simav'da motorcunun halinden anlayan esnafız."</h2>
          <p className="brand-strip-quote">
            "Biz burada sadece civata sıkıp parça satmıyoruz; Simav'ın çayını içmiş, dağını taşını bilen motorcunun yolunu açık tutuyoruz. İster bakım için gelin, ister geçerken uğrayıp bir çayımızı için."
          </p>
          <div className="business-cards-grid">
            <a href={business.phoneHref} className="biz-card">
              <div className="biz-card-icon"><Phone size={19} /></div>
              <div>
                <span className="biz-card-label">Doğrudan Ustayı Arayın</span>
                <strong>{business.phone}</strong>
              </div>
            </a>
            <a
              href={`${business.whatsappHref}?text=${encodeURIComponent(`Selamın aleyküm ${ustaAdi()}, bir parça/motor hakkında danışmak istiyordum.`)}`}
              target="_blank"
              rel="noreferrer"
              className="biz-card whatsapp-highlight"
            >
              <div className="biz-card-icon"><MessageCircle size={19} /></div>
              <div>
                <span className="biz-card-label">WhatsApp'tan Fotoğraf Atın</span>
                <strong>Hemen Mesaj Gönder</strong>
              </div>
            </a>
            <a href={business.mapsHref} target="_blank" rel="noreferrer" className="biz-card">
              <div className="biz-card-icon"><MapPin size={19} /></div>
              <div>
                <span className="biz-card-label">Dükkanın Konumu</span>
                <strong>Google Maps'te Yol Tarifi Al</strong>
              </div>
            </a>
            <a href={business.instagramHref} target="_blank" rel="noreferrer" className="biz-card">
              <div className="biz-card-icon"><Instagram size={19} /></div>
              <div>
                <span className="biz-card-label">Sosyal Medya & Atölye</span>
                <strong>{business.instagram}</strong>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Products Preview */}
      <ProductsPreview setPage={setPage} products={products} />

      {/* 7. Home CTA */}
      <section className="home-cta">
        <div className="home-cta-text">
          <span className="eyebrow red-light">BİR ALO DEYİN, AYIRALIM</span>
          <h2>Yola çıkmadan veya gelmeden önce arayın, parçayı hemen teyit edelim.</h2>
          <p>Simav merkezi, köyleri ve çevre ilçelerden gelecek motorcu dostlarımızın boşuna vakit kaybetmemesi için parça durumunu telefonla hemen netleştiriyoruz.</p>
        </div>
        <div className="home-cta-actions">
          <a href={business.phoneHref} className="primary-btn hero-call-btn">
            <Phone size={18} /> Ustayı Ara: {business.phone}
          </a>
          <a
            href={`${business.whatsappHref}?text=${encodeURIComponent(`Merhaba ${ustaAdi()}, dükkana gelmeden önce bir parça sormak istiyorum.`)}`}
            target="_blank"
            rel="noreferrer"
            className="secondary-btn light"
          >
            <MessageCircle size={18} /> WhatsApp'tan Yaz
          </a>
        </div>
      </section>
    </>
  );
}

function ProductsPage({ products = [] }) {
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [query, setQuery] = useState("");

  const categoryProducts = activeCategory === "Tümü"
    ? products
    : products.filter((product) => product.category === activeCategory);

  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const visibleProducts = normalizedQuery
    ? categoryProducts.filter((product) =>
        [product.name, product.brand, product.category, product.compatibility, product.tag]
          .join(" ")
          .toLocaleLowerCase("tr-TR")
          .includes(normalizedQuery)
      )
    : categoryProducts;

  const categoryIcons = {
    "Tümü": <Boxes size={16} />,
    "Yedek Parça": <Wrench size={16} />,
    "Aksesuar": <ShieldCheck size={16} />,
    "Bakım": <Gauge size={16} />,
    "Elektrik": <Zap size={16} />,
  };

  const getCategoryCount = (cat) => {
    if (cat === "Tümü") return products.length;
    return products.filter((p) => p.category === cat).length;
  };

  const resetFilters = () => {
    setActiveCategory("Tümü");
    setQuery("");
  };

  return (
    <>
      {/* 1. Products Hero */}
      <section className="products-hero page-section">
        <div className="products-hero-content">
          <div className="hero-stamp-bar">
            <span className="stamp-code">MEKA // YEDEK PARÇA DEPOSU</span>
            <span className="stamp-divider">|</span>
            <span className="stamp-text">SİMAV RAFTAN TESLİM &amp; 24 SAATTE TEMİN</span>
          </div>
          <h2>Dükkanda hazır olanlar &amp; depodan getirtilen parçalar.</h2>
          <p>
            Raftaki Motul / Castrol / Putoline madeni yağlar, fren balataları, bujiler, varyatör kayışları ve sürüş aksesuarları.
            Listede göremediğiniz parçayı WhatsApp'tan yazın veya fotoğrafını atın; Simav atölye depomuzdan veya toptancıdan hemen ayıralım.
          </p>
          <div className="workshop-status-board" style={{ marginTop: "24px" }}>
            <div className="status-board-body">
              <div className="status-board-row">
                <span className="status-row-label">Fotoğrafla sorgula</span>
                <span className="status-row-value">Eski parçayı veya ruhsatı WhatsApp'a atın</span>
              </div>
              <div className="status-board-row">
                <span className="status-row-label">Çevre ilçe &amp; köy</span>
                <span className="status-row-value">Hisarcık, Gediz, Emet, Pazarlar ve köylere parça</span>
              </div>
              <div className="status-board-row">
                <span className="status-row-label">Montaj desteği</span>
                <span className="status-row-value">İster raftan al, ister atölyede usta montajı</span>
              </div>
            </div>
          </div>
        </div>

        <div className="product-summary" style={{ borderRadius: "2px", border: "1px solid rgba(255,255,255,0.14)", background: "#111317" }}>
          <div className="product-summary-icon" style={{ borderRadius: "2px", background: "rgba(214,0,0,0.14)", color: "var(--meka-red)" }}>
            <Boxes size={28} />
          </div>
          <div className="product-summary-text">
            <strong style={{ fontFamily: "monospace, monospace", color: "#ffffff" }}>{products.length}</strong>
            <span style={{ fontFamily: "monospace, monospace", textTransform: "uppercase", letterSpacing: "0.04em" }}>Vitrindeki Parça Sayısı</span>
            <small style={{ color: "#8a90a0" }}>Dükkanda ve depomuzda sürekli yenilenen mekanik stok</small>
          </div>
        </div>
      </section>

      {/* 2. Products Section with Filter & Search */}
      <section className="section products-section">
        <div className="product-toolbar-wrap">
          <div className="product-toolbar-top">
            <div>
              <span className="eyebrow dark">PARÇA & AKSESUAR VİTRİNİ</span>
              <h2>Hemen Teslim Ürünler</h2>
            </div>
            <div className="product-search-container">
              <div className="product-search-input-wrap">
                <Search size={18} className="search-icon" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Örn: 10W-40 Motul, CG debriyaj, scooter kayış, balata, buji..."
                  aria-label="Ürün ara"
                />
                {query && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setQuery("")}
                    aria-label="Aramayı temizle"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <span className="search-result-count">
                <strong>{visibleProducts.length}</strong> ürün listeleniyor
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="category-tabs-row" aria-label="Ürün kategorileri">
            <div className="category-tabs">
              {categories.map((category) => {
                const count = getCategoryCount(category);
                const isActive = activeCategory === category;
                return (
                  <button
                    className={`category-tab-btn ${isActive ? "active" : ""}`}
                    type="button"
                    key={category}
                    onClick={() => setActiveCategory(category)}
                  >
                    <span className="tab-icon">{categoryIcons[category] || <Boxes size={16} />}</span>
                    <span>{category}</span>
                    <span className="tab-badge">{count}</span>
                  </button>
                );
              })}
            </div>

            {(activeCategory !== "Tümü" || query) && (
              <button
                type="button"
                className="filter-reset-btn"
                onClick={resetFilters}
              >
                <RotateCcw size={14} /> Filtreleri Temizle
              </button>
            )}
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {visibleProducts.length > 0 ? (
          <ProductGrid items={visibleProducts} />
        ) : (
          <div className="product-empty-state">
            <div className="empty-icon-wrap">
              <PackageSearch size={44} />
            </div>
            <h3>Aradığınız Parça Sitede Görünmüyor mu?</h3>
            <p>
              Dükkanımızdaki binlerce kalem civata, conta, tel, dişli ve parçayı tek tek siteye eklemek mümkün olmuyor.
              <br />
              <strong>{query ? `"${query}"` : "Aradığınız parçanın"}</strong> veya motor ruhsatınızın fotoğrafını WhatsApp'tan {ustaAdi()}'ya gönderin, rafta varsa hemen ayıralım, yoksa 24 saat içinde depodan getirtelim.
            </p>
            <div className="empty-state-actions">
              <a
                className="primary-btn"
                href={`${business.whatsappHref}?text=${encodeURIComponent(`Selamın aleyküm {ustaAdi()}, sitede ${query ? `"${query}"` : "bir parça"} baktım göremedim. Dükkanda veya depoda var mı, fotoğrafını atayım mı?`)}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={17} /> WhatsApp'tan Fotoğraf At & Sor
              </a>
              <button
                type="button"
                className="secondary-btn light"
                onClick={resetFilters}
              >
                <RotateCcw size={16} /> Tüm Ürünleri Göster
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 3. Custom Part Request Banner */}
      <section className="part-request-strip">
        <div className="part-request-content">
          <div className="hero-stamp-bar" style={{ justifyContent: "center", marginBottom: "16px" }}>
            <span className="stamp-code">MEKA // ÖZEL SİPARİŞ</span>
            <span className="stamp-divider">|</span>
            <span className="stamp-text">SİMAV &amp; ÇEVRE İLÇELER DEPO TEDARİK</span>
          </div>
          <h2>Özel Sipariş veya Nadir Parçalar</h2>
          <p>
            Eski kasa, CG, Küb, Scooter, Japon veya Çin grubu motosikletinizin parçasını bulamadıysanız dert etmeyin.
            Modeli, yılı ve motor numarasını iletin; Simav sanayisindeki depomuzdan veya toptancılarımızdan en hızlı şekilde temin edelim.
          </p>
          <div className="part-request-actions">
            <a
              className="primary-btn hero-call-btn"
              href={`${business.whatsappHref}?text=${encodeURIComponent(`Selamın aleyküm ${ustaAdi()}, motorum için özel bir parça siparişi vermek/danışmak istiyorum.`)}`}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} /> WhatsApp ile Parça İste
            </a>
            <a href={business.phoneHref} className="secondary-btn light">
              <Phone size={18} /> Ustayı Ara ({business.phone})
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <section className="about-hero page-section" id="hakkimizda">
        <div className="about-hero-copy">
          <div className="hero-stamp-bar">
            <span className="stamp-code">MEKA // HİKÂYEMİZ</span>
            <span className="stamp-divider">|</span>
            <span className="stamp-text">SİMAV ESNAF GARAYI</span>
          </div>
          <h2>Motosikletin dilinden anlayan, sözünün arkasında duran dükkân.</h2>
          <p>
            Simav Fatih Mahallesi Yeni Cami Caddesi'ndeki atölyemizde; tarlada kullanılan CG'den çarşı-pazar scooter'ına,
            vitesli touring motordan köylerden gelen emektarlara kadar her araca dürüstlükle ve el emeğiyle bakıyoruz.
            Büyük şehirlerin steril plazaları gibi değil; kokusunu aldığınız yağın, gözünüzün önünde takılan parçanın,
            doğrudan ustasıyla konuşulan hesabın dükkânıyız.
          </p>
          <div style={{ marginTop: "24px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span className="ledger-tag">Usta: {business.owner}</span>
            <span className="ledger-tag">Simav / Kütahya</span>
            <span className="ledger-tag">{business.address}</span>
            <span className="ledger-tag">Ruhsat No: {business.licenseSequenceNumber ?? "43"}</span>
          </div>
        </div>
        <figure className="about-team-photo">
          <img
            src="/meka-owner-about-v2.webp"
            alt={`${business.owner}, MEKA Moto Garage mağaza girişinde`}
            loading="lazy"
          />
          <figcaption>
            <strong>{business.owner}</strong>
            <span>{business.brand} · {business.address}, {business.city}</span>
          </figcaption>
        </figure>
      </section>

      {/* 2. Atölye İş Ahlakı Kılavuzu (Ruled Ledger - Replaces AI cards) */}
      <section className="workshop-ledger-section" aria-label="Atölye İş Ahlakı">
        <div className="workshop-ledger-wrap">
          <div className="ledger-sidebar">
            <span className="stamp-code">// ATÖLYE İŞ AHLAKI</span>
            <h2>Nasıl Çalışırız, Neye Söz Veririz?</h2>
            <p>
              Motosikletinizi Simav'daki atölyemize bıraktığınızda kafanızda soru işareti kalmasın diye benimsediğimiz değişmez esnaf ilkeleri.
            </p>
            <a href={business.phoneHref} className="hero-btn-phone">
              <Phone size={17} /> Ustaya Danış ({business.phone})
            </a>
          </div>

          <div className="ledger-rows">
            <div className="ledger-row">
              <span className="ledger-num">01</span>
              <div className="ledger-body">
                <h3>Sökülen Eski Parça Poşetinde Teslim Edilir</h3>
                <p>
                  Değişen buji, fren balatası, varyatör bilyası veya debriyaj sacı; ne değiştiyse çıkan eski parça bagajınıza konur. Gözünüzle görmediğiniz hiçbir parçaya "değiştirdik" demeyiz.
                </p>
                <div className="ledger-tags">
                  <span className="ledger-tag">Şeffaf Teslim</span>
                  <span className="ledger-tag">Eski Parça İadesi</span>
                </div>
              </div>
            </div>

            <div className="ledger-row">
              <span className="ledger-num">02</span>
              <div className="ledger-body">
                <h3>Çalışan Sağlam Parçaya Asla Dokunulmaz</h3>
                <p>
                  Ömrü bitmemiş, temizlenip ayarlanarak tıkır tıkır çalışacak parçayı masraf yazmak için değiştirmeyiz. Neyse onu söyler, gereksiz hesap açmayız.
                </p>
                <div className="ledger-tags">
                  <span className="ledger-tag">Gereksiz Masraf Yok</span>
                  <span className="ledger-tag">Ayar & Temizlik Önceliği</span>
                </div>
              </div>
            </div>

            <div className="ledger-row">
              <span className="ledger-num">03</span>
              <div className="ledger-body">
                <h3>Masraf ve Parça Alternatifleri Baştan Konuşulur</h3>
                <p>
                  Sürpriz hesap çıkmaz. Motoru lifte alıp arızayı tespit ettiğimizde yapılacak işlemi, orijinal veya kaliteli muadil parça fiyatlarını baştan söyleriz. Onayınız olmadan fazladan tek bir vida takılmaz.
                </p>
                <div className="ledger-tags">
                  <span className="ledger-tag">Açık Hesap</span>
                  <span className="ledger-tag">Önceden Onay</span>
                </div>
              </div>
            </div>

            <div className="ledger-row">
              <span className="ledger-num">04</span>
              <div className="ledger-body">
                <h3>Köy ve Çevre İlçelerden Gelene Hızlı Öncelik</h3>
                <p>
                  Hisarcık, Gediz, Emet veya Simav dağ köylerinden günübirlik çarşıya inen motosiklet sürücülerimizi bekletmemeye gayret eder, aynı gün yoluna devam etmesini sağlarız.
                </p>
                <div className="ledger-tags">
                  <span className="ledger-tag">Aynı Gün Teslim</span>
                  <span className="ledger-tag">Hisarcık · Gediz · Emet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Dükkan ve Lifte Neler Var */}
      <section className="garage-capabilities-section">
        <div className="section-heading">
          <div>
            <span className="stamp-code">// PARÇA & DONANIM STANDARTLARI</span>
            <h2>Vitrinde ve Lifte Neler Var?</h2>
          </div>
          <p className="section-subtext">
            Motosikletiniz ister günlük çarşı-pazar aracı, ister arazide kullanılan emektar, isterse haftasonu turlanan vitesli yol motoru olsun; her aşamada çözümler hazır.
          </p>
        </div>

        <div className="garage-capabilities-grid">
          <div className="garage-cap-card">
            <div className="cap-card-header">
              <div className="cap-card-icon">
                <Boxes size={22} />
              </div>
              <h3>Madeni Yağ İstasyonu</h3>
            </div>
            <p>
              4 zamanlı motosikletler ve scooterlar için tam sentetik ve yarı sentetik kaliteli motor yağları; yağ filtreleri, zincir temizleme ve yağlama spreyleri daima rafta.
            </p>
            <div className="cap-card-tags">
              <span className="cap-tag">Motul 5100 / 7100</span>
              <span className="cap-tag">Castrol Power1</span>
              <span className="cap-tag">Putoline 10W-40 / 15W-50</span>
              <span className="cap-tag">Dot4 Fren Hidroliği</span>
            </div>
          </div>

          <div className="garage-cap-card">
            <div className="cap-card-header">
              <div className="cap-card-icon">
                <Wrench size={22} />
              </div>
              <h3>Mekanik, Varyatör & Aktarma</h3>
            </div>
            <p>
              Scooter varyatör bilya ve kızak bakımı, Bando/Gates kayış değişimi, CG debriyaj balatası, subap ayarı, karbüratör temizliği ve fren sistem revizyonu.
            </p>
            <div className="cap-card-tags">
              <span className="cap-tag">Debriyaj Balataları</span>
              <span className="cap-tag">Varyatör Kayış & Bilya</span>
              <span className="cap-tag">Fren Disk & Balata</span>
              <span className="cap-tag">Zincir Dişli Setleri</span>
            </div>
          </div>

          <div className="garage-cap-card">
            <div className="cap-card-header">
              <div className="cap-card-icon">
                <ShieldCheck size={22} />
              </div>
              <h3>Kask & Sürüş Ekipmanları</h3>
            </div>
            <p>
              Güvenliğiniz için güncel standartlara uygun kasklar, korumalı eldivenler, titreşim engelleyici telefon tutucular ve yüksek sesli alarmlı disk kilitleri.
            </p>
            <div className="cap-card-tags">
              <span className="cap-tag">ECE 22.06 Kasklar</span>
              <span className="cap-tag">Korumalı Eldivenler</span>
              <span className="cap-tag">Alarmlı Disk Kilidi</span>
              <span className="cap-tag">Su Geçirmez Telefon Tutucu</span>
            </div>
          </div>

          <div className="garage-cap-card">
            <div className="cap-card-header">
              <div className="cap-card-icon">
                <Zap size={22} />
              </div>
              <h3>Elektrik, Akü & Donanım</h3>
            </div>
            <p>
              Motosikletinizin kışın tek marşta çalışması için jel ve kuru aküler, NGK bujiler, konjektörler, şarj dinamosu tamiri ve yüksek ışıklı LED far sistemleri.
            </p>
            <div className="cap-card-tags">
              <span className="cap-tag">Jel Motosiklet Aküleri</span>
              <span className="cap-tag">NGK Orijinal Buji</span>
              <span className="cap-tag">LED Zenon Far</span>
              <span className="cap-tag">Sinyal & Stop Grupları</span>
            </div>
          </div>
        </div>

        {/* Simav & Köyler Destek Notu */}
        <div className="region-support-strip">
          <div className="region-support-text">
            <strong>Simav Köyleri, Hisarcık, Gediz ve Emet İçin Hızlı Destek</strong>
            <p>
              Merkeze uzak köylerden ve çevre ilçelerden gelen motosiklet sahiplerini bekletmemeye gayret ediyor; parça lazımsa elden veya minibüs/kargo ile ulaştırıyoruz.
            </p>
          </div>
          <a
            href={`${business.whatsappHref}?text=${encodeURIComponent(`Selamın aleyküm ${ustaAdi()}, köyden geliyorum / çevre ilçeden parça danışmak istiyorum.`)}`}
            target="_blank"
            rel="noreferrer"
            className="secondary-btn light"
            style={{ whiteSpace: "nowrap" }}
          >
            <MessageCircle size={16} /> WhatsApp'tan Danış
          </a>
        </div>
      </section>

      {/* 4. Sıcak Kapanış CTA */}
      <section className="home-cta" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="home-cta-text">
          <span className="stamp-code">// KAPIMIZ AÇIK</span>
          <h2>Bir çayımızı içmeye, motorun sesini dinletmeye bekleriz.</h2>
          <p>
            Parça almasanız bile aklınıza takılan arıza veya bakım konusunu danışmak için Simav Yeni Cami Caddesi'ndeki
            dükkânımıza uğrayabilir veya telefonla {ustaAdi()}'ya doğrudan ulaşabilirsiniz.
          </p>
        </div>
        <div className="home-cta-actions">
          <a href={business.phoneHref} className="hero-btn-phone">
            <Phone size={18} /> Hemen Ara ({business.phone})
          </a>
          <a
            href={`${business.whatsappHref}?text=${encodeURIComponent(`Selamın aleyküm ${ustaAdi()}, dükkanınıza uğramak istiyorum.`)}`}
            target="_blank"
            rel="noreferrer"
            className="hero-btn-wa"
          >
            <MessageCircle size={18} /> WhatsApp'tan Konum İste
          </a>
        </div>
      </section>
    </>
  );
}

const faqItems = [
  ["Dükkana gelmeden önce aramam gerekir mi?", "Atölyemiz Pazartesi'den Cumartesi'ye 08:30 – 19:30 arası açıktır. Özellikle lifte alınacak detaylı mekanik işler veya acil parça ayırtmak için gelmeden önce telefon veya WhatsApp'tan bir alo derseniz beklemeden doğrudan işleme alabiliriz."],
  ["Hangi motosiklet modellerine ve markalarına bakıyorsunuz?", "Simav ve çevresinde yaygın kullanılan CG 125/150 serisi, 50cc-125cc-150cc Scooter grubu, Cup / Küb modelleri, Drift L, Honda CBF, Yamaha YBR ve Pulsar başta olmak üzere pek çok yerli ve ithal motosikletin periyodik bakımı, varyatör ayarı ve mekanik onarımını yapıyoruz."],
  ["Dükkanda olmayan özel veya nadir bir parçayı getirtebilir miyim?", "Evet. Eski kasa, nadir veya orijinal parça arıyorsanız; motor ruhsatınızı veya eski parçanın fotoğrafını WhatsApp'tan iletmeniz yeterli. 24 ila 48 saat içinde toptancı ve depolardan dükkanımıza getirtip teslim ediyoruz."],
  ["Sitedeki parçaları doğrudan dükkandan elden alabilir miyim?", "Tabii ki. Sitede vitrinde olan tüm madeni yağ, kask, kayış, buji ve yedek parçaları Simav Yeni Cami Caddesi'ndeki dükkanımızdan hemen teslim alabilir, dilerseniz atölyemizde montajını da yaptırabilirsiniz."],
  ["Periyodik bakım ve yağ değişimi ne kadar sürer?", "Madeni yağ değişimi, buji kontrolü, zincir gerdirme ve fren ayarı gibi rutin periyodik bakımlar genellikle 20-30 dakika içinde tamamlanır. Ağır motor revizyonları için motoru inceledikten sonra ustanız net süre verir."],
  ["Simav köylerine veya çevre ilçelere parça gönderimi yapıyor musunuz?", "Evet. Hisarcık, Gediz, Emet veya Simav'ın köylerinden gelen parça taleplerinde; WhatsApp'tan parçayı teyit edip kargo ya da Simav merkezden elden teslimat ile ulaştırabiliyoruz."],
];

// Shared header of the FAQ and legal pages: the same stamp bar and dark band as the other pages, kept short.
function InfoHero({ code, label, title, children }) {
  return (
    <section className="info-hero">
      <div className="hero-stamp-bar">
        <span className="stamp-code">{code}</span>
        <span className="stamp-divider">|</span>
        <span className="stamp-text">{label}</span>
      </div>
      <h1>{title}</h1>
      <p>{children}</p>
    </section>
  );
}

function InfoHelp({ title, children }) {
  return (
    <div className="info-help">
      <div>
        <strong>{title}</strong>
        <span>{children}</span>
      </div>
      <div className="info-help-actions">
        <a href={business.phoneHref} className="hero-btn-phone">
          <Phone size={17} /> {business.phone}
        </a>
        <a href={business.whatsappHref} target="_blank" rel="noreferrer" className="hero-btn-wa">
          <MessageCircle size={17} /> WhatsApp
        </a>
      </div>
    </div>
  );
}

function FaqPage() {
  return (
    <>
      <InfoHero code="MEKA // YARDIM" label="SORU & CEVAP" title="Sıkça sorulan sorular">
        Servis, ürün ve parça süreçleriyle ilgili en sık sorulan soruların kısa yanıtları.
      </InfoHero>
      <section className="info-body">
        <div className="info-body-inner">
          <div className="faq-list">
            {faqItems.map(([question, answer], index) => (
              <details key={question}>
                <summary>
                  <span className="faq-question">
                    <span className="faq-num">{String(index + 1).padStart(2, "0")}</span>
                    <span>{question}</span>
                  </span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
          <InfoHelp title="Sorunuz burada yok mu?">Arayın veya WhatsApp'tan yazın, ustası yanıtlasın.</InfoHelp>
        </div>
      </section>
    </>
  );
}

function LegalPage({ type, setPage }) {
  const isKvkk = type === "kvkk";
  const openPage = (page) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <InfoHero
        code="MEKA // YASAL"
        label={isKvkk ? "KVKK" : "GİZLİLİK"}
        title={isKvkk ? "KVKK Aydınlatma Metni" : "Gizlilik Politikası"}
      >
        Son güncelleme: {isKvkk ? "29 Ağustos 2026" : "2 Ekim 2026"}
      </InfoHero>
      <section className="info-body">
        <div className="info-body-inner">
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
              <p>Site üzerinde üyelik veya çevrim içi ödeme bulunmaz. İletişim sayfasındaki randevu formu yazdıklarınızı sitede saklamaz; yalnızca sizin göndereceğiniz bir WhatsApp mesajı hazırlar. Telefon, e-posta, WhatsApp ya da Instagram bağlantılarını kullanmanız hâlinde bilgileriniz ilgili kanalın koşulları ve KVKK Aydınlatma Metnimiz kapsamında değerlendirilir.</p>
              <h2>Teknik veriler ve dış bağlantılar</h2>
              <p>Barındırma ve güvenlik hizmetleri; IP adresi, tarayıcı türü ve erişim zamanı gibi sınırlı teknik kayıtları güvenlik ve hizmet sürekliliği amacıyla işleyebilir. Dış platformların kendi gizlilik uygulamalarından ilgili hizmet sağlayıcı sorumludur.</p>
              <h2>Çerezler</h2>
              <p>Mevcut sürüm reklam veya profilleme çerezi kullanmaz. Zorunlu teknik özellikler eklenirse bu politika güncellenir ve gerektiğinde kullanıcı tercihi alınır.</p>
              <h2>İletişim</h2>
              <p>Gizlilikle ilgili sorularınızı <a href={business.emailHref}>{business.email}</a> adresine veya {business.address}, {business.city} adresine iletebilirsiniz.</p>
            </div>
          )}
          <div className="info-related">
            <span>İlgili sayfalar</span>
            <button type="button" onClick={() => openPage(isKvkk ? "privacy" : "kvkk")}>
              {isKvkk ? "Gizlilik Politikası" : "KVKK Aydınlatma Metni"} <ChevronRight size={15} />
            </button>
            <button type="button" onClick={() => openPage("faq")}>
              Sıkça sorulan sorular <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function SiteFooter({ setPage }) {
  return (
    <footer className="site-footer">
      {/* 1. Pre-footer Quick Assistance Strip */}
      <div className="footer-assist-strip">
        <div className="assist-strip-content">
          <div className="assist-icon-circle">
            <MessageCircle size={24} />
          </div>
          <div className="assist-strip-text">
            <strong>Motosikletiniz için aradığınız parçayı bulamadınız mı?</strong>
            <p>Eski parçanın veya ruhsatın fotoğrafını WhatsApp'tan gönderin, raftan kontrol edip hemen ayıralım.</p>
          </div>
        </div>
        <div className="assist-strip-actions">
          <a
            href={`${business.whatsappHref}?text=${encodeURIComponent(`Selamın aleyküm ${ustaAdi()}, motosikletim için bir parça danışmak istiyorum.`)}`}
            target="_blank"
            rel="noreferrer"
            className="assist-wa-btn"
          >
            <MessageCircle size={16} /> WhatsApp'tan Fotoğraf At
          </a>
          <a href={business.phoneHref} className="primary-btn assist-call-btn">
            <Phone size={16} /> Ustayı Ara ({business.phone})
          </a>
        </div>
      </div>

      {/* 2. Main 4-Column Footer */}
      <div className="footer-main-grid">
        {/* Col 1: Brand & Character */}
        <div className="footer-col footer-col-brand">
          <div className="footer-brand-title">
            <strong>MEKA<span className="brand-dot">.</span></strong>
            <span className="brand-sub">MOTO GARAGE · SİMAV</span>
          </div>
          <p className="footer-brand-desc">
            Simav Yeni Cami Caddesi'nde motosiklet mekanik bakımı, arıza tespiti ve kaliteli orijinal/muadil yedek parça vitrini.
            {business.owner} ustalığıyla doğrudan ustanızla muhatap olun.
          </p>
          <div className="footer-live-badge">
            <span className="status-live-dot" />
            <span>Pzt – Cmt: 08:30 – 19:30 · Pazar telefon açık</span>
          </div>
          <div className="footer-social-links">
            <a href={business.whatsappHref} target="_blank" rel="noreferrer" className="footer-social-btn whatsapp" title="WhatsApp Danışma">
              <MessageCircle size={18} />
            </a>
            <a href={business.instagramHref} target="_blank" rel="noreferrer" className="footer-social-btn instagram" title="Instagram">
              <Instagram size={18} />
            </a>
            <a href={business.phoneHref} className="footer-social-btn phone" title="Telefonla Ara">
              <Phone size={18} />
            </a>
            <a href={business.mapsHref} target="_blank" rel="noreferrer" className="footer-social-btn maps" title="Google Maps Konumu">
              <Navigation size={18} />
            </a>
          </div>
        </div>

        {/* Col 2: Hızlı Bağlantılar */}
        <div className="footer-col">
          <h3 className="footer-heading">Hızlı Erişim</h3>
          <ul className="footer-nav-list">
            <li><button type="button" onClick={() => { setPage("home"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Ana Sayfa</button></li>
            <li><button type="button" onClick={() => { setPage("products"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Vitrindeki Parçalar</button></li>
            <li><button type="button" onClick={() => { setPage("about"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Hakkımızda & Hikâyemiz</button></li>
            <li><button type="button" onClick={() => { setPage("contact"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>İletişim & Konum</button></li>
            <li><button type="button" onClick={() => { setPage("faq"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Sıkça Sorulan Sorular</button></li>
          </ul>
        </div>

        {/* Col 3: Atölye & Stok Grupları */}
        <div className="footer-col">
          <h3 className="footer-heading">Atölye & Stok</h3>
          <ul className="footer-service-list">
            <li><Boxes size={14} /> <span>Motul & Castrol Motor Yağları</span></li>
            <li><Wrench size={14} /> <span>Varyatör Kayış & Bilya Bakımı</span></li>
            <li><ShieldCheck size={14} /> <span>Debriyaj & Zincir-Dişli Seti</span></li>
            <li><Gauge size={14} /> <span>Fren Balata, Disk & Kampana</span></li>
            <li><Zap size={14} /> <span>Jel Akü, Buji & LED Far Grubu</span></li>
            <li><Award size={14} /> <span>ECE Kask & Alarmlı Disk Kilidi</span></li>
          </ul>
        </div>

        {/* Col 4: İletişim & Simav Konumu */}
        <div className="footer-col footer-col-contact">
          <h3 className="footer-heading">Atölye & Konum</h3>
          <div className="footer-contact-items">
            <a href={business.phoneHref} className="footer-contact-item">
              <Phone size={17} className="contact-icon" />
              <div>
                <strong>{business.phone}</strong>
                <small>{business.owner} (Hemen Ara)</small>
              </div>
            </a>
            <a href={business.whatsappHref} target="_blank" rel="noreferrer" className="footer-contact-item">
              <MessageCircle size={17} className="contact-icon wa-color" />
              <div>
                <strong>WhatsApp Parça Hattı</strong>
                <small>Fotoğraf gönderin, kontrol edelim</small>
              </div>
            </a>
            <a href={business.mapsHref} target="_blank" rel="noreferrer" className="footer-contact-item">
              <MapPin size={17} className="contact-icon" />
              <div>
                <strong>{business.address}</strong>
                <small>{business.city} · Haritada Aç</small>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Footer Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-left">
          <span>© {new Date().getFullYear()} {business.brand}. Tüm hakları saklıdır.</span>
          <span className="footer-license-note">{business.licenseAuthority} Ruhsat No: {business.licenseSequenceNumber} · {business.licensedActivity}</span>
        </div>
        <div className="footer-bottom-links">
          <button type="button" onClick={() => { setPage("kvkk"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>KVKK Aydınlatma</button>
          <span className="dot-divider">•</span>
          <button type="button" onClick={() => { setPage("privacy"); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Gizlilik Politikası</button>
          <span className="dot-divider">•</span>
          <a href="https://uclergnlts.com" target="_blank" rel="noreferrer">designed &amp; developed by uclergnlts.com</a>
        </div>
      </div>
    </footer>
  );
}

function ContactPage() {
  const [appointment, setAppointment] = useState({ name: "", motorcycle: "", serviceType: "Periyodik Bakım & Yağ Değişimi", request: "" });

  const sendAppointment = (event) => {
    event.preventDefault();
    const message = [
      "MEKA MOTO GARAGE // SERVİS İŞ EMRİ",
      "----------------------------------",
      `Müşteri: ${appointment.name}`,
      `Motosiklet: ${appointment.motorcycle}`,
      `Talep Türü: ${appointment.serviceType}`,
      `Arıza/İstek: ${appointment.request}`,
      "----------------------------------",
      `Simav Atölyesi / ${business.owner} Ustalığıyla`,
    ].join("\n");
    window.open(`${business.whatsappHref}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <section className="contact-desk-section page-section" id="iletisim">
        <div className="hero-stamp-bar" style={{ maxWidth: "1400px", margin: "0 auto 24px" }}>
          <span className="stamp-code">MEKA // SERVİS KABUL &amp; DANIŞMA</span>
          <span className="stamp-divider">|</span>
          <span className="stamp-text">{business.address.toLocaleUpperCase("tr-TR")} · {business.city.toLocaleUpperCase("tr-TR")}</span>
        </div>

        <div className="contact-desk-layout">
          {/* Left Column: Workshop Board & Direct Dialer */}
          <div className="contact-desk-board">
            <h1 className="contact-desk-title">Atölye İrtibat &amp; Doğrudan Usta Masası</h1>
            <p className="contact-desk-subtitle">
              Aracı sekreter, santral veya çağrı merkezi yok. Simav Yeni Cami Caddesi'ndeki atölyemizde
              motor başında çalışan {ustaAdi()}'ya doğrudan ulaşırsınız.
            </p>

            {/* Direct Phone Billboard */}
            <div className="contact-dialer-billboard">
              <div className="dialer-label">
                <span className="dialer-live-dot" />
                <span>STASYON: 01 // METİN KALFA DİREKT HAT</span>
              </div>
              <a href={business.phoneHref} className="dialer-number">
                {business.phone}
              </a>
              <div className="dialer-caption">
                Mekanik arıza, bakım sırası, yolda kalma veya parça stok sorgusu için doğrudan arayabilirsiniz.
              </div>
              <div className="dialer-actions">
                <a href={business.phoneHref} className="dialer-call-btn">
                  <Phone size={15} /> Hemen Ara ({business.phone})
                </a>
                <a
                  href={`${business.whatsappHref}?text=${encodeURIComponent(`Selamın aleyküm ${ustaAdi()}, motosikletim için danışmak istiyorum.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="dialer-wa-btn"
                >
                  <MessageCircle size={15} /> WhatsApp'tan Yaz
                </a>
              </div>
            </div>

            {/* Technical Information Ledger */}
            <div className="contact-info-ledger">
              <div className="contact-info-row">
                <span className="row-label">[KONUM &amp; ADRES]</span>
                <span className="row-val">
                  <strong>{business.address}</strong> · {business.city}
                </span>
              </div>
              <div className="contact-info-row">
                <span className="row-label">[ÇALIŞMA DÜZENİ]</span>
                <span className="row-val">
                  <strong>Pazartesi – Cumartesi 08:30 – 19:30</strong> (Atölye Açık) <br />
                  Pazar günleri acil mekanik destek telefon hattı devrededir.
                </span>
              </div>
              <div className="contact-info-row">
                <span className="row-label">[KÖY &amp; ÇEVRE İLÇE]</span>
                <span className="row-val">
                  Gediz, Demirci, Şaphane, Pazarlar, Hisarcık ve çevre köylerden gelen motorlara
                  gün içi arıza tespit ve parça önceliği sağlanır.
                </span>
              </div>
              <div className="contact-info-row">
                <span className="row-label">[PARÇA FOTOĞRAFI]</span>
                <span className="row-val">
                  Aradığınız parçanın veya motor ruhsatınızın fotoğrafını WhatsApp'tan atın, rafta varsa anında ayıralım.
                </span>
              </div>
            </div>

            {/* Physical Storefront Block */}
            <div className="contact-storefront-block">
              <img src="/meka-storefront-v1.webp" alt="MEKA Moto Garage Atölye Cephesi" loading="lazy" />
              <div className="contact-storefront-overlay">
                <div>
                  <strong>MEKA Moto Garage // Simav</strong>
                  <div style={{ fontSize: "12px", color: "#b8bcc8", marginTop: "2px" }}>{business.address}</div>
                </div>
                <a href={business.mapsHref} target="_blank" rel="noreferrer">
                  <Navigation size={14} /> Haritada Yol Tarifi Al
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Physical Work Order Ticket */}
          <div className="work-order-ticket">
            <div className="ticket-header">
              <span className="ticket-header-title">// ATÖLYE İŞ EMRİ &amp; DANIŞMA FİŞİ</span>
              <span className="stamp-code">MEKA-SİMAV-{business.licenseSequenceNumber}</span>
            </div>
            <form className="ticket-body" onSubmit={sendAppointment}>
              <div className="ticket-field">
                <label htmlFor="wo-name">[01] MÜŞTERİ ADI SOYADI</label>
                <input
                  id="wo-name"
                  value={appointment.name}
                  onChange={(e) => setAppointment({ ...appointment, name: e.target.value })}
                  placeholder="Örn: İsmail Demir"
                  required
                />
              </div>
              <div className="ticket-field">
                <label htmlFor="wo-moto">[02] MOTOSİKLET PLAKA / MARKA / MODEL / YIL</label>
                <input
                  id="wo-moto"
                  value={appointment.motorcycle}
                  onChange={(e) => setAppointment({ ...appointment, motorcycle: e.target.value })}
                  placeholder="Örn: 43 AB 123 - Kuba CG 150 (2021) / Honda Activa"
                  required
                />
              </div>
              <div className="ticket-field">
                <label htmlFor="wo-type">[03] SERVİS YA DA TALEP KONUSU</label>
                <select
                  id="wo-type"
                  value={appointment.serviceType}
                  onChange={(e) => setAppointment({ ...appointment, serviceType: e.target.value })}
                >
                  <option value="Periyodik Bakım & Yağ Değişimi">Periyodik Bakım &amp; Yağ Değişimi (Motul / Castrol)</option>
                  <option value="Mekanik Arıza & Şüpheli Ses">Mekanik Arıza / Motordan Gelen Ses Tespiti</option>
                  <option value="Varyatör & Debriyaj Bakımı">Varyatör, Kayış &amp; Debriyaj Bakımı</option>
                  <option value="Yedek Parça Fiyat & Stok">Yedek Parça Fiyat &amp; Stok Sorgusu</option>
                  <option value="Fren Balatası & Zincir Değişimi">Fren Balatası &amp; Zincir/Dişli Değişimi</option>
                  <option value="Kask & Sürüş Ekipmanı">Kask &amp; Güvenlik Ekipmanları</option>
                  <option value="Diğer">Diğer Konular / Danışma</option>
                </select>
              </div>
              <div className="ticket-field">
                <label htmlFor="wo-req">[04] ARIZA / ŞİKÂYET VEYA İSTENEN PARÇA</label>
                <textarea
                  id="wo-req"
                  rows={4}
                  value={appointment.request}
                  onChange={(e) => setAppointment({ ...appointment, request: e.target.value })}
                  placeholder="Örn: 4000 devirden sonra tekleme yapıyor, kalkışta varyatör titriyor veya arka balata lazım..."
                  required
                />
              </div>
              <button type="submit" className="ticket-submit-btn">
                <MessageCircle size={16} /> [ WHATSAPP İŞ EMRİ OLUŞTUR &amp; GÖNDER ]
              </button>
              <p className="ticket-footnote">
                * Gönderdiğinizde bilgiler ustanızın WhatsApp hattına düzenlenmiş iş emri fişi olarak aktarılır.
                Gereksiz parça masrafı çıkarılmaz, şeffaf fiyat bilgisi verilir.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Emergency Roadside Strip */}
      <section style={{ maxWidth: "1400px", margin: "0 auto 64px", padding: "0 clamp(18px, 4vw, 56px)" }}>
        <div className="emergency-help-strip">
          <div className="emergency-help-text">
            <strong>Simav İçi veya Yakın Köylerde Yolda mı Kaldınız?</strong>
            <p>
              Motorunuz çalışmıyorsa, kayış kopardıysa veya zincir attıysa arayın.
              Uygunluk durumumuza göre yerinde müdahale veya kamyonet yönlendirmesi konusunda elimizden geleni yaparız.
            </p>
          </div>
          <a href={business.phoneHref} className="primary-btn hero-call-direct" style={{ whiteSpace: "nowrap" }}>
            <Phone size={17} /> Acil Destek: {business.phone}
          </a>
        </div>
      </section>
    </>
  );
}

function ProductsPreview({ setPage, products }) {
  return (
    <section className="section products-preview-section" id="urunler">
      <div className="section-heading">
        <div>
          <span className="eyebrow dark">DÜKKANDAKİ STOKLAR</span>
          <h2>Raftan Hemen Teslim Parçalar</h2>
          <p className="section-subtext">
            Simav'daki dükkanımızdan hemen teslim alabileceğiniz veya WhatsApp ile anında ayırtabileceğiniz popüler parçalar.
          </p>
        </div>
        <button className="outline-btn" type="button" onClick={() => setPage("products")}>
          Tüm Parçaları Gör ({products?.length ?? 0}) <ChevronRight size={17} />
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
            {product.image?.startsWith("/uploads/") ? (
              <img src={assetUrl(product.image)} alt={product.name} loading="lazy" />
            ) : (
              <div className="product-visual-fallback">
                <PackageCheck size={36} />
              </div>
            )}
            {product.tag && <span className="product-badge-tag">{product.tag}</span>}
          </div>
          <div className="product-info">
            <div className="product-category-row">
              <span className="product-cat-pill">{product.category}</span>
              {product.brand && <span className="product-brand-pill">{product.brand}</span>}
            </div>
            <h3>{product.name}</h3>
            {product.compatibility && (
              <p className="product-compat">
                <strong>Uyumlu Modeller:</strong> {product.compatibility}
              </p>
            )}
            <div className="product-contact-row">
              <a
                className="product-wa-btn"
                href={`${business.whatsappHref}?text=${encodeURIComponent(`Selamın aleyküm ${ustaAdi()}, ${product.name} hakkında stok durumu ve fiyat öğrenmek istiyorum.`)}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={15} /> WhatsApp'tan Fiyat / Stok Sor
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
