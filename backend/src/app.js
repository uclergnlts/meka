import { authRouter, requireAdmin, requireRequestHeader } from "./lib/auth.js";
import { prisma } from "./lib/prisma.js";
import { uploadDirectory } from "./lib/uploads.js";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { env } from "./config/env.js";
import { settingsController } from "./api/settings/index.js";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  if (env.trustProxy) app.set("trust proxy", env.trustProxy);
  // Browsers are told to upgrade http to https only in production; a local run over plain http would break otherwise.
  app.use(helmet({ contentSecurityPolicy: { directives: { "upgrade-insecure-requests": env.production ? [] : null } } }));
  // Search engines should know one address per page: www answers with a redirect to the bare
  // domain, and the panel host asks not to be listed at all.
  app.use((req, res, next) => {
    if (req.hostname?.startsWith("admin.")) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      if (req.path === "/robots.txt") return res.type("text/plain").send("User-agent: *\nDisallow: /\n");
    }
    const page = req.method === "GET" || req.method === "HEAD";
    if (page && req.hostname?.startsWith("www.") && !req.path.startsWith("/.well-known/")) {
      return res.redirect(301, `${env.production ? "https" : req.protocol}://${req.hostname.slice(4)}${req.originalUrl}`);
    }
    next();
  });
  // Requests from the address the site itself is served on are always allowed; FRONTEND_ORIGIN
  // lists any other address the frontend runs on.
  app.use(cors((req, callback) => {
    const origin = req.get("Origin");
    const ownAddress = origin && URL.canParse(origin) && new URL(origin).host === req.get("Host");
    if (!origin || ownAddress || env.frontendOrigins.includes(origin)) return callback(null, { credentials: true, origin: true });
    const error = new Error("Bu kaynaktan gelen isteğe izin verilmiyor.");
    error.statusCode = 403;
    error.code = "CORS_ORIGIN_DENIED";
    return callback(error);
  }));
  app.use(express.json({ limit: "2mb" }));
  app.use(morgan("dev"));

  app.get("/health", async (req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: "ok", service: "meka-backend" });
    } catch (error) {
      console.error(error);
      res.status(503).json({ status: "error", service: "meka-backend", message: "Veritabanına bağlanılamadı." });
    }
  });

  // Certificate challenge files written into the web server's document root (see env.webRoot).
  if (env.webRoot) app.use("/.well-known", express.static(path.join(env.webRoot, ".well-known"), { dotfiles: "allow" }));
  // Product photos and the logo are public; helmet's same-origin default would block them when the storefront is on another origin.
  app.use("/uploads", express.static(uploadDirectory, { dotfiles: "deny", fallthrough: false, maxAge: "1y", immutable: true, setHeaders: (res) => res.setHeader("Cross-Origin-Resource-Policy", "cross-origin") }));
  // API answers are live data, some of it private; nothing in between may store them.
  app.use("/api", (req, res, next) => { res.set("Cache-Control", "no-store"); next(); });
  app.get("/api/public/products", async (req, res, next) => {
    try { res.json({ data: await prisma.product.findMany({ select: { id: true, name: true, category: true, brand: true, tag: true, image: true, compatibility: true }, orderBy: { createdAt: "desc" } }) }); }
    catch (error) { next(error); }
  });
  app.get("/api/public/settings", settingsController.publicSettings);
  app.use("/api", requireRequestHeader);
  app.use("/api/auth", authRouter);
  app.use("/api", requireAdmin, apiRouter);
  if (env.frontendDir) {
    // Built assets carry a content hash in their name and can be cached for good; the page itself must stay fresh.
    app.use(express.static(env.frontendDir, {
      index: false,
      setHeaders(res, filePath) {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      },
    }));
    // Client-side routes such as /urunler have no file of their own; they all load the same page.
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api/") || req.path.startsWith("/uploads/") || req.path.startsWith("/.well-known/") || path.extname(req.path)) return next();
      res.set("Cache-Control", "no-cache").sendFile(path.join(env.frontendDir, "index.html"));
    });
  }
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
