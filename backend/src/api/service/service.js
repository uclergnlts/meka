import { serviceRepository } from "./repository.js";

export const serviceService = {
  async listJobs() {
    return serviceRepository.findJobs();
  },

  async getSummary() {
    const jobs = await serviceRepository.findJobs();

    return {
      todayAppointments: 5,
      waitingParts: jobs.filter((job) => job.status === "Parça bekliyor").length,
      readyForDelivery: 4,
      averageDuration: "2.1 gün",
    };
  },
};
