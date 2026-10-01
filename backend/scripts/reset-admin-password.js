import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { prisma } from "../src/lib/prisma.js";
import { hashPassword } from "../src/lib/auth.js";
const username = process.argv[2] || "admin";
try {
  if (!await prisma.admin.findUnique({ where: { username } })) throw new Error("Bu yönetici bulunamadı.");
  const password = randomBytes(24).toString("base64url");
  const file = new URL("../.admin-login.txt", import.meta.url);
  await writeFile(file, `Kullanıcı adı: ${username}\nParola: ${password}\n`, { mode: 0o600 });
  // Signing every session out makes a forgotten or leaked password useless straight away.
  await prisma.$transaction([
    prisma.admin.update({ where: { username }, data: { passwordHash: await hashPassword(password), failures: 0, lockedUntil: null } }),
    prisma.adminSession.deleteMany({ where: { username } }),
  ]);
  console.log("Parola yenilendi ve açık oturumlar kapatıldı. Yeni giriş bilgileri backend/.admin-login.txt dosyasında (yalnızca bu kullanıcı okuyabilir). Güvenli yere aldıktan sonra dosyayı silin.");
} finally { await prisma.$disconnect(); }
