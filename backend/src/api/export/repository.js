import { prisma } from "../../lib/prisma.js";

const oldestFirst = { orderBy: { createdAt: "asc" } };

export const exportRepository = {
  // Admin accounts and sessions are left out on purpose: the file is for records, not credentials.
  async findAllRecords() {
    const [products, customers, invoices, serviceJobs, balanceLines, stockMovements, settings] = await Promise.all([
      prisma.product.findMany(oldestFirst),
      prisma.customer.findMany(oldestFirst),
      prisma.invoice.findMany(oldestFirst),
      prisma.serviceJob.findMany(oldestFirst),
      prisma.balanceLine.findMany(oldestFirst),
      prisma.stockMovement.findMany(oldestFirst),
      prisma.setting.findMany({ orderBy: { key: "asc" } }),
    ]);

    return { products, customers, invoices, serviceJobs, balanceLines, stockMovements, settings };
  },
};
