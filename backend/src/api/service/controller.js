import { serviceService } from "./service.js";

export const serviceController = {
  async jobs(req, res, next) {
    try {
      res.json({ data: await serviceService.listJobs() });
    } catch (error) {
      next(error);
    }
  },

  async summary(req, res, next) {
    try {
      res.json({ data: await serviceService.getSummary() });
    } catch (error) {
      next(error);
    }
  },
};
