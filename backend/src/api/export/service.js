import { exportRepository } from "./repository.js";

export const exportService = {
  async exportRecords() {
    return {
      application: "MEKA Moto Garage",
      version: 2,
      exportedAt: new Date().toISOString(),
      records: await exportRepository.findAllRecords(),
    };
  },
};
