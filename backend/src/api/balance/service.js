import { randomUUID } from "node:crypto";
import { balanceRepository } from "./repository.js";
import { validateBalancePayload } from "./validation.js";

function createBalanceId() {
  return `bal-${randomUUID()}`;
}

const allowedFields = ["label", "amount", "type"];

function normalizeBalancePayload(payload) {
  const normalized = Object.fromEntries(allowedFields
    .filter((field) => payload[field] !== undefined)
    .map((field) => [field, payload[field]]));

  if (normalized.label !== undefined) normalized.label = normalized.label.trim();
  if (normalized.amount !== undefined) normalized.amount = Number(normalized.amount);

  return normalized;
}

export const balanceService = {
  async listLines() {
    return balanceRepository.findAll();
  },

  async getLine(id) {
    const line = await balanceRepository.findById(id);

    if (!line) {
      const error = new Error("Gelir/gider kaydı bulunamadı.");
      error.statusCode = 404;
      error.code = "BALANCE_LINE_NOT_FOUND";
      throw error;
    }

    return line;
  },

  async createLine(payload) {
    validateBalancePayload(payload);

    return balanceRepository.create({
      id: createBalanceId(),
      ...normalizeBalancePayload(payload),
    });
  },

  async updateLine(id, payload) {
    validateBalancePayload(payload, { partial: true });
    await this.getLine(id);

    return balanceRepository.update(id, normalizeBalancePayload(payload));
  },

  async deleteLine(id) {
    await this.getLine(id);
    await balanceRepository.delete(id);

    return { id };
  },
};
