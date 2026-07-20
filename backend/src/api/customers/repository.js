import { prisma } from "../../lib/prisma.js";

export const customerRepository = {
  findAll() {
    return prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id) {
    return prisma.customer.findUnique({
      where: { id },
    });
  },

  create(customer) {
    return prisma.customer.create({
      data: customer,
    });
  },

  update(id, updates) {
    return prisma.customer.update({
      where: { id },
      data: updates,
    });
  },

  delete(id) {
    return prisma.customer.delete({
      where: { id },
    });
  },
};
