import { Router } from "express";
import { settingsController } from "./controller.js";

export const settingsRouter = Router();

settingsRouter.put("/business", settingsController.saveBusiness);
settingsRouter.delete("/business", settingsController.resetBusiness);
settingsRouter.put("/brand", settingsController.saveBrand);
