import { useMemo, useState } from "react";
import { Download, Eye, Pencil, PhoneCall, Save, Search, Trash2, UserPlus, X } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { ResourceNotice } from "../../../components/ui/ResourceNotice.jsx";
import { useApiResource } from "../../../hooks/useApiResource.js";
import { api } from "../../../services/apiClient.js";
import { todayIso } from "../../../utils/formatters.js";
import { whatsappLink } from "../../../utils/whatsapp.js";

const createEmptyCustomerForm = () => ({
  name: "",
  phone: "",
  motorcycle: "",
  lastAction: "",
  date: todayIso(),
  status: "Aktif servis",
  nextMaintenance: "",
  notes: "",
});

export function CustomersSection() {
  const { data: customerList, setData: setCustomerList, reload, error, isLoading } = useApiResource(api.customers.list, []);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(createEmptyCustomerForm);
  const [editingId, setEditingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCallList, setShowCallList] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
    const statusFiltered = statusFilter === "all"
      ? customerList
      : customerList.filter((customer) => customer.status === statusFilter);

    if (!normalizedQuery) {
      return statusFiltered;
    }

    return statusFiltered.filter((customer) => [customer.name, customer.phone, customer.motorcycle, customer.lastAction, customer.status]
      .join(" ")
      .toLocaleLowerCase("tr-TR")
      .includes(normalizedQuery));
  }, [customerList, query, statusFilter]);

  const callList = useMemo(() => customerList.filter((customer) => [
    "Aktif servis",
    "Teklif bekliyor",
    "Randevu alındı",
    "Aranacak",
  ].includes(customer.status)), [customerList]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(createEmptyCustomerForm());
    setActionError(null);
  };

  const startEdit = (customer) => {
    setEditingId(customer.id);
    setActionError(null);
    setForm({
      name: customer.name,
      phone: customer.phone,
      motorcycle: customer.motorcycle,
      lastAction: customer.lastAction,
      date: customer.date,
      status: customer.status,
      nextMaintenance: customer.nextMaintenance ?? "",
      notes: customer.notes ?? "",
    });
  };

  const saveCustomer = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setActionError(null);

    try {
      if (editingId) {
        const updatedCustomer = await api.customers.update(editingId, form);
        setCustomerList((current) => current.map((customer) => customer.id === editingId ? { ...updatedCustomer, ...form } : customer));
      } else {
        const createdCustomer = await api.customers.create(form);
        setCustomerList((current) => [{ ...createdCustomer, ...form }, ...current]);
      }

      resetForm();
      await reload();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCustomer = async (customerId) => {
    const customer = customerList.find((item) => item.id === customerId);
    if (!window.confirm(`“${customer?.name ?? customerId}” müşteri kaydını silmek istediğinizden emin misiniz?`)) return;
    setActionError(null);

    try {
      await api.customers.delete(customerId);
      setCustomerList((current) => current.filter((customer) => customer.id !== customerId));
      setSelectedIds((current) => current.filter((id) => id !== customerId));
      if (selectedCustomer?.id === customerId) setSelectedCustomer(null);
      await reload();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  };

  const downloadCsv = () => {
    const rows = [["Müşteri", "Telefon", "Motosiklet", "Son işlem", "Tarih", "Durum"], ...filteredCustomers.map((customer) => [customer.name, customer.phone, customer.motorcycle, customer.lastAction, customer.date, customer.status])];
    const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(";")).join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "meka-musteriler.csv"; link.click(); URL.revokeObjectURL(url);
  };

  const reminders = customerList.filter((customer) => customer.nextMaintenance).sort((a, b) => a.nextMaintenance.localeCompare(b.nextMaintenance));
  const bulkStatus = async (status) => {
    if (!selectedIds.length) return;
    const ids = [...selectedIds];
    setIsBulkSaving(true);
    setActionError(null);
    try {
      await Promise.all(ids.map((id) => api.customers.update(id, { status })));
      setCustomerList((current) => current.map((customer) => ids.includes(customer.id) ? { ...customer, status } : customer));
      setSelectedIds([]);
      await reload();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setIsBulkSaving(false);
    }
  };
  const bulkDelete = async () => {
    if (!selectedIds.length || !window.confirm(`${selectedIds.length} müşteri kaydı listeden çıkarılacak. Devam edilsin mi?`)) return;
    const ids = [...selectedIds];
    setIsBulkSaving(true);
    setActionError(null);
    try {
      await Promise.all(ids.map((id) => api.customers.delete(id)));
      setCustomerList((current) => current.filter((customer) => !ids.includes(customer.id)));
      if (selectedCustomer && ids.includes(selectedCustomer.id)) setSelectedCustomer(null);
      setSelectedIds([]);
      await reload();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setIsBulkSaving(false);
    }
  };

  return (
    <>
      <PageHeading title="Müşteri yönetimi" description="Müşteri, motosiklet ve servis geçmişi kayıtlarını takip edin." chip={`${customerList.length} müşteri`} />
      <ResourceNotice isLoading={isLoading} error={error} />
      {actionError ? <div className="resource-notice error">{actionError}</div> : null}
      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={17} />
          <input type="search" placeholder="Müşteri, telefon veya motosiklet ara" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="segmented-control" aria-label="Müşteri durumu">
          <button className={statusFilter === "all" ? "active" : ""} type="button" onClick={() => setStatusFilter("all")}>Tümü</button>
          <button className={statusFilter === "Aktif servis" ? "active" : ""} type="button" onClick={() => setStatusFilter("Aktif servis")}>Servis</button>
          <button className={statusFilter === "Teklif bekliyor" ? "active" : ""} type="button" onClick={() => setStatusFilter("Teklif bekliyor")}>Teklif</button>
        </div>
        <button className="primary-btn compact" type="button" onClick={resetForm}><UserPlus size={18} /> Müşteri ekle</button>
      </div>
      <form className="admin-form" onSubmit={saveCustomer}>
        <div className="form-heading">
          <h3>{editingId ? "Müşteriyi düzenle" : "Yeni müşteri"}</h3>
          {editingId ? (
            <button type="button" className="icon-action" onClick={resetForm} aria-label="Düzenlemeyi kapat">
              <X size={18} />
            </button>
          ) : null}
        </div>
        <div className="form-grid">
          <label>
            Müşteri adı
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
          </label>
          <label>
            Telefon
            <input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} required />
          </label>
          <label>
            Motosiklet
            <input value={form.motorcycle} onChange={(event) => updateField("motorcycle", event.target.value)} required />
          </label>
          <label>
            Son işlem
            <input value={form.lastAction} onChange={(event) => updateField("lastAction", event.target.value)} required />
          </label>
          <label>
            Tarih
            <input value={form.date} onChange={(event) => updateField("date", event.target.value)} />
          </label>
          <label>
            Durum
            <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
              <option>Aktif servis</option>
              <option>Teklif bekliyor</option>
              <option>Teslim edildi</option>
              <option>Randevu alındı</option>
              <option>Aranacak</option>
            </select>
          </label>
          <label>Sonraki bakım<input type="date" value={form.nextMaintenance} onChange={(event) => updateField("nextMaintenance", event.target.value)} /></label>
          <label>Notlar<input value={form.notes} onChange={(event) => updateField("notes", event.target.value)} /></label>
        </div>
        <button className="primary-btn compact" type="submit" disabled={isSaving}>
          <Save size={18} /> {isSaving ? "Kaydediliyor" : "Kaydet"}
        </button>
      </form>
      <div className="quick-actions">
        <button type="button" onClick={() => setShowCallList((current) => !current)}><PhoneCall size={18} /> Aranacaklar listesi</button>
        <button type="button" onClick={downloadCsv}><Download size={18} /> Müşteri CSV</button>
      </div>
      <div className="bulk-toolbar"><span>{selectedIds.length} kayıt seçili</span><button type="button" disabled={!selectedIds.length || isBulkSaving} onClick={() => bulkStatus("Aranacak")}>Aranacak yap</button><button type="button" disabled={!selectedIds.length || isBulkSaving} onClick={() => bulkStatus("Teslim edildi")}>Teslim edildi yap</button><button className="danger-text" type="button" disabled={!selectedIds.length || isBulkSaving} onClick={bulkDelete}>Seçilenleri kaldır</button></div>
      {reminders.length ? <div className="reminder-panel"><div className="form-heading"><h3>Bakım hatırlatmaları</h3><span>{reminders.length} kayıt</span></div>{reminders.slice(0, 8).map((customer) => <a href={whatsappLink(customer.phone, `Merhaba ${customer.name}, ${customer.motorcycle} için yaklaşan bakımınızı hatırlatmak isteriz.`)} target="_blank" rel="noreferrer" key={`rem-${customer.id}`}><strong>{customer.name}</strong><span>{customer.motorcycle}</span><small>{customer.nextMaintenance}</small></a>)}</div> : null}
      {selectedCustomer ? <div className="customer-detail-card"><div className="form-heading"><h3>{selectedCustomer.name}</h3><button className="icon-action" type="button" onClick={() => setSelectedCustomer(null)} aria-label="Müşteri kartını kapat"><X size={18} /></button></div><div className="customer-detail-grid"><span><small>Telefon</small><strong>{selectedCustomer.phone}</strong></span><span><small>Motosiklet</small><strong>{selectedCustomer.motorcycle}</strong></span><span><small>Son işlem</small><strong>{selectedCustomer.lastAction}</strong></span><span><small>Sonraki bakım</small><strong>{selectedCustomer.nextMaintenance || "Planlanmadı"}</strong></span><span className="wide"><small>Notlar</small><strong>{selectedCustomer.notes || "Not bulunmuyor"}</strong></span></div></div> : null}
      {showCallList ? (
        <div className="call-list-panel">
          {callList.map((customer) => (
            <a href={`tel:${customer.phone.replaceAll(" ", "")}`} key={customer.id}>
              <span>{customer.name}</span>
              <strong>{customer.phone}</strong>
              <small>{customer.status} · {customer.motorcycle}</small>
            </a>
          ))}
        </div>
      ) : null}
      <DataTable
        title="Müşteri kartları"
        columns={["Seç", "Müşteri", "Telefon", "Motosiklet", "Son işlem", "Tarih", "Durum", "İşlem"]}
        rows={filteredCustomers.map((customer) => ({
          id: customer.id,
          cells: [
            <input type="checkbox" checked={selectedIds.includes(customer.id)} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, customer.id] : current.filter((id) => id !== customer.id))} aria-label={`${customer.name} seç`} />,
            customer.name,
            customer.phone,
            customer.motorcycle,
            customer.lastAction,
            customer.date,
            customer.status,
            <div className="row-actions">
              <button type="button" onClick={() => setSelectedCustomer(customer)} aria-label={`${customer.name} detay`}><Eye size={16} /></button>
              <button type="button" onClick={() => startEdit(customer)} aria-label={`${customer.name} düzenle`}>
                <Pencil size={16} />
              </button>
              <button type="button" onClick={() => deleteCustomer(customer.id)} aria-label={`${customer.name} sil`}>
                <Trash2 size={16} />
              </button>
            </div>,
          ],
        }))}
      />
    </>
  );
}
