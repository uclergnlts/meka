import { useState } from "react";
import { Bike, Menu, X } from "lucide-react";
import { business } from "../../data/business.js";

const navItems = [
  ["home", "Ana sayfa"],
  ["products", "Ürünler"],
  ["who", "Biz kimiz?"],
  ["about", "Hakkımızda"],
  ["contact", "İletişim"],
];

export function Header({ currentView, setView, publicPage, setPublicPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigateSite = (page = "home") => {
    setView("site");
    setPublicPage(page);
    setMobileOpen(false);
  };

  return (
    <header className="topbar">
      <button className="brand brand-button" type="button" aria-label={business.brand} onClick={() => navigateSite("home")}>
        <span className="brand-mark">
          <Bike size={22} />
        </span>
        <span>
          <strong>MEKA</strong>
          <small>Moto Garage</small>
        </span>
      </button>

      <nav className={mobileOpen ? "nav nav-open" : "nav"}>
        {navItems.map(([id, label]) => (
          <button
            className={currentView === "site" && publicPage === id ? "active" : ""}
            type="button"
            key={id}
            onClick={() => navigateSite(id)}
          >
            {label}
          </button>
        ))}
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
