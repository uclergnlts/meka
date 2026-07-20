import { useMemo, useState } from "react";
import { Download, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
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

  const filteredInvoices = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

    if (!normalizedQuery) {
      return invoiceList;
    }

    return invoiceList.filter((invoice) => [invoice.id, invoice.customer, invoice.description, invoice.status]
      .join(" ")
      .toLocaleLowerCase("tr-TR")
      .includes(normalizedQuery));
  }, [invoiceList, query]);

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
      if (editingId) {
        const updatedInvoice = await api.invoices.update(editingId, form);
        setInvoiceList((current) => current.map((invoice) => invoice.id === editingId ? updatedInvoice : invoice));
      } else {
        const createdInvoice = await api.invoices.create(form);
        setInvoiceList((current) => [createdInvoice, ...current]);
      }

      resetForm();
      await refreshInvoices();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteInvoice = async (invoiceId) => {
    setActionError(null);

    try {
      await api.invoices.delete(invoiceId);
      setInvoiceList((current) => current.filter((invoice) => invoice.id !== invoiceId));
      await refreshInvoices();
    } catch (requestError) {
      setActionError(requestError.message);
    }
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
            <input type="number" min="0" value={form.amount} onChange={(event) => updateField("amount", event.target.value)} required />
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
        </div>
        <button className="primary-btn compact" type="submit" disabled={isSaving}>
          <Save size={18} /> {isSaving ? "Kaydediliyor" : "Kaydet"}
        </button>
      </form>
      <div className="quick-actions">
        <button type="button"><Download size={18} /> Aylık rapor indir</button>
      </div>
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
