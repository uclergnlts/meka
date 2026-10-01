import { serviceRepository } from "./repository.js";

export const serviceService = {
  async listJobs() {
    return serviceRepository.findJobs();
  },

  async getSummary() {
    const jobs = await serviceRepository.findJobs();
    // en-CA formats as YYYY-MM-DD; the shop's day runs on Istanbul time, not UTC.
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(new Date());

    return {
      todayAppointments: jobs.filter((job) => job.schedule === today || job.schedule.startsWith("Bugün")).length,
      waitingParts: jobs.filter((job) => job.status === "Parça bekliyor").length,
      readyForDelivery: jobs.filter((job) => job.status === "Teslim hazır").length,
      averageDuration: "-",
    };
  },
};
