import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma.js";

export const productRepository = {
  // A stock edit on the product card is saved together with a movement for the difference,
  // so the stock history stays complete. Resolves to null if the stock changed in the meantime.
  updateWithStockAdjustment(id, updates, previousStock) {
    return prisma.$transaction(async (tx) => {
      const changed = await tx.product.updateMany({
        where: { id, stock: previousStock },
        data: updates,
      });
      if (!changed.count) return null;

      const difference = updates.stock - previousStock;
      await tx.stockMovement.create({
        data: {
          id: randomUUID(),
          productId: id,
          type: difference > 0 ? "in" : "out",
          quantity: Math.abs(difference),
          note: "Ürün kartından stok düzeltmesi",
        },
      });

      return tx.product.findUnique({
        where: { id },
      });
    });
  },

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

  countByImage(image) {
    return prisma.product.count({
      where: { image },
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
