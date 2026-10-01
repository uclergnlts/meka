const requiredFields = ["name", "category", "brand", "price", "stock", "minStock"];

export function validateProductPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    const error = new Error("Ürün bilgileri geçersiz.");
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

  ["price", "stock", "minStock"].forEach((field) => {
    if (payload[field] !== undefined && (!Number.isFinite(Number(payload[field])) || Number(payload[field]) < 0)) {
      errors.push(`${field} alanı sıfır veya daha büyük sayı olmalı.`);
    }
  });

  ["stock", "minStock"].forEach((field) => {
    if (payload[field] !== undefined && !Number.isInteger(Number(payload[field]))) {
      errors.push(`${field} alanı tam sayı olmalı.`);
    }
  });

  if (errors.length > 0) {
    const error = new Error("Ürün bilgileri geçersiz.");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = errors;
    throw error;
  }
}
