export function AdminSidebar({ activeSection, setActiveSection, sections }) {
  return (
    <aside className="admin-sidebar">
      <div>
        <span className="eyebrow dark">Yönetim</span>
        <h1>İşletme paneli</h1>
      </div>
      <div className="admin-tabs">
        {sections.map(({ id, label, icon: Icon }) => (
          <button className={activeSection === id ? "active" : ""} type="button" key={id} onClick={() => setActiveSection(id)}>
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}
