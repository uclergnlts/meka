import { useMemo, useState } from "react";
import { BarChart3, Boxes, PackageCheck, ReceiptText, Users, Wrench } from "lucide-react";
import { AdminSidebar } from "./components/AdminSidebar.jsx";
import { DashboardSection } from "./sections/DashboardSection.jsx";
import { ProductsSection } from "./sections/ProductsSection.jsx";
import { StockSection } from "./sections/StockSection.jsx";
import { InvoicesSection } from "./sections/InvoicesSection.jsx";
import { CustomersSection } from "./sections/CustomersSection.jsx";
import { ServiceSection } from "./sections/ServiceSection.jsx";

export const adminSections = [
  { id: "dashboard", label: "Özet", icon: BarChart3 },
  { id: "products", label: "Ürün", icon: Boxes },
  { id: "stock", label: "Stok", icon: PackageCheck },
  { id: "service", label: "Servis", icon: Wrench },
  { id: "invoices", label: "Fatura", icon: ReceiptText },
  { id: "customers", label: "Müşteri", icon: Users },
];

export function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const ActiveComponent = useMemo(() => {
    const sections = {
      dashboard: DashboardSection,
      products: ProductsSection,
      stock: StockSection,
      service: ServiceSection,
      invoices: InvoicesSection,
      customers: CustomersSection,
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
