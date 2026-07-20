import { useState } from "react";
import { Bike, Menu, X } from "lucide-react";

export function Header({ currentView, setView }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigateSite = () => {
    setView("site");
    setMobileOpen(false);
  };

  return (
    <header className="topbar">
      <a className="brand" href="#anasayfa" aria-label="MEKA Motor" onClick={navigateSite}>
        <span className="brand-mark">
          <Bike size={22} />
        </span>
        <span>
          <strong>MEKA Motor</strong>
          <small>Servis & Parça</small>
        </span>
      </a>

      <nav className={mobileOpen ? "nav nav-open" : "nav"}>
        <a href="#urunler" onClick={navigateSite}>Ürünler</a>
        <a href="#biz-kimiz" onClick={navigateSite}>Biz kimiz?</a>
        <a href="#hakkimizda" onClick={navigateSite}>Hakkımızda</a>
        <a href="#iletisim" onClick={navigateSite}>İletişim</a>
        <button
          className="ghost-btn"
          type="button"
          aria-pressed={currentView === "admin"}
          onClick={() => {
            setView("admin");
            setMobileOpen(false);
          }}
        >
          Panel
        </button>
      </nav>

      <button className="icon-btn menu-btn" type="button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menü">
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  );
}
