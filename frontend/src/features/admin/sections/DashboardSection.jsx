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
  const { metrics } = summary;

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
      <div className="panel-grid">
        <DataTable
          title="Düşük stok uyarıları"
          rows={summary.lowStock.map((product) => [product.name, `${product.stock} adet`, product.status])}
        />
        <DataTable title="Bugünkü servis akışı" rows={summary.serviceJobs.map((job) => [job.id, job.motorcycle, job.operation, job.schedule, job.status])} />
        <DataTable title="Son müşteri hareketleri" rows={summary.customers.map((item) => [item.name, item.lastAction, item.date])} />
        <DataTable title="Bilanço kalemleri" rows={summary.balanceLines.map((line) => [line.label, formatCurrency(line.amount), line.type])} />
      </div>
    </>
  );
}
