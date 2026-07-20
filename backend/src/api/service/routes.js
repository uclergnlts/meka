import { Router } from "express";
import { serviceController } from "./controller.js";

export const serviceRouter = Router();

serviceRouter.get("/jobs", serviceController.jobs);
serviceRouter.get("/summary", serviceController.summary);
