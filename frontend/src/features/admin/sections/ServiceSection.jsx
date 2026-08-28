import { useMemo, useState } from "react";
import { CalendarPlus, ClipboardCheck, Save, Search } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { MetricCard } from "../../../components/ui/MetricCard.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { ResourceNotice } from "../../../components/ui/ResourceNotice.jsx";
import { serviceJobs } from "../../../data/operations.js";
import { useApiResource } from "../../../hooks/useApiResource.js";
import { api } from "../../../services/apiClient.js";

const emptyServiceForm = {
  motorcycle: "",
  operation: "",
  schedule: "Bugün",
  status: "Planlandı",
};

export function ServiceSection() {
  const fallbackJobs = serviceJobs.map(([id, motorcycle, operation, schedule, status]) => ({ id, motorcycle, operation, schedule, status }));
  const fallbackSummary = {
    todayAppointments: 5,
    waitingParts: 3,
    readyForDelivery: 4,
    averageDuration: "2.1 gün",
  };
  const { data: jobs, setData: setJobs, error: jobsError, isLoading: jobsLoading } = useApiResource(api.service.jobs, fallbackJobs);
  const { data: summary, error: summaryError, isLoading: summaryLoading } = useApiResource(api.service.summary, fallbackSummary);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState(emptyServiceForm);

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
    setForm(emptyServiceForm);
  };

  const saveJob = (event) => {
    event.preventDefault();
    const numericIds = jobs
      .map((job) => Number(String(job.id).replace(/\D/g, "")))
      .filter(Number.isFinite);
    const nextId = `SRV-${Math.max(442, ...numericIds) + 1}`;

    setJobs((current) => [{
      id: nextId,
      motorcycle: form.motorcycle,
      operation: form.operation,
      schedule: form.schedule,
      status: form.status,
    }, ...current]);
    resetForm();
  };

  return (
    <>
      <PageHeading title="Servis takibi" description="Randevu, atölye durumu ve parça bekleyen işlemleri yönetin." chip="Bugün" />
      <ResourceNotice isLoading={jobsLoading || summaryLoading} error={jobsError || summaryError} />
      <div className="metric-grid service-metrics">
        <MetricCard label="Bugünkü randevu" value={summary.todayAppointments} trend={`${plannedJobs} planlı`} />
        <MetricCard label="Parça bekleyen" value={waitingParts || summary.waitingParts} trend="Stokla eşleşecek" />
        <MetricCard label="Teslim hazır" value={readyForDelivery || summary.readyForDelivery} trend="Müşteri aranacak" />
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
          <h3>Yeni randevu / iş emri</h3>
        </div>
        <div className="form-grid">
          <label>
            Motosiklet
            <input value={form.motorcycle} onChange={(event) => updateField("motorcycle", event.target.value)} placeholder="Yamaha MT-07" required />
          </label>
          <label>
            İşlem
            <input value={form.operation} onChange={(event) => updateField("operation", event.target.value)} placeholder="Yağ + filtre" required />
          </label>
          <label>
            Plan
            <input value={form.schedule} onChange={(event) => updateField("schedule", event.target.value)} required />
          </label>
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
        <button className="primary-btn compact" type="submit">
          <Save size={18} /> Kaydet
        </button>
      </form>
      <div className="quick-actions">
        <button type="button" onClick={() => updateField("status", "Planlandı")}><CalendarPlus size={18} /> Randevu ekle</button>
        <button type="button" onClick={() => updateField("status", "Serviste")}><ClipboardCheck size={18} /> İş emri oluştur</button>
      </div>
      <DataTable
        title="Servis iş emirleri"
        columns={["No", "Motosiklet", "İşlem", "Plan", "Durum"]}
        rows={filteredJobs.map((job) => [job.id, job.motorcycle, job.operation, job.schedule, job.status])}
      />
    </>
  );
}
