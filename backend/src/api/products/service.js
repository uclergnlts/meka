import { productRepository } from "./repository.js";
import { validateProductPayload } from "./validation.js";

function createProductId() {
  return `prd-${Date.now().toString(36)}`;
}

function normalizeProductPayload(payload) {
  return {
    ...payload,
    price: Number(payload.price),
    stock: Number(payload.stock),
    minStock: Number(payload.minStock),
    tag: payload.tag || "Stokta",
    image: payload.image || "brake",
    compatibility: payload.compatibility || "Universal",
  };
}

export const productService = {
  async listProducts() {
    return productRepository.findAll();
  },

  async getProduct(id) {
    const product = await productRepository.findById(id);

    if (!product) {
      const error = new Error("Ürün bulunamadı.");
      error.statusCode = 404;
      error.code = "PRODUCT_NOT_FOUND";
      throw error;
    }

    return product;
  },

  async createProduct(payload) {
    validateProductPayload(payload);

    return productRepository.create({
      id: createProductId(),
      ...normalizeProductPayload(payload),
    });
  },

  async updateProduct(id, payload) {
    validateProductPayload(payload, { partial: true });
    await this.getProduct(id);

    return productRepository.update(id, normalizeProductPayload(payload));
  },

  async deleteProduct(id) {
    await this.getProduct(id);
    await productRepository.delete(id);

    return { id };
  },
};
