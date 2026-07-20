import { Router } from "express";
import { stockController } from "./controller.js";

export const stockRouter = Router();

stockRouter.get("/", stockController.list);
stockRouter.get("/alerts", stockController.alerts);
