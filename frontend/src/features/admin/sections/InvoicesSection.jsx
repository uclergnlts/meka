import { useMemo, useState } from "react";
import { Download, Pencil, Plus, Printer, Save, Search, Trash2, X } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { MetricCard } from "../../../components/ui/MetricCard.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { ResourceNotice } from "../../../components/ui/ResourceNotice.jsx";
import { invoices } from "../../../data/operations.js";
import { useApiResource } from "../../../hooks/useApiResource.js";
import { api } from "../../../services/apiClient.js";
import { formatCurrency } from "../../../utils/formatters.js";

const emptyInvoiceForm = {
  customer: "",
  description: "",
  amount: "",
  status: "Taslak",
  date: "Bugün",
  discount: "0",
  taxRate: "20",
  items: [{ description: "", quantity: 1, unitPrice: "" }],
};

export function InvoicesSection() {
  const { data: invoiceList, setData: setInvoiceList, reload: reloadInvoices, error: listError, isLoading: listLoading } = useApiResource(api.invoices.list, invoices);
  const fallbackSummary = {
    paidTotal: invoices.filter((invoice) => invoice.status === "Ödendi").reduce((total, invoice) => total + invoice.amount, 0),
    pendingTotal: invoices.filter((invoice) => invoice.status !== "Ödendi").reduce((total, invoice) => total + invoice.amount, 0),
    averageInvoice: Math.round(invoices.reduce((total, invoice) => total + invoice.amount, 0) / invoices.length),
    draftCount: invoices.filter((invoice) => invoice.status === "Taslak").length,
  };
  const { data: summary, reload: reloadSummary, error: summaryError, isLoading: summaryLoading } = useApiResource(api.invoices.summary, fallbackSummary);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyInvoiceForm);
  const [editingId, setEditingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showReport, setShowReport] = useState(false);

  const filteredInvoices = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
    const statusFiltered = statusFilter === "all"
      ? invoiceList
      : invoiceList.filter((invoice) => invoice.status === statusFilter);

    if (!normalizedQuery) {
      return statusFiltered;
    }

    return statusFiltered.filter((invoice) => [invoice.id, invoice.customer, invoice.description, invoice.status]
      .join(" ")
      .toLocaleLowerCase("tr-TR")
      .includes(normalizedQuery));
  }, [invoiceList, query, statusFilter]);

  const liveSummary = useMemo(() => {
    const total = invoiceList.reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const paid = invoiceList.filter((invoice) => invoice.status === "Ödendi").reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const pending = invoiceList.filter((invoice) => invoice.status !== "Ödendi").reduce((sum, invoice) => sum + Number(invoice.amount || 0), 0);
    const draft = invoiceList.filter((invoice) => invoice.status === "Taslak").length;

    return {
      total,
      paid,
      pending,
      draft,
    };
  }, [invoiceList]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyInvoiceForm);
    setActionError(null);
  };

  const startEdit = (invoice) => {
    setEditingId(invoice.id);
    setActionError(null);
    setForm({
      customer: invoice.customer,
      description: invoice.description,
      amount: invoice.amount,
      status: invoice.status,
      date: invoice.date,
      discount: invoice.discount ?? "0",
      taxRate: invoice.taxRate ?? "20",
      items: invoice.items?.length ? invoice.items : [{ description: invoice.description, quantity: 1, unitPrice: invoice.amount }],
    });
  };

  const refreshInvoices = async () => {
    await Promise.all([reloadInvoices(), reloadSummary()]);
  };

  const saveInvoice = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setActionError(null);

    try {
      const payload = { ...form, amount: calculatedTotal, description: form.items.map((item) => item.description).filter(Boolean).join(", ") || form.description };
      if (editingId) {
        const updatedInvoice = await api.invoices.update(editingId, payload);
        setInvoiceList((current) => current.map((invoice) => invoice.id === editingId ? { ...updatedInvoice, ...form, amount: calculatedTotal } : invoice));
      } else {
        const createdInvoice = await api.invoices.create(payload);
        setInvoiceList((current) => [{ ...createdInvoice, ...form, amount: calculatedTotal }, ...current]);
      }

      resetForm();
      await refreshInvoices();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const subtotal = form.items.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);
  const discounted = Math.max(0, subtotal - Number(form.discount || 0));
  const calculatedTotal = Math.round(discounted * (1 + Number(form.taxRate || 0) / 100));
  const updateItem = (index, field, value) => setForm((current) => ({ ...current, items: current.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }));
  const printInvoice = (invoice) => {
    const popup = window.open("", "_blank", "width=850,height=700"); if (!popup) return;
    const rows = (invoice.items ?? [{ description: invoice.description, quantity: 1, unitPrice: invoice.amount }]).map((item) => `<tr><td>${item.description}</td><td>${item.quantity}</td><td>${formatCurrency(item.unitPrice)}</td></tr>`).join("");
    popup.document.write(`<html><head><title>${invoice.id}</title><style>body{font-family:Arial;padding:40px}h1{border-bottom:3px solid #d60000}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:10px;text-align:left}</style></head><body><h1>MEKA Moto Garage · Fatura/Teklif</h1><p><b>No:</b> ${invoice.id}<br><b>Müşteri:</b> ${invoice.customer}<br><b>Tarih:</b> ${invoice.date}</p><table><tr><th>Kalem</th><th>Adet</th><th>Birim fiyat</th></tr>${rows}</table><h2>Toplam: ${formatCurrency(invoice.amount)}</h2><button onclick="window.print()">Yazdır</button></body></html>`); popup.document.close();
  };

  const deleteInvoice = async (invoiceId) => {
    if (!window.confirm(`“${invoiceId}” faturasını silmek istediğinizden emin misiniz?`)) return;
    setActionError(null);

    try {
      await api.invoices.delete(invoiceId);
      setInvoiceList((current) => current.filter((invoice) => invoice.id !== invoiceId));
      await refreshInvoices();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  };

  const downloadCsv = () => {
    const escapeCell = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = [
      ["Fatura No", "Müşteri", "Açıklama", "Tutar", "Durum", "Tarih"],
      ...filteredInvoices.map((invoice) => [invoice.id, invoice.customer, invoice.description, invoice.amount, invoice.status, invoice.date]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(escapeCell).join(";")).join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `meka-fatura-raporu-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeading title="Fatura kayıtları" description="Servis, parça ve aksesuar faturalarını tek yerden izleyin." chip={`${invoiceList.length} kayıt`} />
      <ResourceNotice isLoading={listLoading || summaryLoading} error={listError || summaryError} />
      {actionError ? <div className="resource-notice error">{actionError}</div> : null}
      <div className="metric-grid invoice-metrics">
        <MetricCard label="Tahsil edilen" value={formatCurrency(summary.paidTotal)} trend="Ödendi" />
        <MetricCard label="Bekleyen" value={formatCurrency(summary.pendingTotal)} trend="Açık kayıt" />
        <MetricCard label="Ortalama fatura" value={formatCurrency(summary.averageInvoice)} trend="Temmuz" />
        <MetricCard label="Taslak" value={summary.draftCount} trend="Kontrol gerek" />
      </div>
      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={17} />
          <input type="search" placeholder="Fatura, müşteri veya açıklama ara" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="segmented-control" aria-label="Fatura durumu">
          <button className={statusFilter === "all" ? "active" : ""} type="button" onClick={() => setStatusFilter("all")}>Tümü</button>
          <button className={statusFilter === "Bekliyor" ? "active" : ""} type="button" onClick={() => setStatusFilter("Bekliyor")}>Bekleyen</button>
          <button className={statusFilter === "Ödendi" ? "active" : ""} type="button" onClick={() => setStatusFilter("Ödendi")}>Ödendi</button>
        </div>
        <button className="primary-btn compact" type="button" onClick={resetForm}>
          <Plus size={18} /> Fatura oluştur
        </button>
      </div>
      <form className="admin-form" onSubmit={saveInvoice}>
        <div className="form-heading">
          <h3>{editingId ? "Faturayı düzenle" : "Yeni fatura"}</h3>
          {editingId ? (
            <button type="button" className="icon-action" onClick={resetForm} aria-label="Düzenlemeyi kapat">
              <X size={18} />
            </button>
          ) : null}
        </div>
        <div className="form-grid">
          <label>
            Müşteri
            <input value={form.customer} onChange={(event) => updateField("customer", event.target.value)} required />
          </label>
          <label>
            Açıklama
            <input value={form.description} onChange={(event) => updateField("description", event.target.value)} required />
          </label>
          <label>
            Tutar
            <input type="number" min="0" value={calculatedTotal || form.amount} readOnly />
          </label>
          <label>
            Durum
            <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
              <option>Taslak</option>
              <option>Bekliyor</option>
              <option>Ödendi</option>
            </select>
          </label>
          <label>
            Tarih
            <input value={form.date} onChange={(event) => updateField("date", event.target.value)} required />
          </label>
          <label>İndirim<input type="number" min="0" value={form.discount} onChange={(event) => updateField("discount", event.target.value)} /></label>
          <label>Vergi oranı (%)<input type="number" min="0" value={form.taxRate} onChange={(event) => updateField("taxRate", event.target.value)} /></label>
        </div>
        <div className="invoice-line-editor"><div className="form-heading"><h3>Fatura kalemleri</h3><button type="button" className="outline-mini-btn" onClick={() => setForm((current) => ({ ...current, items: [...current.items, { description: "", quantity: 1, unitPrice: "" }] }))}>Kalem ekle</button></div>{form.items.map((item, index) => <div className="invoice-line" key={`line-${index}`}><input placeholder="Ürün veya işçilik" value={item.description} onChange={(event) => updateItem(index, "description", event.target.value)} required /><input type="number" min="1" placeholder="Adet" value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} required /><input type="number" min="0" placeholder="Birim fiyat" value={item.unitPrice} onChange={(event) => updateItem(index, "unitPrice", event.target.value)} required /><button type="button" onClick={() => setForm((current) => ({ ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) }))}><X size={16} /></button></div>)}<strong className="invoice-total">Hesaplanan toplam: {formatCurrency(calculatedTotal)}</strong></div>
        <button className="primary-btn compact" type="submit" disabled={isSaving}>
          <Save size={18} /> {isSaving ? "Kaydediliyor" : "Kaydet"}
        </button>
      </form>
      <div className="quick-actions">
        <button type="button" onClick={() => setShowReport((current) => !current)}><Download size={18} /> Aylık rapor özeti</button>
        <button type="button" onClick={downloadCsv}><Download size={18} /> CSV indir</button>
      </div>
      {showReport ? (
        <div className="report-panel">
          <span>Aylık fatura özeti</span>
          <strong>{formatCurrency(liveSummary.total)}</strong>
          <p>
            Tahsil edilen {formatCurrency(liveSummary.paid)}, bekleyen/taslak toplam {formatCurrency(liveSummary.pending)}.
            Kontrol bekleyen taslak sayısı: {liveSummary.draft}.
          </p>
        </div>
      ) : null}
      <DataTable
        title="Fatura listesi"
        columns={["No", "Müşteri", "Açıklama", "Tutar", "Durum", "Tarih", "İşlem"]}
        rows={filteredInvoices.map((invoice) => ({
          id: invoice.id,
          cells: [
            invoice.id,
            invoice.customer,
            invoice.description,
            formatCurrency(invoice.amount),
            invoice.status,
            invoice.date,
            <div className="row-actions">
              <button type="button" onClick={() => printInvoice(invoice)} aria-label={`${invoice.id} yazdır`}><Printer size={16} /></button>
              <button type="button" onClick={() => startEdit(invoice)} aria-label={`${invoice.id} düzenle`}>
                <Pencil size={16} />
              </button>
              <button type="button" onClick={() => deleteInvoice(invoice.id)} aria-label={`${invoice.id} sil`}>
                <Trash2 size={16} />
              </button>
            </div>,
          ],
        }))}
      />
    </>
  );
}
