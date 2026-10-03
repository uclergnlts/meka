// Shared field checks for the API validators. Values arrive as JSON, so a number may
// legitimately come as a numeric string from a form; null, empty text and objects may not.
export const MAX_MONEY = 9999999999.99;
export const MAX_INT = 2147483647;

export function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function isText(value) {
  return typeof value === "string";
}

export function isNumeric(value) {
  if (typeof value === "number") return Number.isFinite(value);
  return typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value));
}

export function validationError(message, details) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = "VALIDATION_ERROR";
  error.details = details;
  return error;
}

// A required field may be left out of a partial update, but it may never be sent empty.
export function requiredFieldErrors(payload, requiredFields, partial) {
  return requiredFields
    .filter((field) => (!partial || payload[field] !== undefined) && (payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === ""))
    .map((field) => `${field} alanı zorunlu.`);
}

export function textFieldErrors(payload, textFields, { nullable = [] } = {}) {
  return textFields
    .filter((field) => payload[field] !== undefined && !isText(payload[field]) && !(nullable.includes(field) && payload[field] === null))
    .map((field) => `${field} alanı metin olmalı.`);
}
