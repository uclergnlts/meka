import { customerRepository } from "../customers/repository.js";
import { stockService } from "../stock/service.js";
import { operationRepository } from "./repository.js";

export const dashboardService = {
  async getSummary() {
    const [balanceLines, lowStock, serviceJobs, customers] = await Promise.all([
      operationRepository.findBalanceLines(),
      stockService.listAlerts(),
      operationRepository.findServiceJobs(),
      customerRepository.findAll(),
    ]);
    const income = balanceLines.filter((line) => line.type === "Gelir").reduce((total, line) => total + Number(line.amount), 0);
    const expenses = balanceLines.filter((line) => line.type === "Gider").reduce((total, line) => total + Number(line.amount), 0);

    return {
      metrics: {
        income,
        expenses,
        netBalance: income - expenses,
        openServices: serviceJobs.filter((job) => job.status !== "Tamamlandı").length,
      },
      lowStock,
      serviceJobs,
      customers,
      balanceLines,
    };
  },
};
