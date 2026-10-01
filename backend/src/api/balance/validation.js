const requiredFields = ["label", "amount", "type"];
export const balanceTypes = ["Gelir", "Gider"];

export function validateBalancePayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    const error = new Error("Gelir/gider bilgileri geçersiz.");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = ["Geçerli bir JSON nesnesi gönderilmelidir."];
    throw error;
  }

  if (!partial) {
    requiredFields.forEach((field) => {
      if (payload[field] === undefined || String(payload[field]).trim() === "") {
        errors.push(`${field} alanı zorunlu.`);
      }
    });
  }

  if (payload.label !== undefined && (typeof payload.label !== "string" || payload.label.trim() === "" || payload.label.length > 200)) {
    errors.push("label alanı en fazla 200 karakterlik bir metin olmalı.");
  }

  if (payload.amount !== undefined && (!/^\d+(\.\d{1,2})?$/.test(String(payload.amount)) || Number(payload.amount) > 9999999999.99)) {
    errors.push("amount alanı sıfır veya daha büyük, en fazla iki ondalık basamaklı sayı olmalı.");
  }

  if (payload.type !== undefined && !balanceTypes.includes(payload.type)) {
    errors.push("type alanı Gelir veya Gider olmalı.");
  }

  if (errors.length > 0) {
    const error = new Error("Gelir/gider bilgileri geçersiz.");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = errors;
    throw error;
  }
}
