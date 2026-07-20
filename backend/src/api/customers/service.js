import { customerRepository } from "./repository.js";
import { validateCustomerPayload } from "./validation.js";

function createCustomerId() {
  return `cus-${Date.now().toString(36)}`;
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

    return customerRepository.create({
      id: createCustomerId(),
      date: payload.date || "Bugün",
      ...payload,
    });
  },

  async updateCustomer(id, payload) {
    validateCustomerPayload(payload, { partial: true });
    await this.getCustomer(id);

    return customerRepository.update(id, payload);
  },

  async deleteCustomer(id) {
    await this.getCustomer(id);
    await customerRepository.delete(id);

    return { id };
  },
};
