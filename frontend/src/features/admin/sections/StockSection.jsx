import { AlertTriangle, PackagePlus } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { MetricCard } from "../../../components/ui/MetricCard.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { ResourceNotice } from "../../../components/ui/ResourceNotice.jsx";
import { products } from "../../../data/catalog.js";
import { useApiResource } from "../../../hooks/useApiResource.js";
import { api } from "../../../services/apiClient.js";
import { stockStatus } from "../../../utils/formatters.js";

export function StockSection() {
  const fallbackStockCards = products.map((product) => ({
    productId: product.id,
    name: product.name,
    category: product.category,
    stock: product.stock,
    minStock: product.minStock,
    status: stockStatus(product.stock, product.minStock),
  }));
  const { data: stockCards, error, isLoading } = useApiResource(api.stock.list, fallbackStockCards);
  const totalStock = stockCards.reduce((total, product) => total + product.stock, 0);
  const orderNeeded = stockCards.filter((product) => product.stock <= product.minStock).length;

  return (
    <>
      <PageHeading title="Stok yönetimi" description="Minimum stok, sipariş ihtiyacı ve raf durumlarını takip edin." chip="Anlık stok" />
      <ResourceNotice isLoading={isLoading} error={error} />
      <div className="metric-grid stock-metrics">
        <MetricCard label="Toplam adet" value={totalStock} trend={`${stockCards.length} ürün grubu`} />
        <MetricCard label="Sipariş ihtiyacı" value={orderNeeded} trend="Öncelikli" />
        <MetricCard label="Raf sağlığı" value="%82" trend="Normal" />
        <MetricCard label="Beklenen teslim" value="3" trend="Bu hafta" />
      </div>
      <div className="quick-actions">
        <button type="button"><PackagePlus size={18} /> Stok girişi</button>
        <button type="button"><AlertTriangle size={18} /> Kritik stok raporu</button>
      </div>
      <DataTable
        title="Stok kartları"
        columns={["Ürün", "Kategori", "Mevcut", "Minimum", "Durum"]}
        rows={stockCards.map((product) => [
          product.name,
          product.category,
          `${product.stock} adet`,
          `Min. ${product.minStock}`,
          product.status,
        ])}
      />
    </>
  );
}
