import { Router } from "express";
import { productController } from "./controller.js";

export const productRouter = Router();

productRouter.get("/", productController.list);
productRouter.get("/:id", productController.detail);
productRouter.post("/", productController.create);
productRouter.put("/:id", productController.update);
productRouter.delete("/:id", productController.delete);
