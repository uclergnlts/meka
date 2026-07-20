import { Router } from "express";
import { customerController } from "./controller.js";

export const customerRouter = Router();

customerRouter.get("/", customerController.list);
customerRouter.post("/", customerController.create);
customerRouter.put("/:id", customerController.update);
customerRouter.delete("/:id", customerController.delete);
