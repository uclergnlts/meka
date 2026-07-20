import { dashboardService } from "./service.js";

export const dashboardController = {
  async summary(req, res, next) {
    try {
      res.json({ data: await dashboardService.getSummary() });
    } catch (error) {
      next(error);
    }
  },
};
