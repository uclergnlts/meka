import { removeUploadedImage, storeBrandImage } from "../../lib/uploads.js";
import { settingsRepository } from "./repository.js";
import { brandFields, businessFields, validateBrandPayload, validateBusinessPayload } from "./validation.js";

const BUSINESS_KEY = "business";
const BRAND_KEY = "brand";
const brandImageSizes = { logo: 800, favicon: 256 };

export const settingsService = {
  async getPublicSettings() {
    const [business, brand] = await Promise.all([
      settingsRepository.findValue(BUSINESS_KEY),
      settingsRepository.findValue(BRAND_KEY),
    ]);

    return { business, brand: brand ?? {} };
  },

  async saveBusiness(payload) {
    validateBusinessPayload(payload);

    return settingsRepository.save(BUSINESS_KEY, Object.fromEntries(businessFields
      .filter((field) => payload[field] !== undefined)
      .map((field) => [field, payload[field].trim()])));
  },

  async resetBusiness() {
    await settingsRepository.delete(BUSINESS_KEY);

    return null;
  },

  // Fields left out of the payload keep their image; null removes it.
  async saveBrand(payload) {
    validateBrandPayload(payload);
    const current = await settingsRepository.findValue(BRAND_KEY) ?? {};
    const next = { ...current };
    const storedFiles = [];

    try {
      for (const field of brandFields) {
        if (payload[field] === undefined) continue;

        if (payload[field] === null) {
          delete next[field];
        } else {
          next[field] = await storeBrandImage(payload[field], brandImageSizes[field]);
          if (next[field] !== payload[field]) storedFiles.push(next[field]);
        }
      }

      await settingsRepository.save(BRAND_KEY, next);
    } catch (error) {
      await Promise.all(storedFiles.map((image) => removeUploadedImage(image).catch(console.error)));
      throw error;
    }

    const replacedFiles = Object.values(current).filter((image) => !Object.values(next).includes(image));
    await Promise.all(replacedFiles.map((image) => removeUploadedImage(image).catch(console.error)));

    return next;
  },
};
