import { Router } from "express";
import { invoiceController } from "./controller.js";

export const invoiceRouter = Router();

invoiceRouter.get("/", invoiceController.list);
invoiceRouter.get("/summary", invoiceController.summary);
invoiceRouter.post("/", invoiceController.create);
invoiceRouter.put("/:id", invoiceController.update);
invoiceRouter.delete("/:id", invoiceController.delete);
