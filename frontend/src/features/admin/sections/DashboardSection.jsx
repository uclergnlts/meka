import { AlertTriangle, Bell, Boxes, ClipboardList, ReceiptText, Users, Wrench } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { MetricCard } from "../../../components/ui/MetricCard.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { ResourceNotice } from "../../../components/ui/ResourceNotice.jsx";
import { products } from "../../../data/catalog.js";
import { balanceLines, customers, serviceJobs } from "../../../data/operations.js";
import { useApiResource } from "../../../hooks/useApiResource.js";
import { api } from "../../../services/apiClient.js";
import { formatCurrency, stockStatus } from "../../../utils/formatters.js";

export function DashboardSection() {
  const fallbackSummary = {
    metrics: {
      income: balanceLines.filter((line) => line[2] === "Gelir").reduce((total, line) => total + line[1], 0),
      expenses: balanceLines.filter((line) => line[2] === "Gider").reduce((total, line) => total + line[1], 0),
      openServices: 14,
    },
    lowStock: products.filter((product) => product.stock <= product.minStock).map((product) => ({
      name: product.name,
      stock: product.stock,
      minStock: product.minStock,
      status: stockStatus(product.stock, product.minStock),
    })),
    serviceJobs: serviceJobs.map(([id, motorcycle, operation, schedule, status]) => ({ id, motorcycle, operation, schedule, status })),
    customers,
    balanceLines: balanceLines.map(([label, amount, type]) => ({ label, amount, type })),
  };
  fallbackSummary.metrics.netBalance = fallbackSummary.metrics.income - fallbackSummary.metrics.expenses;

  const { data: summary, error, isLoading } = useApiResource(api.dashboard.summary, fallbackSummary);
  const localJobs = (() => { try { return JSON.parse(localStorage.getItem("meka-service-jobs")) ?? summary.serviceJobs; } catch { return summary.serviceJobs; } })();
  const localStock = (() => { try { return JSON.parse(localStorage.getItem("meka-stock-cards")) ?? summary.lowStock; } catch { return summary.lowStock; } })();
  const lowStock = localStock.filter((product) => Number(product.stock) <= Number(product.minStock));
  const openJobs = localJobs.filter((job) => job.status !== "Tamamlandı");
  const readyJobs = localJobs.filter((job) => job.status === "Teslim hazır");
  const waitingJobs = localJobs.filter((job) => job.status === "Parça bekliyor");
  const metrics = { ...summary.metrics, openServices: openJobs.length };
  const notifications = [
    lowStock.length ? { level: "critical", text: `${lowStock.length} ürün kritik stok seviyesinde`, href: "#panel-stock" } : null,
    readyJobs.length ? { level: "success", text: `${readyJobs.length} motosiklet teslim edilmeye hazır`, href: "#panel-service" } : null,
    waitingJobs.length ? { level: "warning", text: `${waitingJobs.length} iş emri parça bekliyor`, href: "#panel-service" } : null,
  ].filter(Boolean);

  return (
    <>
      <PageHeading title="Aylık operasyon özeti" description="Satışsız vitrin, teklif ve servis odaklı işletme takibi." />
      <ResourceNotice isLoading={isLoading} error={error} />
      <div className="metric-grid">
        <MetricCard label="Aylık ciro" value={formatCurrency(metrics.income)} trend="+18%" />
        <MetricCard label="Gider" value={formatCurrency(metrics.expenses)} trend="-4%" />
        <MetricCard label="Net bilanço" value={formatCurrency(metrics.netBalance)} trend="+22%" />
        <MetricCard label="Açık servis" value={metrics.openServices} trend="5 bugün" />
      </div>
      <div className="dashboard-action-grid">
        <a href="#panel-stock"><AlertTriangle size={20} /> Kritik stokları gör</a>
        <a href="#panel-service"><Wrench size={20} /> Servis akışını aç</a>
        <a href="#panel-products"><Boxes size={20} /> Ürünleri yönet</a>
        <a href="#panel-invoices"><ReceiptText size={20} /> Faturaları kontrol et</a>
        <a href="#panel-customers"><Users size={20} /> Müşteri kartları</a>
        <a href="#about"><ClipboardList size={20} /> İşletme yaklaşımı</a>
      </div>
      <section className="notification-center">
        <div className="form-heading"><h3><Bell size={19} /> Bildirim merkezi</h3><span>{notifications.length} bildirim</span></div>
        {notifications.length ? notifications.map((item) => <a className={`notification-item ${item.level}`} href={item.href} key={item.text}>{item.text}<span>Görüntüle →</span></a>) : <p className="empty-state">Şu anda işlem gerektiren bildirim yok.</p>}
      </section>
      <div className="panel-grid">
        <DataTable
          title="Düşük stok uyarıları"
          rows={lowStock.map((product) => [product.name, `${product.stock} adet`, product.status ?? stockStatus(product.stock, product.minStock)])}
        />
        <DataTable title="Açık servis akışı" rows={openJobs.slice(0, 8).map((job) => [job.id, job.motorcycle, job.operation, job.schedule, job.status])} />
        <DataTable title="Son müşteri hareketleri" rows={summary.customers.map((item) => [item.name, item.lastAction, item.date])} />
        <DataTable title="Bilanço kalemleri" rows={summary.balanceLines.map((line) => [line.label, formatCurrency(line.amount), line.type])} />
      </div>
    </>
  );
}
