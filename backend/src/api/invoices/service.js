import { invoiceRepository } from "./repository.js";
import { validateInvoicePayload } from "./validation.js";

function createInvoiceId() {
  return `FTR-${Date.now().toString().slice(-5)}`;
}

function normalizeInvoicePayload(payload) {
  return {
    ...payload,
    amount: Number(payload.amount),
  };
}

export const invoiceService = {
  async listInvoices() {
    return invoiceRepository.findAll();
  },

  async getSummary() {
    const invoices = await invoiceRepository.findAll();
    const paidTotal = invoices.filter((invoice) => invoice.status === "Ödendi").reduce((total, invoice) => total + invoice.amount, 0);
    const pendingTotal = invoices.filter((invoice) => invoice.status !== "Ödendi").reduce((total, invoice) => total + invoice.amount, 0);

    return {
      paidTotal,
      pendingTotal,
      averageInvoice: invoices.length > 0 ? Math.round((paidTotal + pendingTotal) / invoices.length) : 0,
      draftCount: invoices.filter((invoice) => invoice.status === "Taslak").length,
    };
  },

  async getInvoice(id) {
    const invoice = await invoiceRepository.findById(id);

    if (!invoice) {
      const error = new Error("Fatura bulunamadı.");
      error.statusCode = 404;
      error.code = "INVOICE_NOT_FOUND";
      throw error;
    }

    return invoice;
  },

  async createInvoice(payload) {
    validateInvoicePayload(payload);

    return invoiceRepository.create({
      id: createInvoiceId(),
      ...normalizeInvoicePayload(payload),
    });
  },

  async updateInvoice(id, payload) {
    validateInvoicePayload(payload, { partial: true });
    await this.getInvoice(id);

    return invoiceRepository.update(id, normalizeInvoicePayload(payload));
  },

  async deleteInvoice(id) {
    await this.getInvoice(id);
    await invoiceRepository.delete(id);

    return { id };
  },
};
