import "./loadEnv.js";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const parsedPort = Number(process.env.PORT ?? 4000);
if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error("PORT 1 ile 65535 arasında geçerli bir tam sayı olmalıdır.");
}

// Number of reverse proxies in front of the app. Without it every visitor behind the proxy
// shares one address and the login throttle would count them together.
const trustProxy = Number(process.env.TRUST_PROXY ?? 0);
if (!Number.isInteger(trustProxy) || trustProxy < 0) {
  throw new Error("TRUST_PROXY sıfır veya daha büyük bir tam sayı olmalıdır.");
}

// Built frontend to serve next to the API, so one process runs the whole site. The hosting
// bundle ships it as ./public; in development Vite serves the site and nothing is found here.
const bundledFrontend = fileURLToPath(new URL("../../public/", import.meta.url));
const frontendDir = process.env.FRONTEND_DIR ? path.resolve(process.env.FRONTEND_DIR) : (existsSync(path.join(bundledFrontend, "index.html")) ? bundledFrontend : null);

export const env = {
  port: parsedPort,
  trustProxy,
  frontendDir,
  production: process.env.NODE_ENV === "production",
  // Only needed when the frontend is served from another address than the API (as in development).
  frontendOrigins: (process.env.FRONTEND_ORIGIN ?? (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000,http://admin.localhost:3000"))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
