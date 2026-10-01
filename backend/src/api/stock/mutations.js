import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma.js";
const fail = (message, statusCode = 400) => Object.assign(new Error(message), { statusCode });
export async function saveMovement(payload) {
  const { productId, type, note = "" } = payload;
  const quantity = Number(payload.quantity);
  if (typeof productId !== "string" || !["in", "out"].includes(type) || !Number.isSafeInteger(quantity) || quantity <= 0 || quantity > 2147483647 || typeof note !== "string") throw fail("Geçerli ürün, hareket ve tam sayı adet girin.");
  const updates = {};
  for (const key of ["supplier", "shelf", "barcode"]) if (payload[key] !== undefined && payload[key] !== "") {
    if (typeof payload[key] !== "string") throw fail("Stok bilgileri geçersiz.");
    updates[key] = payload[key];
  }
  for (const [key, field] of [["purchasePrice", "purchasePrice"], ["salePrice", "price"]]) if (payload[key] !== undefined && payload[key] !== "") {
    const n = Number(payload[key]);
    if (!Number.isFinite(n) || n < 0 || n > 9999999999.99) throw fail("Fiyat geçersiz.");
    updates[field] = n.toFixed(2);
  }
  return prisma.$transaction(async tx => {
    const updated = await tx.product.updateMany({ where: { id: productId, stock: type === "out" ? { gte: quantity } : { lte: 2147483647 - quantity } }, data: { ...updates, stock: { increment: type === "out" ? -quantity : quantity } } });
    if (!updated.count) throw fail("Ürün bulunamadı veya stok hareketi için yeterli adet yok.", 409);
    return tx.stockMovement.create({ data: { id: randomUUID(), productId, type, quantity, note } });
  });
}
export async function reverseMovement(id) {
  return prisma.$transaction(async tx => {
    const movement = await tx.stockMovement.findUnique({ where: { id } });
    if (!movement || movement.reversedAt) throw fail("Hareket bulunamadı veya zaten geri alındı.", 409);
    const claimed = await tx.stockMovement.updateMany({ where: { id, reversedAt: null }, data: { reversedAt: new Date() } });
    if (!claimed.count) throw fail("Hareket zaten geri alındı.", 409);
    const updated = await tx.product.updateMany({ where: { id: movement.productId, stock: movement.type === "in" ? { gte: movement.quantity } : { lte: 2147483647 - movement.quantity } }, data: { stock: { increment: movement.type === "in" ? -movement.quantity : movement.quantity } } });
    if (!updated.count) throw fail("Mevcut stok bu hareketi geri almak için uygun değil.", 409);
    return { id };
  });
}
export async function history() {
  const rows = await prisma.stockMovement.findMany({ where: { reversedAt: null }, include: { product: { select: { name: true } } }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 100 });
  return rows.map(row => ({ ...row, product: row.product.name, type: row.type === "in" ? "Giriş" : "Çıkış", date: row.createdAt.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" }) }));
}
