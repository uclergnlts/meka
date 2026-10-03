import { api } from "../../../services/apiClient.js";
import { useApiResource } from "../../../hooks/useApiResource.js";
import { ResourceNotice } from "../../../components/ui/ResourceNotice.jsx";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Download, PackagePlus, RotateCcw, Save, Search } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { MetricCard } from "../../../components/ui/MetricCard.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";

export function StockSection() {
  const { data: stockCards, reload: reloadCards, error, isLoading } = useApiResource(api.stock.list, []);
  const { data: movementHistory, reload: reloadHistory, error: historyError } = useApiResource(api.stock.history, []);
  const [isSaving, setIsSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [movementForm, setMovementForm] = useState({
    productId: "",
    type: "in",
    quantity: "",
    note: "",
    supplier: "",
    purchasePrice: "",
    salePrice: "",
    shelf: "",
    barcode: "",
  });
  const [historyDate, setHistoryDate] = useState("");
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    if (!movementForm.productId && stockCards.length) setMovementForm(current => ({ ...current, productId: stockCards[0].productId }));
  }, [stockCards, movementForm.productId]);

  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const filteredStockCards = useMemo(() => stockCards
    .filter((product) => filterMode === "critical" ? product.stock <= product.minStock : true)
    .filter((product) => {
      if (!normalizedQuery) {
        return true;
      }

      return [product.name, product.category, product.status, product.lastMovement]
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(normalizedQuery);
    }), [filterMode, normalizedQuery, stockCards]);

  const totalStock = stockCards.reduce((total, product) => total + product.stock, 0);
  const orderNeeded = stockCards.filter((product) => product.stock <= product.minStock).length;
  const healthyCount = stockCards.length - orderNeeded;
  const shelfHealth = stockCards.length ? Math.round((healthyCount / stockCards.length) * 100) : 0;

  const updateMovementField = (field, value) => {
    setMovementForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const fillMovementProduct = (productId) => {
    setMovementForm((current) => ({
      ...current,
      productId,
    }));
  };

  const saveMovement = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true); setActionError(null);
    try {
      await api.stock.move(movementForm);
      setMovementForm(current => ({ ...current, quantity: "", note: "" }));
      await Promise.all([reloadCards(), reloadHistory()]);
    } catch (error) { setActionError(error.message); }
    finally { setIsSaving(false); }
  };
  const undoLastMovement = async () => {
    const last = movementHistory[0];
    if (!last || isSaving || !window.confirm(`${last.product} için son hareket geri alınacak. Devam edilsin mi?`)) return;
    setIsSaving(true); setActionError(null);
    try { await api.stock.reverse(last.id); await Promise.all([reloadCards(), reloadHistory()]); }
    catch (error) { setActionError(error.message); }
    finally { setIsSaving(false); }
  };

  const downloadCriticalCsv = () => {
    const critical = stockCards.filter((product) => product.stock <= product.minStock);
    const rows = [["Ürün", "Kategori", "Mevcut", "Minimum", "Durum"], ...critical.map((product) => [product.name, product.category, product.stock, product.minStock, product.status])];
    const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(";")).join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "meka-kritik-stok.csv"; link.click(); URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeading title="Stok yönetimi" description="Minimum stok, sipariş ihtiyacı ve raf durumlarını takip edin." chip="Anlık stok" />
      <ResourceNotice isLoading={isLoading} error={error || historyError} />
      {actionError ? <div className="resource-notice error">{actionError}</div> : null}
      <div className="metric-grid stock-metrics">
        <MetricCard label="Toplam adet" value={totalStock} trend={`${stockCards.length} ürün grubu`} />
        <MetricCard label="Sipariş ihtiyacı" value={orderNeeded} trend="Öncelikli" />
        <MetricCard label="Raf sağlığı" value={`%${shelfHealth}`} trend={`${healthyCount}/${stockCards.length} ürün yeterli`} />
        <MetricCard label="Stok hareketi" value={movementHistory.length} trend="Son 100 kayıt" />
      </div>
      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={17} />
          <input type="search" placeholder="Ürün, kategori veya durum ara" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="segmented-control" aria-label="Stok görünümü">
          <button className={filterMode === "all" ? "active" : ""} type="button" onClick={() => setFilterMode("all")}>Tümü</button>
          <button className={filterMode === "critical" ? "active" : ""} type="button" onClick={() => setFilterMode("critical")}>Kritik</button>
        </div>
      </div>
      <form className="admin-form stock-movement-form" onSubmit={saveMovement}>
        <div className="form-heading">
          <h3>Hızlı stok hareketi</h3>
        </div>
        <div className="form-grid">
          <label>
            Ürün
            <select value={movementForm.productId} onChange={(event) => updateMovementField("productId", event.target.value)}>
              {stockCards.map((product) => (
                <option value={product.productId} key={product.productId}>{product.name}</option>
              ))}
            </select>
          </label>
          <label>
            Hareket
            <select value={movementForm.type} onChange={(event) => updateMovementField("type", event.target.value)}>
              <option value="in">Stok girişi</option>
              <option value="out">Stok çıkışı</option>
            </select>
          </label>
          <label>
            Adet
            <input type="number" min="1" value={movementForm.quantity} onChange={(event) => updateMovementField("quantity", event.target.value)} required />
          </label>
          <label>
            Not
            <input value={movementForm.note} onChange={(event) => updateMovementField("note", event.target.value)} placeholder="Tedarik, servis, satış..." />
          </label>
          <label>Tedarikçi<input value={movementForm.supplier} onChange={(event) => updateMovementField("supplier", event.target.value)} /></label>
          <label>Alış fiyatı<input type="number" min="0" step="0.01" value={movementForm.purchasePrice} onChange={(event) => updateMovementField("purchasePrice", event.target.value)} /></label>
          <label>Satış fiyatı<input type="number" min="0" step="0.01" value={movementForm.salePrice} onChange={(event) => updateMovementField("salePrice", event.target.value)} /></label>
          <label>Raf konumu<input value={movementForm.shelf} onChange={(event) => updateMovementField("shelf", event.target.value)} /></label>
          <label>Barkod<input value={movementForm.barcode} onChange={(event) => updateMovementField("barcode", event.target.value)} /></label>
        </div>
        <button className="primary-btn compact" type="submit" disabled={isSaving || isLoading || Boolean(error)}>
          <Save size={18} /> Hareketi işle
        </button>
      </form>
      <div className="quick-actions">
        <button type="button" onClick={() => setMovementForm((current) => ({ ...current, type: "in" }))}><PackagePlus size={18} /> Stok girişi</button>
        <button type="button" onClick={() => setFilterMode("critical")}><AlertTriangle size={18} /> Kritik stok raporu</button>
        <button type="button" onClick={downloadCriticalCsv}><Download size={18} /> Kritik stok CSV</button>
        <button type="button" onClick={undoLastMovement} disabled={isSaving || !movementHistory.length}><RotateCcw size={18} /> Son hareketi geri al</button>
      </div>
      <DataTable
        title="Stok kartları"
        columns={["Ürün", "Kategori", "Mevcut", "Minimum", "Tedarikçi", "Raf", "Barkod", "Durum", "Son hareket", "İşlem"]}
        rows={filteredStockCards.map((product) => ({
          id: product.productId,
          cells: [
            product.name,
            product.category,
            `${product.stock} adet`,
            `Min. ${product.minStock}`,
            product.supplier || "-",
            product.shelf || "-",
            product.barcode || "-",
            product.status,
            product.lastMovement ?? "-",
            <button className="outline-mini-btn" type="button" onClick={() => fillMovementProduct(product.productId)}>Seç</button>,
          ],
        }))}
      />
      <DataTable
        title="Son stok hareketleri"
        columns={["Tarih", "Ürün", "Hareket", "Adet", "Not"]}
        rows={movementHistory.filter((movement) => !historyDate || movement.createdAt?.startsWith(historyDate)).slice(0, 12).map((movement) => [movement.date, movement.product, movement.type, `${movement.quantity} adet`, movement.note])}
      />
      <label className="history-date-filter">Hareket tarihi<input type="date" value={historyDate} onChange={(event) => setHistoryDate(event.target.value)} /></label>
    </>
  );
}
