import { useMemo, useState } from "react";
import { AlertTriangle, Download, PackagePlus, RotateCcw, Save, Search } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { MetricCard } from "../../../components/ui/MetricCard.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { products } from "../../../data/catalog.js";
import { stockStatus } from "../../../utils/formatters.js";

export function StockSection() {
  const fallbackStockCards = products.map((product) => ({
    productId: product.id,
    name: product.name,
    category: product.category,
    stock: product.stock,
    minStock: product.minStock,
    status: stockStatus(product.stock, product.minStock),
    lastMovement: "Başlangıç stoğu",
  }));
  const [stockCards, setStockCardsState] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem("meka-stock-cards")) ?? fallbackStockCards; } catch { return fallbackStockCards; }
  });
  const [movementHistory, setMovementHistory] = useState(() => {
    try { return JSON.parse(window.localStorage.getItem("meka-stock-history")) ?? []; } catch { return []; }
  });
  const [query, setQuery] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [movementForm, setMovementForm] = useState({
    productId: fallbackStockCards[0]?.productId ?? "",
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

  const setStockCards = (updater) => setStockCardsState((current) => {
    const next = typeof updater === "function" ? updater(current) : updater;
    window.localStorage.setItem("meka-stock-cards", JSON.stringify(next));
    return next;
  });

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

  const saveMovement = (event) => {
    event.preventDefault();
    const quantity = Number(movementForm.quantity);

    if (!movementForm.productId || !Number.isFinite(quantity) || quantity <= 0) {
      return;
    }

    setStockCards((current) => current.map((product) => {
      if (product.productId !== movementForm.productId) {
        return product;
      }

      const nextStock = movementForm.type === "out"
        ? Math.max(0, product.stock - quantity)
        : product.stock + quantity;

      return {
        ...product,
        stock: nextStock,
        status: stockStatus(nextStock, product.minStock),
        lastMovement: `${movementForm.type === "out" ? "Çıkış" : "Giriş"}: ${quantity} adet${movementForm.note ? ` · ${movementForm.note}` : ""}`,
        supplier: movementForm.supplier || product.supplier || "-",
        purchasePrice: movementForm.purchasePrice || product.purchasePrice || 0,
        salePrice: movementForm.salePrice || product.salePrice || 0,
        shelf: movementForm.shelf || product.shelf || "-",
        barcode: movementForm.barcode || product.barcode || "-",
      };
    }));

    const product = stockCards.find((item) => item.productId === movementForm.productId);
    const movement = {
      id: `MOV-${Date.now()}`,
      product: product?.name ?? movementForm.productId,
      type: movementForm.type === "out" ? "Çıkış" : "Giriş",
      quantity,
      note: movementForm.note || "-",
      date: new Date().toLocaleString("tr-TR"),
      createdAt: new Date().toISOString(),
      productId: movementForm.productId,
    };
    setMovementHistory((current) => {
      const next = [movement, ...current].slice(0, 100);
      window.localStorage.setItem("meka-stock-history", JSON.stringify(next));
      return next;
    });

    setMovementForm((current) => ({
      ...current,
      quantity: "",
      note: "",
    }));
  };

  const undoLastMovement = () => {
    const last = movementHistory[0];
    if (!last || !window.confirm(`${last.product} için son ${last.type.toLocaleLowerCase("tr-TR")} hareketi geri alınacak. Devam edilsin mi?`)) return;
    setStockCards((current) => current.map((product) => product.productId === last.productId ? { ...product, stock: last.type === "Giriş" ? Math.max(0, product.stock - last.quantity) : product.stock + last.quantity } : product));
    setMovementHistory((current) => { const next = current.slice(1); localStorage.setItem("meka-stock-history", JSON.stringify(next)); return next; });
  };

  const downloadCriticalCsv = () => {
    const critical = stockCards.filter((product) => product.stock <= product.minStock);
    const rows = [["Ürün", "Kategori", "Mevcut", "Minimum", "Durum"], ...critical.map((product) => [product.name, product.category, product.stock, product.minStock, product.status])];
    const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(";")).join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "meka-kritik-stok.csv"; link.click(); URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeading title="Stok yönetimi" description="Minimum stok, sipariş ihtiyacı ve raf durumlarını takip edin." chip="Anlık stok" />
      <div className="metric-grid stock-metrics">
        <MetricCard label="Toplam adet" value={totalStock} trend={`${stockCards.length} ürün grubu`} />
        <MetricCard label="Sipariş ihtiyacı" value={orderNeeded} trend="Öncelikli" />
        <MetricCard label="Raf sağlığı" value={`%${shelfHealth}`} trend="Normal" />
        <MetricCard label="Beklenen teslim" value="3" trend="Bu hafta" />
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
          <label>Alış fiyatı<input type="number" min="0" value={movementForm.purchasePrice} onChange={(event) => updateMovementField("purchasePrice", event.target.value)} /></label>
          <label>Satış fiyatı<input type="number" min="0" value={movementForm.salePrice} onChange={(event) => updateMovementField("salePrice", event.target.value)} /></label>
          <label>Raf konumu<input value={movementForm.shelf} onChange={(event) => updateMovementField("shelf", event.target.value)} /></label>
          <label>Barkod<input value={movementForm.barcode} onChange={(event) => updateMovementField("barcode", event.target.value)} /></label>
        </div>
        <button className="primary-btn compact" type="submit">
          <Save size={18} /> Hareketi işle
        </button>
      </form>
      <div className="quick-actions">
        <button type="button" onClick={() => setMovementForm((current) => ({ ...current, type: "in" }))}><PackagePlus size={18} /> Stok girişi</button>
        <button type="button" onClick={() => setFilterMode("critical")}><AlertTriangle size={18} /> Kritik stok raporu</button>
        <button type="button" onClick={downloadCriticalCsv}><Download size={18} /> Kritik stok CSV</button>
        <button type="button" onClick={undoLastMovement} disabled={!movementHistory.length}><RotateCcw size={18} /> Son hareketi geri al</button>
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
