import "dotenv/config";
import { defineConfig, env } from "prisma/config";

process.env.DATABASE_URL ??= "postgresql://postgres:postgres@localhost:5432/meka?schema=public";

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
