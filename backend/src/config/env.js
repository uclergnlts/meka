import "./loadEnv.js";

const parsedPort = Number(process.env.PORT ?? 4000);
if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
  throw new Error("PORT 1 ile 65535 arasında geçerli bir tam sayı olmalıdır.");
}

export const env = {
  port: parsedPort,
  frontendOrigins: (process.env.FRONTEND_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
