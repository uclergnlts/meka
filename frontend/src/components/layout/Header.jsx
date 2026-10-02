import { useEffect, useState } from "react";
import {
  Bike,
  Menu,
  X,
  Phone,
  MessageCircle,
  CalendarClock,
  Home,
  Boxes,
  Users,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { business } from "../../data/business.js";
import { assetUrl } from "../../services/apiClient.js";
import { BRAND_ASSETS_EVENT, getBrandAssets } from "../../utils/brandAssets.js";

const navItems = [
  { id: "home", label: "Ana sayfa", icon: Home },
  { id: "products", label: "Ürünler", icon: Boxes },
  { id: "about", label: "Hakkımızda", icon: Users },
  { id: "contact", label: "İletişim", icon: MapPin },
];

export function Header({ currentView, setView, publicPage, setPublicPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandAssets, setBrandAssets] = useState(getBrandAssets);

  useEffect(() => {
    const syncBrandAssets = (event) => setBrandAssets(event.detail ?? getBrandAssets());
    window.addEventListener(BRAND_ASSETS_EVENT, syncBrandAssets);
    return () => window.removeEventListener(BRAND_ASSETS_EVENT, syncBrandAssets);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [publicPage]);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen]);

  const navigateSite = (page = "home") => {
    setView("site");
    setPublicPage(page);
    setMobileOpen(false);
  };

  return (
    <header className="topbar">
      {/* Brand / Logo */}
      <button
        className="brand brand-button"
        type="button"
        aria-label={business.brand}
        onClick={() => navigateSite("home")}
      >
        {brandAssets.logo ? (
          <img className="brand-uploaded-logo" src={assetUrl(brandAssets.logo)} alt={business.brand} />
        ) : (
          <>
            <span className="brand-mark">
              <Bike size={22} />
            </span>
            <span className="brand-text">
              <strong>
                MEKA<span className="brand-dot">.</span>
              </strong>
              <small>Moto Garage · Simav</small>
            </span>
          </>
        )}
      </button>

      {/* Desktop Navigation */}
      <nav id="main-navigation" className="nav desktop-nav" aria-label="Ana menü">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = currentView === "site" && publicPage === id;
          return (
            <button
              className={isActive ? "active" : ""}
              type="button"
              key={id}
              onClick={() => navigateSite(id)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Actions */}
      <div className="topbar-actions">
        {/* Quick Phone Call */}
        <a href={business.phoneHref} className="topbar-phone" title="Hemen Ara">
          <span className="phone-icon-wrap">
            <Phone size={14} />
          </span>
          <span className="phone-details">
            <small>Bizi Arayın</small>
            <strong>{business.phone}</strong>
          </span>
        </a>

        {/* Appointment CTA Button */}
        <button
          className="topbar-cta"
          type="button"
          onClick={() => navigateSite("contact")}
        >
          <CalendarClock size={16} />
          <span>Randevu Al</span>
        </button>

        {/* Mobile Call Shortcut */}
        <a
          href={business.phoneHref}
          className="icon-btn mobile-call-btn"
          aria-label="Hemen Ara"
          title="Hemen Ara"
        >
          <Phone size={18} />
        </a>

        {/* Mobile Menu Toggle */}
        <button
          className="icon-btn menu-btn"
          type="button"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div id="mobile-navigation" className="mobile-drawer">
          <nav className="mobile-nav-list" aria-label="Mobil ana menü">
            {navItems.map(({ id, label, icon: Icon }) => {
              const isActive = currentView === "site" && publicPage === id;
              return (
                <button
                  className={isActive ? "active" : ""}
                  type="button"
                  key={id}
                  onClick={() => navigateSite(id)}
                >
                  <span className="mobile-nav-icon">
                    <Icon size={18} />
                  </span>
                  <span className="mobile-nav-label">{label}</span>
                  <ChevronRight size={16} className="mobile-nav-arrow" />
                </button>
              );
            })}
          </nav>

          <div className="mobile-drawer-footer">
            <div className="mobile-contact-chips">
              <a href={business.phoneHref} className="mobile-contact-chip">
                <Phone size={16} />
                <span>{business.phone}</span>
              </a>
              <a
                href={business.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mobile-contact-chip whatsapp"
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </a>
            </div>
            <p className="mobile-address-note">
              <MapPin size={14} /> {business.address} · {business.city}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
