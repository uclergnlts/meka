import { useState } from "react";
import { Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import { readStorage, writeStorage } from "../../../utils/storage.js";

export function AdminSidebar({ activeSection, setActiveSection, sections }) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => typeof window !== "undefined" && readStorage("meka-panel-theme") === "dark");
  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (typeof window !== "undefined") {
      writeStorage("meka-panel-theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("panel-dark", next);
    }
  };
  return (
    <aside className={collapsed ? "admin-sidebar collapsed" : "admin-sidebar"}>
      <div>
        <span className="eyebrow dark">Yönetim</span>
        <h1>İşletme paneli</h1>
      </div>
      <div className="sidebar-controls"><button type="button" onClick={() => setCollapsed((current) => !current)} aria-label={collapsed ? "Menüyü genişlet" : "Menüyü daralt"}>{collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}<span>Menü</span></button><button type="button" onClick={toggleTheme} aria-label="Panel temasını değiştir">{darkMode ? <Sun size={18} /> : <Moon size={18} />}<span>Tema</span></button></div>
      <nav className="admin-tabs" aria-label="Yönetim bölümleri">
        {sections.map(({ id, label, icon: Icon }) => (
          <button className={activeSection === id ? "active" : ""} type="button" key={id} onClick={() => setActiveSection(id)}>
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
