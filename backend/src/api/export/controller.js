import { exportService } from "./service.js";

export const exportController = {
  async download(req, res, next) {
    try {
      res.json({ data: await exportService.exportRecords() });
    } catch (error) {
      next(error);
    }
  },
};
