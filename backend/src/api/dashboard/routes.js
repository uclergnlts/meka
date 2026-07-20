import { Router } from "express";
import { dashboardController } from "./controller.js";

export const dashboardRouter = Router();

dashboardRouter.get("/summary", dashboardController.summary);
