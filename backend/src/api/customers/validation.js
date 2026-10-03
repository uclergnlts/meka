import { isObject, isText, requiredFieldErrors, textFieldErrors, validationError } from "../../utils/validation.js";

const requiredFields = ["name", "phone", "motorcycle", "lastAction", "status"];
const textFields = ["name", "phone", "motorcycle", "lastAction", "date", "status", "nextMaintenance", "notes"];

export function validateCustomerPayload(payload, { partial = false } = {}) {
  if (!isObject(payload)) throw validationError("Müşteri bilgileri geçersiz.", ["Geçerli bir JSON nesnesi gönderilmelidir."]);

  const errors = [
    ...requiredFieldErrors(payload, requiredFields, partial),
    ...textFieldErrors(payload, textFields, { nullable: ["nextMaintenance", "notes"] }),
  ];

  if (isText(payload.phone) && payload.phone.replace(/\D/g, "").length < 10) {
    errors.push("phone alanı geçerli bir telefon olmalı.");
  }

  if (errors.length > 0) throw validationError("Müşteri bilgileri geçersiz.", errors);
}
