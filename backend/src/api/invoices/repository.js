import { prisma } from "../../lib/prisma.js";

export const invoiceRepository = {
  findAll() {
    return prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id) {
    return prisma.invoice.findUnique({
      where: { id },
    });
  },

  create(invoice) {
    return prisma.invoice.create({
      data: invoice,
    });
  },

  update(id, updates) {
    return prisma.invoice.update({
      where: { id },
      data: updates,
    });
  },

  delete(id) {
    return prisma.invoice.delete({
      where: { id },
    });
  },
};
