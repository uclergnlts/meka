import { MAX_INT, MAX_MONEY, isNumeric, isObject, requiredFieldErrors, textFieldErrors, validationError } from "../../utils/validation.js";

const requiredFields = ["name", "category", "brand", "price", "stock", "minStock"];
const textFields = ["name", "category", "brand", "tag", "image", "compatibility"];

export function validateProductPayload(payload, { partial = false } = {}) {
  if (!isObject(payload)) throw validationError("Ürün bilgileri geçersiz.", ["Geçerli bir JSON nesnesi gönderilmelidir."]);

  const errors = [...requiredFieldErrors(payload, requiredFields, partial), ...textFieldErrors(payload, textFields)];

  ["price", "stock", "minStock"].forEach((field) => {
    if (payload[field] === undefined) return;
    if (!isNumeric(payload[field]) || Number(payload[field]) < 0) {
      errors.push(`${field} alanı sıfır veya daha büyük sayı olmalı.`);
    } else if (field === "price" && Number(payload[field]) > MAX_MONEY) {
      errors.push("price alanı çok büyük.");
    } else if (field !== "price" && (!Number.isInteger(Number(payload[field])) || Number(payload[field]) > MAX_INT)) {
      errors.push(`${field} alanı ${MAX_INT} değerini aşmayan bir tam sayı olmalı.`);
    }
  });

  if (errors.length > 0) throw validationError("Ürün bilgileri geçersiz.", errors);
}
