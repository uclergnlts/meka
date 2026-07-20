import { Router } from "express";
import { dashboardRouter } from "../api/dashboard/index.js";
import { productRouter } from "../api/products/index.js";
import { serviceRouter } from "../api/service/index.js";
import { stockRouter } from "../api/stock/index.js";
import { customerRouter } from "../api/customers/index.js";
import { invoiceRouter } from "../api/invoices/index.js";

export const apiRouter = Router();

apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/stock", stockRouter);
apiRouter.use("/service", serviceRouter);
apiRouter.use("/customers", customerRouter);
apiRouter.use("/invoices", invoiceRouter);
