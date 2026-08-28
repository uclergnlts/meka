import { useMemo, useState } from "react";
import { Pencil, PhoneCall, Save, Search, Trash2, UserPlus, X } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { ResourceNotice } from "../../../components/ui/ResourceNotice.jsx";
import { customers } from "../../../data/operations.js";
import { useApiResource } from "../../../hooks/useApiResource.js";
import { api } from "../../../services/apiClient.js";

const emptyCustomerForm = {
  name: "",
  phone: "",
  motorcycle: "",
  lastAction: "",
  date: "Bugün",
  status: "Aktif servis",
};

export function CustomersSection() {
  const { data: customerList, setData: setCustomerList, reload, error, isLoading } = useApiResource(api.customers.list, customers);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyCustomerForm);
  const [editingId, setEditingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCallList, setShowCallList] = useState(false);

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
  ].includes(customer.status)), [customerList]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyCustomerForm);
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
    });
  };

  const saveCustomer = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setActionError(null);

    try {
      if (editingId) {
        const updatedCustomer = await api.customers.update(editingId, form);
        setCustomerList((current) => current.map((customer) => customer.id === editingId ? updatedCustomer : customer));
      } else {
        const createdCustomer = await api.customers.create(form);
        setCustomerList((current) => [createdCustomer, ...current]);
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
    setActionError(null);

    try {
      await api.customers.delete(customerId);
      setCustomerList((current) => current.filter((customer) => customer.id !== customerId));
      await reload();
    } catch (requestError) {
      setActionError(requestError.message);
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
            </select>
          </label>
        </div>
        <button className="primary-btn compact" type="submit" disabled={isSaving}>
          <Save size={18} /> {isSaving ? "Kaydediliyor" : "Kaydet"}
        </button>
      </form>
      <div className="quick-actions">
        <button type="button" onClick={() => setShowCallList((current) => !current)}><PhoneCall size={18} /> Aranacaklar listesi</button>
      </div>
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
        columns={["Müşteri", "Telefon", "Motosiklet", "Son işlem", "Tarih", "Durum", "İşlem"]}
        rows={filteredCustomers.map((customer) => ({
          id: customer.id,
          cells: [
            customer.name,
            customer.phone,
            customer.motorcycle,
            customer.lastAction,
            customer.date,
            customer.status,
            <div className="row-actions">
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
