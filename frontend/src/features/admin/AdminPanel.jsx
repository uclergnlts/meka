import { useMemo } from "react";
import { BarChart3, Boxes, DatabaseBackup, Image, PackageCheck, ReceiptText, Settings, Users, Wrench } from "lucide-react";
import { AdminSidebar } from "./components/AdminSidebar.jsx";
import { DashboardSection } from "./sections/DashboardSection.jsx";
import { ProductsSection } from "./sections/ProductsSection.jsx";
import { StockSection } from "./sections/StockSection.jsx";
import { InvoicesSection } from "./sections/InvoicesSection.jsx";
import { CustomersSection } from "./sections/CustomersSection.jsx";
import { ServiceSection } from "./sections/ServiceSection.jsx";
import { BrandingSection } from "./sections/BrandingSection.jsx";
import { BusinessSettingsSection } from "./sections/BusinessSettingsSection.jsx";
import { BackupSection } from "./sections/BackupSection.jsx";

export const adminSections = [
  { id: "dashboard", label: "Özet", icon: BarChart3 },
  { id: "products", label: "Ürün", icon: Boxes },
  { id: "stock", label: "Stok", icon: PackageCheck },
  { id: "service", label: "Servis", icon: Wrench },
  { id: "invoices", label: "Fatura", icon: ReceiptText },
  { id: "customers", label: "Müşteri", icon: Users },
  { id: "branding", label: "Logo", icon: Image },
  { id: "settings", label: "Ayarlar", icon: Settings },
  { id: "backup", label: "Yedek", icon: DatabaseBackup },
];

export function AdminPanel({ activeSection, setActiveSection }) {
  const ActiveComponent = useMemo(() => {
    const sections = {
      dashboard: DashboardSection,
      products: ProductsSection,
      stock: StockSection,
      service: ServiceSection,
      invoices: InvoicesSection,
      customers: CustomersSection,
      branding: BrandingSection,
      settings: BusinessSettingsSection,
      backup: BackupSection,
    };

    return sections[activeSection] ?? DashboardSection;
  }, [activeSection]);

  return (
    <main className="admin-shell">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} sections={adminSections} />
      <section className="admin-content">
        <ActiveComponent />
      </section>
    </main>
  );
}
