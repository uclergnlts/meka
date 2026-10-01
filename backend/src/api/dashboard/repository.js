import { prisma } from "../../lib/prisma.js";

export const operationRepository = {
  findServiceJobs() {
    return prisma.serviceJob.findMany({
      orderBy: { createdAt: "asc" },
    });
  },
};
