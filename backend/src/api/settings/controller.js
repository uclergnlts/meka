import { settingsService } from "./service.js";

export const settingsController = {
  async publicSettings(req, res, next) {
    try {
      res.json({ data: await settingsService.getPublicSettings() });
    } catch (error) {
      next(error);
    }
  },

  async saveBusiness(req, res, next) {
    try {
      res.json({ data: await settingsService.saveBusiness(req.body) });
    } catch (error) {
      next(error);
    }
  },

  async resetBusiness(req, res, next) {
    try {
      res.json({ data: await settingsService.resetBusiness() });
    } catch (error) {
      next(error);
    }
  },

  async saveBrand(req, res, next) {
    try {
      res.json({ data: await settingsService.saveBrand(req.body) });
    } catch (error) {
      next(error);
    }
  },
};
