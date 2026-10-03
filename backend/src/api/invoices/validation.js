import { MAX_MONEY, isNumeric, isObject, requiredFieldErrors, textFieldErrors, validationError } from "../../utils/validation.js";

const requiredFields = ["customer", "description", "amount", "status", "date"];
const textFields = ["customer", "description", "status", "date"];

export function validateInvoicePayload(payload, { partial = false } = {}) {
  if (!isObject(payload)) throw validationError("Fatura bilgileri geçersiz.", ["Geçerli bir JSON nesnesi gönderilmelidir."]);

  const errors = [...requiredFieldErrors(payload, requiredFields, partial), ...textFieldErrors(payload, textFields)];

  ["amount", "discount", "taxRate"].forEach((field) => {
    if (payload[field] === undefined) return;
    if (!isNumeric(payload[field]) || Number(payload[field]) < 0) {
      errors.push(`${field} alanı sıfır veya daha büyük sayı olmalı.`);
    } else if (field === "taxRate" && Number(payload[field]) > 100) {
      errors.push("taxRate alanı 0 ile 100 arasında olmalı.");
    } else if (!/^\d+(\.\d{1,2})?$/.test(String(payload[field])) || Number(payload[field]) > MAX_MONEY) {
      errors.push(`${field} en fazla iki ondalık basamak içermeli.`);
    }
  });

  if (payload.items !== undefined && !Array.isArray(payload.items)) {
    errors.push("items alanı bir liste olmalı.");
  }

  if (errors.length > 0) throw validationError("Fatura bilgileri geçersiz.", errors);
}
