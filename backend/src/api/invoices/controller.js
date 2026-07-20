import { invoiceService } from "./service.js";

export const invoiceController = {
  async list(req, res, next) {
    try {
      res.json({ data: await invoiceService.listInvoices() });
    } catch (error) {
      next(error);
    }
  },

  async summary(req, res, next) {
    try {
      res.json({ data: await invoiceService.getSummary() });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      res.status(201).json({ data: await invoiceService.createInvoice(req.body) });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      res.json({ data: await invoiceService.updateInvoice(req.params.id, req.body) });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      res.json({ data: await invoiceService.deleteInvoice(req.params.id) });
    } catch (error) {
      next(error);
    }
  },
};
