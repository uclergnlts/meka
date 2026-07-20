import { useState } from "react";
import { Header } from "../components/layout/Header.jsx";
import { PublicSite } from "../features/public/PublicSite.jsx";
import { AdminPanel } from "../features/admin/AdminPanel.jsx";

export function App() {
  const [view, setView] = useState("site");

  return (
    <div className="app">
      <Header currentView={view} setView={setView} />
      {view === "site" ? <PublicSite setView={setView} /> : <AdminPanel />}
    </div>
  );
}
