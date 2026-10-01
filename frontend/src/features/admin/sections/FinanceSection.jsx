import { useMemo, useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { MetricCard } from "../../../components/ui/MetricCard.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { ResourceNotice } from "../../../components/ui/ResourceNotice.jsx";
import { useApiResource } from "../../../hooks/useApiResource.js";
import { api } from "../../../services/apiClient.js";
import { formatCurrency } from "../../../utils/formatters.js";

const emptyLineForm = {
  label: "",
  amount: "",
  type: "Gider",
};

const emptyInvoiceSummary = { paidTotal: 0 };

function sumAmounts(lines, type) {
  return lines
    .filter((line) => line.type === type)
    .reduce((total, line) => total + Math.round(Number(line.amount || 0) * 100), 0) / 100;
}

export function FinanceSection() {
  const { data: lines, setData: setLines, reload, error, isLoading } = useApiResource(api.balance.list, []);
  const { data: invoiceSummary, error: summaryError } = useApiResource(api.invoices.summary, emptyInvoiceSummary);
  const [form, setForm] = useState(emptyLineForm);
  const [editingId, setEditingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredLines = useMemo(() => typeFilter === "all"
    ? lines
    : lines.filter((line) => line.type === typeFilter), [lines, typeFilter]);

  const totals = useMemo(() => {
    const invoiceIncome = Number(invoiceSummary.paidTotal || 0);
    const otherIncome = sumAmounts(lines, "Gelir");
    const expenses = sumAmounts(lines, "Gider");

    return {
      invoiceIncome,
      otherIncome,
      expenses,
      net: Math.round((invoiceIncome + otherIncome - expenses) * 100) / 100,
    };
  }, [invoiceSummary, lines]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyLineForm);
    setActionError(null);
  };

  const startEdit = (line) => {
    setEditingId(line.id);
    setActionError(null);
    setForm({
      label: line.label,
      amount: line.amount,
      type: line.type,
    });
  };

  const saveLine = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setActionError(null);

    try {
      if (editingId) {
        const updatedLine = await api.balance.update(editingId, form);
        setLines((current) => current.map((line) => line.id === editingId ? updatedLine : line));
      } else {
        const createdLine = await api.balance.create(form);
        setLines((current) => [createdLine, ...current]);
      }

      resetForm();
      await reload();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLine = async (line) => {
    if (!window.confirm(`“${line.label}” kaydını silmek istediğinizden emin misiniz?`)) return;
    setActionError(null);

    try {
      await api.balance.delete(line.id);
      setLines((current) => current.filter((item) => item.id !== line.id));
      if (editingId === line.id) resetForm();
      await reload();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  };

  return (
    <>
      <PageHeading title="Gelir ve gider" description="Fatura dışı gelirleri ve işletme giderlerini kaydedin." chip={`${lines.length} kayıt`} />
      <ResourceNotice isLoading={isLoading} error={error || summaryError} />
      {actionError ? <div className="resource-notice error">{actionError}</div> : null}
      <div className="metric-grid">
        <MetricCard label="Fatura geliri" value={formatCurrency(totals.invoiceIncome)} trend="Ödenen faturalar" />
        <MetricCard label="Diğer gelir" value={formatCurrency(totals.otherIncome)} trend="Elle girilen" />
        <MetricCard label="Gider" value={formatCurrency(totals.expenses)} trend="Elle girilen" />
        <MetricCard label="Net bilanço" value={formatCurrency(totals.net)} trend="Gelir − gider" />
      </div>
      <div className="admin-toolbar">
        <div className="segmented-control" aria-label="Kayıt türü">
          <button className={typeFilter === "all" ? "active" : ""} type="button" onClick={() => setTypeFilter("all")}>Tümü</button>
          <button className={typeFilter === "Gelir" ? "active" : ""} type="button" onClick={() => setTypeFilter("Gelir")}>Gelir</button>
          <button className={typeFilter === "Gider" ? "active" : ""} type="button" onClick={() => setTypeFilter("Gider")}>Gider</button>
        </div>
        <button className="primary-btn compact" type="button" onClick={resetForm}><Plus size={18} /> Kayıt ekle</button>
      </div>
      <form className="admin-form" onSubmit={saveLine}>
        <div className="form-heading">
          <h3>{editingId ? "Kaydı düzenle" : "Yeni kayıt"}</h3>
          {editingId ? (
            <button type="button" className="icon-action" onClick={resetForm} aria-label="Düzenlemeyi kapat">
              <X size={18} />
            </button>
          ) : null}
        </div>
        <div className="form-grid">
          <label>
            Açıklama
            <input value={form.label} maxLength={200} onChange={(event) => updateField("label", event.target.value)} required />
          </label>
          <label>
            Tutar
            <input type="number" min="0" step="0.01" value={form.amount} onChange={(event) => updateField("amount", event.target.value)} required />
          </label>
          <label>
            Tür
            <select value={form.type} onChange={(event) => updateField("type", event.target.value)}>
              <option>Gider</option>
              <option>Gelir</option>
            </select>
          </label>
        </div>
        <button className="primary-btn compact" type="submit" disabled={isSaving}>
          <Save size={18} /> {isSaving ? "Kaydediliyor" : "Kaydet"}
        </button>
      </form>
      <p className="branding-storage-note">Ödenen faturalar gelire kendiliğinden eklenir; burada yalnızca fatura dışı gelirleri ve giderleri girin.</p>
      <DataTable
        title="Gelir ve gider kayıtları"
        columns={["Açıklama", "Tutar", "Tür", "İşlem"]}
        rows={filteredLines.map((line) => ({
          id: line.id,
          cells: [
            line.label,
            formatCurrency(line.amount),
            line.type,
            <div className="row-actions">
              <button type="button" onClick={() => startEdit(line)} aria-label={`${line.label} düzenle`}>
                <Pencil size={16} />
              </button>
              <button type="button" onClick={() => deleteLine(line)} aria-label={`${line.label} sil`}>
                <Trash2 size={16} />
              </button>
            </div>,
          ],
        }))}
      />
    </>
  );
}
