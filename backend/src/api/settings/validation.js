// Link fields end up in href attributes on the public site, so each one is pinned to its scheme.
const linkPrefixes = {
  phoneHref: "tel:",
  emailHref: "mailto:",
  whatsappHref: "https://",
  instagramHref: "https://",
  mapsHref: "https://",
};

// Labels match the settings form so validation messages name the field the admin sees.
const businessLabels = {
  brand: "İşletme adı",
  owner: "Yetkili",
  legalOperator: "İşletmeci",
  licensedActivity: "Ruhsat faaliyeti",
  licenseAuthority: "Ruhsat makamı",
  licenseIssueDate: "Ruhsat tarihi",
  licenseSequenceNumber: "Ruhsat sıra numarası",
  phone: "Telefon",
  phoneHref: "Telefon bağlantısı",
  whatsappHref: "WhatsApp bağlantısı",
  email: "E-posta",
  emailHref: "E-posta bağlantısı",
  instagram: "Instagram kullanıcı adı",
  instagramHref: "Instagram bağlantısı",
  address: "Adres",
  city: "Şehir / İlçe",
  mapsHref: "Google Maps bağlantısı",
};

export const businessFields = Object.keys(businessLabels);

export const brandFields = ["logo", "favicon"];

function assertObject(payload, message) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    const error = new Error(message);
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = ["Geçerli bir JSON nesnesi gönderilmelidir."];
    throw error;
  }
}

export function validateBusinessPayload(payload) {
  assertObject(payload, "İşletme bilgileri geçersiz.");
  const errors = [];

  businessFields.forEach((field) => {
    const value = payload[field];
    if (value === undefined) return;

    if (typeof value !== "string" || value.trim() === "" || value.length > 500) {
      errors.push(`${businessLabels[field]} boş olmamalı ve en fazla 500 karakter olmalı.`);
    } else if (linkPrefixes[field] && !value.trim().startsWith(linkPrefixes[field])) {
      errors.push(`${businessLabels[field]} ${linkPrefixes[field]} ile başlamalı.`);
    }
  });

  if (errors.length > 0) {
    const error = new Error("İşletme bilgileri geçersiz.");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = errors;
    throw error;
  }
}

export function validateBrandPayload(payload) {
  assertObject(payload, "Logo bilgileri geçersiz.");

  if (brandFields.some((field) => payload[field] !== undefined && payload[field] !== null && typeof payload[field] !== "string")) {
    const error = new Error("Logo bilgileri geçersiz.");
    error.statusCode = 400;
    error.code = "VALIDATION_ERROR";
    error.details = ["logo ve favicon alanları görsel veya null olmalı."];
    throw error;
  }
}
