import { prisma } from "../../lib/prisma.js";

export const settingsRepository = {
  async findValue(key) {
    const setting = await prisma.setting.findUnique({
      where: { key },
    });

    return setting?.value ?? null;
  },

  async save(key, value) {
    const setting = await prisma.setting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });

    return setting.value;
  },

  delete(key) {
    return prisma.setting.deleteMany({
      where: { key },
    });
  },
};
