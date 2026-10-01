import { Router } from "express";
import { balanceController } from "./controller.js";

export const balanceRouter = Router();

balanceRouter.get("/", balanceController.list);
balanceRouter.post("/", balanceController.create);
balanceRouter.put("/:id", balanceController.update);
balanceRouter.delete("/:id", balanceController.delete);
