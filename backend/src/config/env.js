import "./loadEnv.js";

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

export const env = {
  port: parsedPort,
  trustProxy,
  // The panel is served from the admin.<domain> host, so that origin has to be listed too.
  frontendOrigins: (process.env.FRONTEND_ORIGIN ?? "http://localhost:3000,http://admin.localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
