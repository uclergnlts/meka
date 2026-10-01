import { authRouter, requireAdmin, requireRequestHeader } from "./lib/auth.js";
import { prisma } from "./lib/prisma.js";
import { uploadDirectory } from "./lib/uploads.js";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || env.frontendOrigins.includes(origin)) return callback(null, true);
      const error = new Error("Bu kaynaktan gelen isteğe izin verilmiyor.");
      error.statusCode = 403;
      error.code = "CORS_ORIGIN_DENIED";
      return callback(error);
    },
  }));
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));

  app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "meka-backend" });
  });

  // Product photos are public; helmet's same-origin default would block them when the storefront is on another origin.
  app.use("/uploads", express.static(uploadDirectory, { dotfiles: "deny", fallthrough: false, maxAge: "1y", immutable: true, setHeaders: (res) => res.setHeader("Cross-Origin-Resource-Policy", "cross-origin") }));
  app.get("/api/public/products", async (req, res, next) => {
    try { res.json({ data: await prisma.product.findMany({ select: { id: true, name: true, category: true, brand: true, tag: true, image: true, compatibility: true }, orderBy: { createdAt: "desc" } }) }); }
    catch (error) { next(error); }
  });
  app.use("/api", requireRequestHeader);
  app.use("/api/auth", authRouter);
  app.use("/api", requireAdmin, apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
