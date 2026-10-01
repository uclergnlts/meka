import { balanceService } from "./service.js";

export const balanceController = {
  async list(req, res, next) {
    try {
      res.json({ data: await balanceService.listLines() });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      res.status(201).json({ data: await balanceService.createLine(req.body) });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      res.json({ data: await balanceService.updateLine(req.params.id, req.body) });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      res.json({ data: await balanceService.deleteLine(req.params.id) });
    } catch (error) {
      next(error);
    }
  },
};
