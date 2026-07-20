import { CalendarPlus, ClipboardCheck } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { MetricCard } from "../../../components/ui/MetricCard.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { ResourceNotice } from "../../../components/ui/ResourceNotice.jsx";
import { serviceJobs } from "../../../data/operations.js";
import { useApiResource } from "../../../hooks/useApiResource.js";
import { api } from "../../../services/apiClient.js";

export function ServiceSection() {
  const fallbackJobs = serviceJobs.map(([id, motorcycle, operation, schedule, status]) => ({ id, motorcycle, operation, schedule, status }));
  const fallbackSummary = {
    todayAppointments: 5,
    waitingParts: 3,
    readyForDelivery: 4,
    averageDuration: "2.1 gün",
  };
  const { data: jobs, error: jobsError, isLoading: jobsLoading } = useApiResource(api.service.jobs, fallbackJobs);
  const { data: summary, error: summaryError, isLoading: summaryLoading } = useApiResource(api.service.summary, fallbackSummary);

  return (
    <>
      <PageHeading title="Servis takibi" description="Randevu, atölye durumu ve parça bekleyen işlemleri yönetin." chip="Bugün" />
      <ResourceNotice isLoading={jobsLoading || summaryLoading} error={jobsError || summaryError} />
      <div className="metric-grid service-metrics">
        <MetricCard label="Bugünkü randevu" value={summary.todayAppointments} trend="2 tamamlandı" />
        <MetricCard label="Parça bekleyen" value={summary.waitingParts} trend="Stokla eşleşecek" />
        <MetricCard label="Teslim hazır" value={summary.readyForDelivery} trend="Müşteri aranacak" />
        <MetricCard label="Ortalama süre" value={summary.averageDuration} trend="Servis" />
      </div>
      <div className="quick-actions">
        <button type="button"><CalendarPlus size={18} /> Randevu ekle</button>
        <button type="button"><ClipboardCheck size={18} /> İş emri oluştur</button>
      </div>
      <DataTable
        title="Servis iş emirleri"
        columns={["No", "Motosiklet", "İşlem", "Plan", "Durum"]}
        rows={jobs.map((job) => [job.id, job.motorcycle, job.operation, job.schedule, job.status])}
      />
    </>
  );
}
