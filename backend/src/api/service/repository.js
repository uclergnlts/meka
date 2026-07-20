import { prisma } from "../../lib/prisma.js";

export const serviceRepository = {
  findJobs() {
    return prisma.serviceJob.findMany({
      orderBy: { createdAt: "asc" },
    });
  },
};
