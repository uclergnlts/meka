const requiredFields = ["customer", "description", "amount", "status", "date"];

export function validateInvoicePayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!partial) {
    requiredFields.forEach((field) => {
      if (payload[field] === undefined || payload[field] === "") {
        errors.push(`${field} alanı zorunlu.`);
      }
    });
  }

  if (payload.amount !== undefined && (Number.isNaN(Number(payload.amount)) || Number(payload.amount) < 0)) {
    errors.push("amount alanı sıfır veya daha büyük sayı olmalı.");
  }

  if (errors.length > 0) {
    const error = new Error("Fatura bilgileri geçersiz.");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = errors;
    throw error;
  }
}
