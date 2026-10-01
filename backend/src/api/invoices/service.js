import { invoiceRepository } from "./repository.js";
import { validateInvoicePayload } from "./validation.js";

// Invoice numbers are short and count up within the year: 2026-001, 2026-002, …
// Older invoices keep whatever number they were created with.
async function nextInvoiceId() {
  const year = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul", year: "numeric" }).format(new Date());
  const ids = await invoiceRepository.findIdsStartingWith(`${year}-`);
  const last = Math.max(0, ...ids.map((id) => Number(/^\d{4}-(\d+)$/.exec(id)?.[1] ?? 0)));

  return `${year}-${String(last + 1).padStart(3, "0")}`;
}

const allowedFields = ["customer", "description", "amount", "status", "date", "discount", "taxRate", "items"];

function normalizeInvoicePayload(payload) {
  const normalized = Object.fromEntries(allowedFields
    .filter((field) => payload[field] !== undefined)
    .map((field) => [field, payload[field]]));

  ["amount", "discount", "taxRate"].forEach((field) => {
    if (normalized[field] !== undefined) normalized[field] = Number(normalized[field]);
  });

  return normalized;
}

export const invoiceService = {
  async listInvoices() {
    return invoiceRepository.findAll();
  },

  async getSummary() {
    const invoices = await invoiceRepository.findAll();
    const paidTotal = invoices.filter((invoice) => invoice.status === "Ödendi").reduce((total, invoice) => total + Number(invoice.amount), 0);
    const pendingTotal = invoices.filter((invoice) => invoice.status !== "Ödendi").reduce((total, invoice) => total + Number(invoice.amount), 0);

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
    const invoice = normalizeInvoicePayload(payload);

    // Two invoices saved at the same moment would pick the same number; the loser retries with the next one.
    for (let attempt = 1; ; attempt += 1) {
      try {
        return await invoiceRepository.create({ id: await nextInvoiceId(), ...invoice });
      } catch (error) {
        if (error.code !== "P2002" || attempt === 3) throw error;
      }
    }
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
