import { productRepository } from "../products/repository.js";
import { getStockStatus } from "../../utils/stock.js";

export const stockService = {
  async listStockCards() {
    const products = await productRepository.findAll();

    return products.map((product) => ({
      productId: product.id,
      name: product.name,
      category: product.category,
      stock: product.stock,
      minStock: product.minStock,
      status: getStockStatus(product.stock, product.minStock),
    }));
  },

  async listAlerts() {
    const stockCards = await this.listStockCards();
    return stockCards.filter((card) => card.stock <= card.minStock);
  },
};
