import { useMemo, useState } from "react";
import { CalendarPlus, ClipboardCheck, Download, Pencil, Save, Search, Trash2, X } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { MetricCard } from "../../../components/ui/MetricCard.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { ResourceNotice } from "../../../components/ui/ResourceNotice.jsx";
import { useApiResource } from "../../../hooks/useApiResource.js";
import { api } from "../../../services/apiClient.js";

function createEmptyServiceForm() {
  return {
    customer: "",
    phone: "",
    motorcycle: "",
    plate: "",
    mileage: "",
    operation: "",
    schedule: new Date().toISOString().slice(0, 10),
    status: "Planlandı",
    parts: "",
    labor: "",
    notes: "",
  };
}

export function ServiceSection() {
  const { data: jobs, reload: reloadJobs, error: jobsError, isLoading: jobsLoading } = useApiResource(api.service.jobs, []);
  const { data: summary, error: summaryError, isLoading: summaryLoading } = useApiResource(api.service.summary, { averageDuration: "-" });
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState(createEmptyServiceForm);
  const [editingId, setEditingId] = useState(null);
  const [calendarMode, setCalendarMode] = useState("week");
  const [actionError, setActionError] = useState(null);

  const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");
  const filteredJobs = useMemo(() => jobs
    .filter((job) => statusFilter === "all" ? true : job.status === statusFilter)
    .filter((job) => {
      if (!normalizedQuery) {
        return true;
      }

      return [job.id, job.motorcycle, job.operation, job.schedule, job.status]
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(normalizedQuery);
    }), [jobs, normalizedQuery, statusFilter]);

  const waitingParts = jobs.filter((job) => job.status === "Parça bekliyor").length;
  const readyForDelivery = jobs.filter((job) => job.status === "Teslim hazır").length;
  const plannedJobs = jobs.filter((job) => job.status === "Planlandı").length;

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(createEmptyServiceForm());
    setEditingId(null);
    setActionError(null);
  };

  const startEdit = (job) => {
    setEditingId(job.id);
    setForm({ ...createEmptyServiceForm(), ...job });
    setActionError(null);
  };

  const [isSaving, setIsSaving] = useState(false);
  const saveJob = async (event) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true); setActionError(null);
    try {
      if (editingId) await api.service.update(editingId, form);
      else await api.service.create(form);
      resetForm(); await reloadJobs();
    } catch (error) { setActionError(error.message); }
    finally { setIsSaving(false); }
  };
  const deleteJob = async (job) => {
    if (!window.confirm(`“${job.id}” iş emrini silmek istediğinizden emin misiniz?`)) return;
    try { await api.service.delete(job.id); if (editingId === job.id) resetForm(); await reloadJobs(); }
    catch (error) { setActionError(error.message); }
  };

  const printJob = (job) => {
    const safe = (value) => String(value ?? "-").replace(/[<>&]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[char]);
    const popup = window.open("", "_blank", "width=850,height=700");
    if (!popup) return;
    popup.document.write(`<html><head><title>${safe(job.id)} Servis Formu</title><style>body{font-family:Arial;padding:40px;color:#151515}h1{border-bottom:3px solid #d60000;padding-bottom:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.box{border:1px solid #ddd;padding:12px}.wide{grid-column:1/-1}@media print{button{display:none}}</style></head><body><h1>MEKA Moto Garage · Servis İş Emri</h1><div class="grid"><div class="box"><b>No:</b> ${safe(job.id)}</div><div class="box"><b>Tarih:</b> ${safe(job.schedule)}</div><div class="box"><b>Müşteri:</b> ${safe(job.customer)}</div><div class="box"><b>Telefon:</b> ${safe(job.phone)}</div><div class="box"><b>Motosiklet:</b> ${safe(job.motorcycle)}</div><div class="box"><b>Plaka / Km:</b> ${safe(job.plate)} · ${safe(job.mileage)}</div><div class="box wide"><b>İşlem:</b> ${safe(job.operation)}</div><div class="box wide"><b>Kullanılan parçalar:</b> ${safe(job.parts)}</div><div class="box"><b>İşçilik:</b> ${safe(job.labor)}</div><div class="box"><b>Durum:</b> ${safe(job.status)}</div><div class="box wide"><b>Notlar:</b> ${safe(job.notes)}</div></div><p><br> Müşteri imzası: ____________________</p><button onclick="window.print()">Yazdır</button></body></html>`);
    popup.document.close();
  };

  const downloadCsv = () => {
    const rows = [["İş emri", "Motosiklet", "İşlem", "Plan", "Durum"], ...filteredJobs.map((job) => [job.id, job.motorcycle, job.operation, job.schedule, job.status])];
    const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(";")).join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "meka-servis-is-emirleri.csv"; link.click(); URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeading title="Servis takibi" description="Randevu, atölye durumu ve parça bekleyen işlemleri yönetin." chip="Bugün" />
      <ResourceNotice isLoading={summaryLoading || jobsLoading} error={jobsError || summaryError} />
      {actionError ? <div className="resource-notice error">{actionError}</div> : null}
      <div className="metric-grid service-metrics">
        <MetricCard label="Planlı randevu" value={plannedJobs} trend={`${jobs.length} toplam iş`} />
        <MetricCard label="Parça bekleyen" value={waitingParts} trend="Stokla eşleşecek" />
        <MetricCard label="Teslim hazır" value={readyForDelivery} trend="Müşteri aranacak" />
        <MetricCard label="Ortalama süre" value={summary.averageDuration} trend="Servis" />
      </div>
      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={17} />
          <input type="search" placeholder="İş emri, motosiklet veya işlem ara" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="segmented-control" aria-label="Servis durum filtresi">
          <button className={statusFilter === "all" ? "active" : ""} type="button" onClick={() => setStatusFilter("all")}>Tümü</button>
          <button className={statusFilter === "Planlandı" ? "active" : ""} type="button" onClick={() => setStatusFilter("Planlandı")}>Planlı</button>
          <button className={statusFilter === "Parça bekliyor" ? "active" : ""} type="button" onClick={() => setStatusFilter("Parça bekliyor")}>Parça</button>
        </div>
      </div>
      <form className="admin-form" onSubmit={saveJob}>
        <div className="form-heading">
          <h3>{editingId ? `${editingId} iş emrini düzenle` : "Yeni randevu / iş emri"}</h3>
          {editingId ? <button type="button" className="icon-action" onClick={resetForm} aria-label="Düzenlemeyi kapat"><X size={18} /></button> : null}
        </div>
        <div className="form-grid">
          <label>Müşteri<input value={form.customer} onChange={(event) => updateField("customer", event.target.value)} required /></label>
          <label>Telefon<input value={form.phone} onChange={(event) => updateField("phone", event.target.value)} required /></label>
          <label>
            Motosiklet
            <input value={form.motorcycle} onChange={(event) => updateField("motorcycle", event.target.value)} placeholder="Yamaha MT-07" required />
          </label>
          <label>
            İşlem
            <input value={form.operation} onChange={(event) => updateField("operation", event.target.value)} placeholder="Yağ + filtre" required />
          </label>
          <label>Plaka<input value={form.plate} onChange={(event) => updateField("plate", event.target.value)} /></label>
          <label>Kilometre<input type="number" min="0" value={form.mileage} onChange={(event) => updateField("mileage", event.target.value)} /></label>
          <label>
            Plan
            <input type="date" value={form.schedule} onChange={(event) => updateField("schedule", event.target.value)} required />
          </label>
          <label>Kullanılan parçalar<input value={form.parts} onChange={(event) => updateField("parts", event.target.value)} placeholder="Parça ve adet" /></label>
          <label>İşçilik tutarı<input type="number" min="0" value={form.labor} onChange={(event) => updateField("labor", event.target.value)} /></label>
          <label className="form-span-2">Teknisyen notları<textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} /></label>
          <label>
            Durum
            <select value={form.status} onChange={(event) => updateField("status", event.target.value)}>
              <option>Planlandı</option>
              <option>Serviste</option>
              <option>Parça bekliyor</option>
              <option>Teslim hazır</option>
              <option>Tamamlandı</option>
            </select>
          </label>
        </div>
        <button className="primary-btn compact" type="submit" disabled={isSaving || jobsLoading || Boolean(jobsError)}>
          <Save size={18} /> Kaydet
        </button>
      </form>
      <div className="quick-actions">
        <button type="button" onClick={() => updateField("status", "Planlandı")}><CalendarPlus size={18} /> Randevu ekle</button>
        <button type="button" onClick={() => updateField("status", "Serviste")}><ClipboardCheck size={18} /> İş emri oluştur</button>
        <button type="button" onClick={downloadCsv}><Download size={18} /> Servis CSV</button>
      </div>
      <div className="calendar-panel"><div className="form-heading"><h3>Servis takvimi</h3><div className="segmented-control"><button className={calendarMode === "day" ? "active" : ""} type="button" onClick={() => setCalendarMode("day")}>Gün</button><button className={calendarMode === "week" ? "active" : ""} type="button" onClick={() => setCalendarMode("week")}>Hafta</button><button className={calendarMode === "month" ? "active" : ""} type="button" onClick={() => setCalendarMode("month")}>Ay</button></div></div><div className={`service-calendar ${calendarMode}`}>{[...jobs].sort((a,b) => String(a.schedule).localeCompare(String(b.schedule))).slice(0, calendarMode === "day" ? 4 : calendarMode === "week" ? 10 : 31).map((job) => <button type="button" onClick={() => startEdit(job)} key={`cal-${job.id}`}><strong>{job.schedule}</strong><span>{job.motorcycle}</span><small>{job.status}</small></button>)}</div></div>
      <DataTable
        title="Servis iş emirleri"
        columns={["No", "Müşteri", "Motosiklet", "İşlem", "Plan", "Durum", "İşlem"]}
        rows={filteredJobs.map((job) => ({ id: job.id, cells: [job.id, job.customer || "-", job.motorcycle, job.operation, job.schedule, job.status, <div className="row-actions"><button type="button" onClick={() => printJob(job)} aria-label={`${job.id} yazdır`}><ClipboardCheck size={16} /></button><button type="button" onClick={() => startEdit(job)} aria-label={`${job.id} düzenle`}><Pencil size={16} /></button><button type="button" onClick={() => deleteJob(job)} aria-label={`${job.id} sil`}><Trash2 size={16} /></button></div>] }))}
      />
    </>
  );
}
