const requiredFields = ["customer", "description", "amount", "status", "date"];

export function validateInvoicePayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    const error = new Error("Fatura bilgileri geçersiz.");
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

  if (payload.amount !== undefined && (!Number.isFinite(Number(payload.amount)) || Number(payload.amount) < 0)) {
    errors.push("amount alanı sıfır veya daha büyük sayı olmalı.");
  }

  if (payload.discount !== undefined && (!Number.isFinite(Number(payload.discount)) || Number(payload.discount) < 0)) {
    errors.push("discount alanı sıfır veya daha büyük sayı olmalı.");
  }

  if (payload.taxRate !== undefined && (!Number.isFinite(Number(payload.taxRate)) || Number(payload.taxRate) < 0 || Number(payload.taxRate) > 100)) {
    errors.push("taxRate alanı 0 ile 100 arasında olmalı.");
  }

  if (payload.items !== undefined && !Array.isArray(payload.items)) {
    errors.push("items alanı bir liste olmalı.");
  }

  for (const key of ["amount", "discount", "taxRate"]) {
    if (payload[key] !== undefined && (!/^\d+(\.\d{1,2})?$/.test(String(payload[key])) || Number(payload[key]) > 9999999999.99)) errors.push(`${key} en fazla iki ondalık basamak içermeli.`);
  }
  if (errors.length > 0) {
    const error = new Error("Fatura bilgileri geçersiz.");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = errors;
    throw error;
  }
}
