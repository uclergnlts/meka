import { prisma } from "../../lib/prisma.js";

export const balanceRepository = {
  findAll() {
    return prisma.balanceLine.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id) {
    return prisma.balanceLine.findUnique({
      where: { id },
    });
  },

  create(line) {
    return prisma.balanceLine.create({
      data: line,
    });
  },

  update(id, updates) {
    return prisma.balanceLine.update({
      where: { id },
      data: updates,
    });
  },

  delete(id) {
    return prisma.balanceLine.delete({
      where: { id },
    });
  },
};
