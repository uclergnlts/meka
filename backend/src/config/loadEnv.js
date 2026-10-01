import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
// Explicit process variables always win. Local overrides are never used in production.
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: fileURLToPath(new URL("../../.env.local", import.meta.url)) });
}
dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });
if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error("Üretimde DATABASE_URL tanımlanmalıdır.");
}
