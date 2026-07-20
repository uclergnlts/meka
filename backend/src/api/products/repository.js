import { prisma } from "../../lib/prisma.js";

export const productRepository = {
  findAll() {
    return prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id) {
    return prisma.product.findUnique({
      where: { id },
    });
  },

  create(product) {
    return prisma.product.create({
      data: product,
    });
  },

  update(id, updates) {
    return prisma.product.update({
      where: { id },
      data: updates,
    });
  },

  delete(id) {
    return prisma.product.delete({
      where: { id },
    });
  },
};
