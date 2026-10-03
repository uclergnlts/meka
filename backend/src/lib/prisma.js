import "../config/loadEnv.js";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL ?? "mysql://meka:meka@127.0.0.1:3306/meka";
if (!databaseUrl.startsWith("mysql://")) {
  throw new Error("DATABASE_URL mysql:// ile başlayan bir MySQL bağlantısı olmalıdır.");
}

// After a MySQL 8 restart the first non-TLS login needs the server's RSA key. Fetching it is
// only safe where nobody can sit in between, so it is enabled for loopback hosts alone; a
// remote database has to opt in through its own DATABASE_URL (or use TLS).
const connectionUrl = new URL(databaseUrl);
if (["127.0.0.1", "localhost", "[::1]"].includes(connectionUrl.hostname) && !connectionUrl.searchParams.has("allowPublicKeyRetrieval")) {
  connectionUrl.searchParams.set("allowPublicKeyRetrieval", "true");
}

const adapter = new PrismaMariaDb(connectionUrl.toString());
export const prisma = new PrismaClient({ adapter });
