import { randomUUID } from "node:crypto";
import { customerRepository } from "./repository.js";
import { validateCustomerPayload } from "./validation.js";

function createCustomerId() {
  return `cus-${randomUUID()}`;
}

const allowedFields = ["name", "phone", "motorcycle", "lastAction", "date", "status", "nextMaintenance", "notes"];

function normalizeCustomerPayload(payload) {
  return Object.fromEntries(allowedFields
    .filter((field) => payload[field] !== undefined)
    .map((field) => [field, payload[field]]));
}

export const customerService = {
  async listCustomers() {
    return customerRepository.findAll();
  },

  async getCustomer(id) {
    const customer = await customerRepository.findById(id);

    if (!customer) {
      const error = new Error("Müşteri bulunamadı.");
      error.statusCode = 404;
      error.code = "CUSTOMER_NOT_FOUND";
      throw error;
    }

    return customer;
  },

  async createCustomer(payload) {
    validateCustomerPayload(payload);

    const customer = normalizeCustomerPayload(payload);

    return customerRepository.create({
      id: createCustomerId(),
      ...customer,
      date: customer.date || "Bugün",
    });
  },

  async updateCustomer(id, payload) {
    validateCustomerPayload(payload, { partial: true });
    await this.getCustomer(id);

    return customerRepository.update(id, normalizeCustomerPayload(payload));
  },

  async deleteCustomer(id) {
    await this.getCustomer(id);
    await customerRepository.delete(id);

    return { id };
  },
};
