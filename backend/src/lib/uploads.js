import { mkdir, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
export const uploadDirectory = process.env.UPLOAD_DIR || fileURLToPath(new URL("../../uploads/", import.meta.url));
const fail = (message, statusCode = 400) => Object.assign(new Error(message), { statusCode });
// Every upload is decoded and re-encoded by sharp, so only real images reach the disk.
async function storeDataUrl(value, extension, encode) {
  const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(value);
  if (!match) throw fail("PNG, JPG veya WebP görsel seçin.");
  const bytes = Buffer.from(match[2], "base64");
  if (bytes.length > 1024 * 1024) throw fail("Görsel en fazla 1 MB olabilir.", 413);
  let output;
  try { output = await encode(sharp(bytes, { limitInputPixels: 25000000 }).rotate()).toBuffer(); }
  catch { throw fail("Görsel dosyası okunamadı."); }
  await mkdir(uploadDirectory, { recursive: true });
  const filename = `${randomUUID()}.${extension}`;
  await writeFile(path.join(uploadDirectory, filename), output, { flag: "wx" });
  return `/uploads/${filename}`;
}
export async function storeProductImage(value) {
  if (typeof value !== "string") throw fail("Geçerli bir görsel seçin.");
  if (!value.startsWith("data:")) {
    if (/^(brake|oil|chain|helmet|tire|battery|accessory|glove|spark|filter|signal)$/.test(value) || /^\/uploads\/[a-f0-9-]+\.webp$/.test(value)) return value;
    throw fail("Geçerli bir görsel seçin.");
  }
  return storeDataUrl(value, "webp", (image) => image.resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }));
}
// Logo and favicon stay PNG: transparency survives and every browser accepts a PNG favicon.
export async function storeBrandImage(value, maxSize) {
  if (!value.startsWith("data:")) {
    if (/^\/uploads\/[a-f0-9-]+\.png$/.test(value)) return value;
    throw fail("Geçerli bir görsel seçin.");
  }
  return storeDataUrl(value, "png", (image) => image.resize({ width: maxSize, height: maxSize, fit: "inside", withoutEnlargement: true }).png());
}
export async function removeUploadedImage(value) {
  const match = /^\/uploads\/([a-f0-9-]+\.(?:webp|png))$/.exec(value ?? "");
  if (match) await rm(path.join(uploadDirectory, match[1]), { force: true });
}
