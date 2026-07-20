import { customerService } from "./service.js";

export const customerController = {
  async list(req, res, next) {
    try {
      res.json({ data: await customerService.listCustomers() });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      res.status(201).json({ data: await customerService.createCustomer(req.body) });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      res.json({ data: await customerService.updateCustomer(req.params.id, req.body) });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      res.json({ data: await customerService.deleteCustomer(req.params.id) });
    } catch (error) {
      next(error);
    }
  },
};
