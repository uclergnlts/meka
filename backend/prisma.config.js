import "./src/config/loadEnv.js";
import { defineConfig, env } from "prisma/config";

process.env.DATABASE_URL ??= "mysql://meka:meka@127.0.0.1:3306/meka";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
