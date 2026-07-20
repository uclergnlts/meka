import { prisma } from "../../lib/prisma.js";

export const operationRepository = {
  findServiceJobs() {
    return prisma.serviceJob.findMany({
      orderBy: { createdAt: "asc" },
    });
  },

  findBalanceLines() {
    return prisma.balanceLine.findMany({
      orderBy: { createdAt: "asc" },
    });
  },
};
