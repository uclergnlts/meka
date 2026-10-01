import { removeProductImage, storeProductImage } from "../../lib/uploads.js";
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

// Converts an uploaded image before saving and discards the new file if the save fails.
async function withStoredImage(payload, save) {
  if (payload.image === undefined) return save(payload);

  const image = await storeProductImage(payload.image);

  try {
    return await save({ ...payload, image });
  } catch (error) {
    if (image !== payload.image) await removeProductImage(image).catch(console.error);
    throw error;
  }
}

// The record is already saved at this point, so a failed cleanup must not fail the request.
async function releaseImage(image) {
  try {
    if (image?.startsWith("/uploads/") && await productRepository.countByImage(image) === 0) await removeProductImage(image);
  } catch (error) {
    console.error(error);
  }
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

    return withStoredImage(payload, (data) => productRepository.create({
      id: createProductId(),
      ...normalizeProductPayload(data, { withDefaults: true }),
    }));
  },

  async updateProduct(id, payload) {
    validateProductPayload(payload, { partial: true });
    const existing = await this.getProduct(id);

    const updated = await withStoredImage(payload, (data) => productRepository.update(id, normalizeProductPayload(data)));
    if (updated.image !== existing.image) await releaseImage(existing.image);

    return updated;
  },

  async deleteProduct(id) {
    const product = await this.getProduct(id);
    await productRepository.delete(id);
    await releaseImage(product.image);

    return { id };
  },
};
