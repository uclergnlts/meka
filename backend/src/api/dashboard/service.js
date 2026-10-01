import { balanceRepository } from "../balance/repository.js";
import { customerRepository } from "../customers/repository.js";
import { invoiceRepository } from "../invoices/repository.js";
import { stockService } from "../stock/service.js";
import { operationRepository } from "./repository.js";

// Money is summed in whole kuruş so DECIMAL values do not pick up float drift.
function sumCents(rows) {
  return rows.reduce((total, row) => total + Math.round(Number(row.amount) * 100), 0);
}

export const dashboardService = {
  async getSummary() {
    const [balanceLines, invoices, lowStock, serviceJobs, customers] = await Promise.all([
      balanceRepository.findAll(),
      invoiceRepository.findAll(),
      stockService.listAlerts(),
      operationRepository.findServiceJobs(),
      customerRepository.findAll(),
    ]);
    // Income is what was actually collected on invoices plus any income entered by hand.
    const invoiceIncome = sumCents(invoices.filter((invoice) => invoice.status === "Ödendi"));
    const otherIncome = sumCents(balanceLines.filter((line) => line.type === "Gelir"));
    const expenses = sumCents(balanceLines.filter((line) => line.type === "Gider"));

    return {
      metrics: {
        income: (invoiceIncome + otherIncome) / 100,
        invoiceIncome: invoiceIncome / 100,
        otherIncome: otherIncome / 100,
        expenses: expenses / 100,
        netBalance: (invoiceIncome + otherIncome - expenses) / 100,
        openServices: serviceJobs.filter((job) => job.status !== "Tamamlandı").length,
      },
      lowStock,
      serviceJobs,
      customers,
      balanceLines,
    };
  },
};
