const requiredFields = ["name", "phone", "motorcycle", "lastAction", "status"];

export function validateCustomerPayload(payload, { partial = false } = {}) {
  const errors = [];

  if (!partial) {
    requiredFields.forEach((field) => {
      if (payload[field] === undefined || payload[field] === "") {
        errors.push(`${field} alanı zorunlu.`);
      }
    });
  }

  if (payload.phone !== undefined && payload.phone.length < 10) {
    errors.push("phone alanı geçerli bir telefon olmalı.");
  }

  if (errors.length > 0) {
    const error = new Error("Müşteri bilgileri geçersiz.");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = errors;
    throw error;
  }
}
