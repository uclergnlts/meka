import { api } from "../services/apiClient.js";

const defaults = {
  brand: "MEKA Moto Garage",
  owner: "Metin Kalfa",
  legalOperator: "Metin Kalfa",
  licensedActivity: "Motosiklet parça ve aksesuar satışı",
  licenseAuthority: "T.C. Simav Belediye Başkanlığı",
  licenseIssueDate: "30.07.2026",
  licenseSequenceNumber: "43",
  phone: "0543 543 17 18",
  phoneHref: "tel:+905435431718",
  whatsappHref: "https://wa.me/905435431718",
  email: "mekamotogarage@gmail.com",
  emailHref: "mailto:mekamotogarage@gmail.com",
  instagram: "@mekamotogarage",
  instagramHref: "https://instagram.com/mekamotogarage",
  address: "Fatih Mahallesi Yeni Cami Caddesi No: 21/A",
  city: "Simav / Kütahya",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=Fatih+Mahallesi+Yeni+Cami+Caddesi+21%2FA+Simav+Kutahya",
};

// The server holds the settings; this browser copy only avoids a flash of the defaults
// on the next visit and keeps the site readable when the API is unreachable.
const STORAGE_KEY = "meka-business-settings";

let stored = {};
try {
  stored = typeof window !== "undefined"
    ? JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? {}
    : {};
} catch {
  stored = {};
}

export const business = { ...defaults, ...stored };
export const BUSINESS_SETTINGS_EVENT = "meka-business-settings-change";

function applySettings(settings) {
  Object.keys(business).forEach((key) => delete business[key]);
  Object.assign(business, defaults, settings);
  if (typeof window === "undefined") return;
  try {
    if (settings) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // The copy is optional; private browsing or a full quota must not break the page.
  }
  window.dispatchEvent(new CustomEvent(BUSINESS_SETTINGS_EVENT, { detail: business }));
}

// Called with the public settings response; the server is the source of truth, so a reset
// there (null) clears this browser's copy as well.
export function applyServerBusinessSettings(settings) {
  applySettings(settings ?? null);
}

export async function saveBusinessSettings(settings) {
  applySettings(await api.settings.saveBusiness(settings));
  return { ...business };
}

export async function resetBusinessSettings() {
  await api.settings.resetBusiness();
  applySettings(null);
  return { ...business };
}
