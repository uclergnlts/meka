import { AdminAccess } from "../features/admin/AdminAccess.jsx";
import { useEffect, useState } from "react";
import { Header } from "../components/layout/Header.jsx";
import { PublicSite } from "../features/public/PublicSite.jsx";
import { AdminPanel } from "../features/admin/AdminPanel.jsx";
import { BUSINESS_SETTINGS_EVENT, applyServerBusinessSettings } from "../data/business.js";
import { api } from "../services/apiClient.js";
import { applyServerBrandAssets } from "../utils/brandAssets.js";
import { isAdminHost, publicSiteUrl } from "../utils/adminHost.js";

const hashPages = {
  "#anasayfa": "home",
  "#home": "home",
  "#urunler": "products",
  "#products": "products",
  "#biz-kimiz": "about",
  "#who": "about",
  "#hakkimizda": "about",
  "#about": "about",
  "#iletisim": "contact",
  "#contact": "contact",
};

const pathPages = {
  "/": "home",
  "/urunler": "products",
  "/hakkimizda": "about",
  "/iletisim": "contact",
  "/sikca-sorulan-sorular": "faq",
  "/kvkk-aydinlatma-metni": "kvkk",
  "/gizlilik-politikasi": "privacy",
};

const pagePaths = Object.fromEntries(Object.entries(pathPages).map(([path, page]) => [page, path]));

const pageMeta = {
  home: ["MEKA Moto Garage | Simav Motosiklet Servisi", "Simav'da motosiklet servisi, bakım, yedek parça ve aksesuar desteği."],
  products: ["Ürünler | MEKA Moto Garage", "Motosiklet yedek parça, bakım ürünü ve aksesuar vitrini."],
  about: ["Hakkımızda | MEKA Moto Garage", "MEKA Moto Garage ve Simav'daki motosiklet servis yaklaşımımız hakkında bilgi alın."],
  contact: ["İletişim | MEKA Moto Garage", "Servis randevusu, ürün ve yedek parça bilgisi için MEKA Moto Garage ile iletişime geçin."],
  faq: ["Sıkça Sorulan Sorular | MEKA Moto Garage", "Servis, randevu, parça, ürün ve ödeme süreçleri hakkında sık sorulan sorular."],
  kvkk: ["KVKK Aydınlatma Metni | MEKA Moto Garage", "MEKA Moto Garage kişisel verilerin korunması aydınlatma metni."],
  privacy: ["Gizlilik Politikası | MEKA Moto Garage", "MEKA Moto Garage internet sitesi gizlilik politikası."],
};

const hashAdminSections = {
  "#panel": "dashboard",
  "#panel-dashboard": "dashboard",
  "#panel-products": "products",
  "#panel-stock": "stock",
  "#panel-service": "service",
  "#panel-invoices": "invoices",
  "#panel-finance": "finance",
  "#panel-customers": "customers",
  "#panel-branding": "branding",
  "#panel-settings": "settings",
  "#panel-backup": "backup",
};

export function App() {
  const [view, setView] = useState(isAdminHost ? "admin" : "site");
  const [publicPage, setPublicPage] = useState("home");
  const [adminSection, setAdminSection] = useState("dashboard");
  const [, setBusinessVersion] = useState(0);

  useEffect(() => {
    const refreshBusiness = () => setBusinessVersion((current) => current + 1);
    window.addEventListener(BUSINESS_SETTINGS_EVENT, refreshBusiness);
    // The site still works with its built-in defaults when the settings cannot be loaded.
    api.publicSettings().then((settings) => {
      applyServerBusinessSettings(settings.business);
      applyServerBrandAssets(settings.brand);
    }).catch(() => {});
    return () => window.removeEventListener(BUSINESS_SETTINGS_EVENT, refreshBusiness);
  }, []);

  useEffect(() => {
    const syncHash = () => {
      if (isAdminHost) {
        setView("admin");
        setAdminSection(hashAdminSections[window.location.hash] ?? "dashboard");
        return;
      }

      const page = hashPages[window.location.hash];
      if (page) {
        setView("site");
        setPublicPage(page);
        return;
      }

      setView("site");
      setPublicPage(pathPages[window.location.pathname] ?? "home");
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, []);

  useEffect(() => {
    if (view !== "site") {
      // The panel host should not turn up in search results.
      document.title = "Yönetim Paneli | MEKA Moto Garage";
      document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex, nofollow");
      return;
    }
    const [title, description] = pageMeta[publicPage] ?? pageMeta.home;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [publicPage, view]);

  const navigatePublicPage = (page) => {
    setPublicPage(page);
    const path = pagePaths[page] ?? "/";
    if (window.location.pathname !== path || window.location.hash) {
      window.history.pushState(null, "", path);
    }
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  const navigateAdminSection = (section) => {
    setAdminSection(section);
    const hash = section === "dashboard" ? "#panel" : `#panel-${section}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
  };

  const navigateView = (nextView) => {
    setView(nextView);
    if (nextView === "admin") {
      navigateAdminSection(adminSection);
    }
  };

  return (
    <div className="app">
      {view === "site" ? <Header currentView={view} setView={navigateView} publicPage={publicPage} setPublicPage={navigatePublicPage} /> : null}
      {view === "site" ? (
        <PublicSite page={publicPage} setPage={navigatePublicPage} />
      ) : (
        <AdminAccess><AdminPanel activeSection={adminSection} setActiveSection={navigateAdminSection} onExit={() => { window.location.href = publicSiteUrl(); }} /></AdminAccess>
      )}
    </div>
  );
}
