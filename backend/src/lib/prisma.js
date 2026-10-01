import "../config/loadEnv.js";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL ?? "mysql://meka:meka@127.0.0.1:3306/meka";
if (!databaseUrl.startsWith("mysql://")) {
  throw new Error("DATABASE_URL MySQL bağlantısı olmalıdır (mysql://). backend/README.md dosyasını kontrol edin.");
}

const adapter = new PrismaMariaDb(databaseUrl);
export const prisma = new PrismaClient({ adapter });
