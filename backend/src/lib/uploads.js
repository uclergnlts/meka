import { mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
export const uploadDirectory = process.env.UPLOAD_DIR || fileURLToPath(new URL("../../uploads/", import.meta.url));
export async function storeProductImage(value) {
  if (typeof value !== "string") throw Object.assign(new Error("Geçerli bir görsel seçin."), { statusCode: 400 });
  if (!value.startsWith("data:")) {
    if (/^(brake|oil|chain|helmet|tire|battery|accessory|glove|spark|filter|signal)$/.test(value) || /^\/uploads\/[a-f0-9-]+\.webp$/.test(value)) return value;
    throw Object.assign(new Error("Geçerli bir görsel seçin."), { statusCode: 400 });
  }
  const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(value);
  if (!match) throw Object.assign(new Error("PNG, JPG veya WebP görsel seçin."), { statusCode: 400 });
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > 1024 * 1024) throw Object.assign(new Error("Ürün görseli en fazla 1 MB olabilir."), { statusCode: 413 });
  let output;
  try { output = await sharp(bytes, { limitInputPixels: 25000000 }).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer(); }
  catch { throw Object.assign(new Error("Görsel dosyası okunamadı."), { statusCode: 400 }); }
  await mkdir(uploadDirectory, { recursive: true });
  const filename = `${randomUUID()}.webp`;
  const { writeFile } = await import("node:fs/promises");
  await writeFile(path.join(uploadDirectory, filename), output, { flag: "wx" });
  return `/uploads/${filename}`;
}
