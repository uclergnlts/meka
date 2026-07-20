import { stockService } from "./service.js";

export const stockController = {
  async list(req, res, next) {
    try {
      res.json({ data: await stockService.listStockCards() });
    } catch (error) {
      next(error);
    }
  },

  async alerts(req, res, next) {
    try {
      res.json({ data: await stockService.listAlerts() });
    } catch (error) {
      next(error);
    }
  },
};
