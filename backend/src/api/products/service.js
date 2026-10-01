import { storeProductImage } from "../../lib/uploads.js";
import { randomUUID } from "node:crypto";
import { productRepository } from "./repository.js";
import { validateProductPayload } from "./validation.js";

function createProductId() {
  return `prd-${randomUUID()}`;
}

const allowedFields = ["name", "category", "brand", "price", "stock", "minStock", "tag", "image", "compatibility"];

function normalizeProductPayload(payload, { withDefaults = false } = {}) {
  const normalized = Object.fromEntries(allowedFields
    .filter((field) => payload[field] !== undefined)
    .map((field) => [field, payload[field]]));

  ["price", "stock", "minStock"].forEach((field) => {
    if (normalized[field] !== undefined) normalized[field] = Number(normalized[field]);
  });

  if (withDefaults) {
    normalized.tag ||= "Stokta";
    normalized.image ||= "brake";
    normalized.compatibility ||= "Universal";
  }

  return normalized;
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

    if (payload.image !== undefined) payload = { ...payload, image: await storeProductImage(payload.image) };
    return productRepository.create({
      id: createProductId(),
      ...normalizeProductPayload(payload, { withDefaults: true }),
    });
  },

  async updateProduct(id, payload) {
    validateProductPayload(payload, { partial: true });
    await this.getProduct(id);

    if (payload.image !== undefined) payload = { ...payload, image: await storeProductImage(payload.image) };
    return productRepository.update(id, normalizeProductPayload(payload));
  },

  async deleteProduct(id) {
    await this.getProduct(id);
    await productRepository.delete(id);

    return { id };
  },
};
