import { Boxes, ChevronRight, ClipboardList, Gauge, PackageCheck, Phone, Search, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { products } from "../../data/catalog.js";
import { formatCurrency } from "../../utils/formatters.js";

export function PublicSite({ setView }) {
  return (
    <main>
      <section className="hero" id="anasayfa">
        <img src="/workshop-hero.png" alt="Modern motosiklet servis atölyesi" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="eyebrow">Motosiklet servis, yedek parça ve aksesuar</span>
          <h1>Motorun hazır, yolun açık olsun.</h1>
          <p>
            Bakım, onarım, orijinal yedek parça ve sürüş aksesuarlarını tek noktadan takip edin.
            Online satış yok; doğru parça ve servis için hızlı iletişim var.
          </p>
          <div className="hero-actions">
            <a className="primary-btn" href="#urunler">
              Ürünleri incele <ChevronRight size={18} />
            </a>
            <a className="secondary-btn" href="#iletisim">
              Servis randevusu al
            </a>
          </div>
        </div>
      </section>

      <section className="stats-band">
        <Stat icon={<Wrench />} value="12+" label="Yıl servis deneyimi" />
        <Stat icon={<PackageCheck />} value="850+" label="Aktif ürün ve parça" />
        <Stat icon={<ShieldCheck />} value="24s" label="Teklif dönüş hedefi" />
      </section>

      <section className="section" id="urunler">
        <div className="section-heading">
          <div>
            <span className="eyebrow dark">Ürün vitrini</span>
            <h2>Yedek parça ve aksesuarlar</h2>
          </div>
          <div className="search-pill">
            <Search size={17} />
            <span>Sepet yok, teklif odaklı ürün listesi</span>
          </div>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className={`product-visual ${product.image}`}>
                <Sparkles size={22} />
              </div>
              <div className="product-info">
                <span>{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.tag} · Stok: {product.stock}</p>
                <div>
                  <strong>{formatCurrency(product.price)}</strong>
                  <a href="#iletisim">Teklif al</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" id="biz-kimiz">
        <div>
          <span className="eyebrow dark">Biz kimiz?</span>
          <h2>Serviste titiz, parçada net, müşteride takipçiyiz.</h2>
        </div>
        <p>
          MEKA Motor; bakım, arıza tespiti, yedek parça tedariği ve aksesuar danışmanlığını
          aynı çatı altında sunan yerel bir motosiklet işletmesidir. Amacımız müşterinin
          motorunu, yapılan işlemi ve ihtiyaç duyduğu parçayı sade ve anlaşılır biçimde takip edebilmesidir.
        </p>
      </section>

      <section className="section muted" id="hakkimizda">
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

      <section className="contact-section" id="iletisim">
        <div>
          <span className="eyebrow dark">İletişim</span>
          <h2>Parça sor, servis randevusu oluştur.</h2>
          <p>Telefon, WhatsApp veya mağaza ziyaretiyle ürün ve servis bilgisi alabilirsiniz.</p>
        </div>
        <div className="contact-actions">
          <a className="primary-btn" href="tel:+905551112233">
            <Phone size={18} /> +90 555 111 22 33
          </a>
          <button className="secondary-btn light" type="button" onClick={() => setView("admin")}>
            Yönetim panelini görüntüle
          </button>
        </div>
      </section>
    </main>
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
