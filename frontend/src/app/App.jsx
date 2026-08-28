import { useEffect, useState } from "react";
import { Header } from "../components/layout/Header.jsx";
import { PublicSite } from "../features/public/PublicSite.jsx";
import { AdminPanel } from "../features/admin/AdminPanel.jsx";

const hashPages = {
  "#anasayfa": "home",
  "#home": "home",
  "#urunler": "products",
  "#products": "products",
  "#biz-kimiz": "who",
  "#who": "who",
  "#hakkimizda": "about",
  "#about": "about",
  "#iletisim": "contact",
  "#contact": "contact",
};

const hashAdminSections = {
  "#panel": "dashboard",
  "#panel-dashboard": "dashboard",
  "#panel-products": "products",
  "#panel-stock": "stock",
  "#panel-service": "service",
  "#panel-invoices": "invoices",
  "#panel-customers": "customers",
};

export function App() {
  const [view, setView] = useState("site");
  const [publicPage, setPublicPage] = useState("home");
  const [adminSection, setAdminSection] = useState("dashboard");

  useEffect(() => {
    const syncHash = () => {
      const adminHashSection = hashAdminSections[window.location.hash];
      if (adminHashSection) {
        setView("admin");
        setAdminSection(adminHashSection);
        return;
      }

      const page = hashPages[window.location.hash];
      if (page) {
        setView("site");
        setPublicPage(page);
      }
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const navigatePublicPage = (page) => {
    setPublicPage(page);
    const hash = `#${page}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, "", hash);
    }
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
      <Header currentView={view} setView={navigateView} publicPage={publicPage} setPublicPage={navigatePublicPage} />
      {view === "site" ? (
        <PublicSite page={publicPage} setPage={navigatePublicPage} setView={navigateView} />
      ) : (
        <AdminPanel activeSection={adminSection} setActiveSection={navigateAdminSection} />
      )}
    </div>
  );
}
