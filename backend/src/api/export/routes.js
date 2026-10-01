import { Router } from "express";
import { exportController } from "./controller.js";

export const exportRouter = Router();

exportRouter.get("/", exportController.download);
