import { AlertTriangle, Bell, Boxes, ReceiptText, Users, Wallet, Wrench } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { MetricCard } from "../../../components/ui/MetricCard.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { ResourceNotice } from "../../../components/ui/ResourceNotice.jsx";
import { useApiResource } from "../../../hooks/useApiResource.js";
import { api } from "../../../services/apiClient.js";
import { formatCurrency, stockStatus } from "../../../utils/formatters.js";

const emptySummary = {
  metrics: { income: 0, invoiceIncome: 0, otherIncome: 0, expenses: 0, netBalance: 0, openServices: 0 },
  lowStock: [],
  serviceJobs: [],
  customers: [],
  balanceLines: [],
};

export function DashboardSection() {
  const { data: summary, error, isLoading } = useApiResource(api.dashboard.summary, emptySummary);
  const lowStock = summary.lowStock;
  const openJobs = summary.serviceJobs.filter((job) => job.status !== "Tamamlandı");
  const readyJobs = openJobs.filter((job) => job.status === "Teslim hazır");
  const waitingJobs = openJobs.filter((job) => job.status === "Parça bekliyor");
  const metrics = summary.metrics;
  const notifications = [
    lowStock.length ? { level: "critical", text: `${lowStock.length} ürün kritik stok seviyesinde`, href: "#panel-stock" } : null,
    readyJobs.length ? { level: "success", text: `${readyJobs.length} motosiklet teslim edilmeye hazır`, href: "#panel-service" } : null,
    waitingJobs.length ? { level: "warning", text: `${waitingJobs.length} iş emri parça bekliyor`, href: "#panel-service" } : null,
  ].filter(Boolean);

  return (
    <>
      <PageHeading title="Atölye & İşletme Özeti" description="Simav MEKA Moto Garage servis akışı, parça stoğu ve operasyonel takip." chip="Atölye Yönetimi" />
      <ResourceNotice isLoading={isLoading} error={error} />
      <div className="metric-grid">
        <MetricCard label="Gelir" value={formatCurrency(metrics.income)} trend="Ödenen faturalar + diğer gelir" />
        <MetricCard label="Gider" value={formatCurrency(metrics.expenses)} trend="Gider kayıtları" />
        <MetricCard label="Net bilanço" value={formatCurrency(metrics.netBalance)} trend="Gelir − gider" />
        <MetricCard label="Açık servis" value={metrics.openServices} trend={`${readyJobs.length} teslim hazır`} />
      </div>
      <div className="dashboard-action-grid">
        <a href="#panel-stock"><AlertTriangle size={20} /> Kritik stokları gör</a>
        <a href="#panel-service"><Wrench size={20} /> Servis akışını aç</a>
        <a href="#panel-products"><Boxes size={20} /> Ürünleri yönet</a>
        <a href="#panel-invoices"><ReceiptText size={20} /> Faturaları kontrol et</a>
        <a href="#panel-customers"><Users size={20} /> Müşteri kartları</a>
        <a href="#panel-finance"><Wallet size={20} /> Gelir/gider kayıtları</a>
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
        <DataTable title="Bilanço kalemleri" rows={[["Ödenen faturalar", formatCurrency(metrics.invoiceIncome), "Gelir"], ...summary.balanceLines.map((line) => [line.label, formatCurrency(line.amount), line.type])]} />
      </div>
    </>
  );
}
