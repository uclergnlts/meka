import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { Router } from "express";
import { prisma } from "./prisma.js";
const scrypt = promisify(scryptCallback);
const hashToken = (token) => createHash("sha256").update(token).digest("hex");
const cookieName = "meka_session";
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/" };
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${(await scrypt(password, salt, 64)).toString("hex")}`;
}
async function verifyPassword(password, hash) {
  const [salt, stored] = hash.split(":");
  const actual = await scrypt(password, salt, 64);
  const expected = Buffer.from(stored, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
function sessionToken(req) {
  return req.headers.cookie?.split(";").map(v => v.trim()).find(v => v.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1) ?? "";
}
export async function requireAdmin(req, res, next) {
  try {
    const token = sessionToken(req);
    const session = /^[a-f0-9]{64}$/.test(token) ? await prisma.adminSession.findUnique({ where: { tokenHash: hashToken(token) } }) : null;
    if (!session || session.expiresAt <= new Date()) return res.status(401).json({ error: "UNAUTHORIZED", message: "Yönetici girişi yapın." });
    req.admin = session.username;
    next();
  } catch (error) { next(error); }
}
export function requireRequestHeader(req, res, next) {
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method) && req.get("X-Meka-Request") !== "1") {
    return res.status(403).json({ error: "INVALID_ORIGIN", message: "İstek doğrulanamadı." });
  }
  next();
}
export const authRouter = Router();
authRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body ?? {};
    if (typeof username !== "string" || typeof password !== "string" || password.length > 1024) return res.status(400).json({ message: "Geçerli giriş bilgileri girin." });
    const admin = await prisma.admin.findUnique({ where: { username } });
    if (admin?.lockedUntil > new Date()) return res.status(429).json({ message: "Çok fazla deneme yapıldı. 15 dakika sonra tekrar deneyin." });
    if (!admin || !await verifyPassword(password, admin.passwordHash)) {
      if (admin) {
        const updated = await prisma.admin.update({ where: { username }, data: { failures: { increment: 1 } } });
        if (updated.failures >= 5) await prisma.admin.update({ where: { username }, data: { lockedUntil: new Date(Date.now() + 15 * 60 * 1000), failures: 0 } });
      }
      return res.status(401).json({ message: "Kullanıcı adı veya parola hatalı." });
    }
    await prisma.admin.update({ where: { username }, data: { failures: 0, lockedUntil: null } });
    const token = randomBytes(32).toString("hex");
    await prisma.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    await prisma.adminSession.create({ data: { tokenHash: hashToken(token), username, expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) } });
    res.cookie(cookieName, token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 }).json({ data: { username } });
  } catch (error) { next(error); }
});
authRouter.get("/session", requireAdmin, (req, res) => res.json({ data: { username: req.admin } }));
authRouter.post("/logout", async (req, res, next) => {
  try {
    await prisma.adminSession.deleteMany({ where: { tokenHash: hashToken(sessionToken(req)) } });
    res.clearCookie(cookieName, cookieOptions).json({ data: null });
  } catch (error) { next(error); }
});
