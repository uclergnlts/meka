import { serviceRepository } from "./repository.js";

export const serviceService = {
  async listJobs() {
    return serviceRepository.findJobs();
  },

  async getSummary() {
    const jobs = await serviceRepository.findJobs();
    const today = new Date().toISOString().slice(0, 10);

    return {
      todayAppointments: jobs.filter((job) => job.schedule === today || job.schedule.startsWith("Bugün")).length,
      waitingParts: jobs.filter((job) => job.status === "Parça bekliyor").length,
      readyForDelivery: jobs.filter((job) => job.status === "Teslim hazır").length,
      averageDuration: "-",
    };
  },
};
