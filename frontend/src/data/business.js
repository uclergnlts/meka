const defaults = {
  brand: "MEKA Moto Garage",
  owner: "Metin Kalfa",
  phone: "0543 543 17 18",
  phoneHref: "tel:+905435431718",
  whatsappHref: "https://wa.me/905435431718",
  email: "mekamotogarage@gmail.com",
  emailHref: "mailto:mekamotogarage@gmail.com",
  instagram: "@mekamotogarage",
  instagramHref: "https://instagram.com/mekamotogarage",
  address: "Fatih Mahallesi Yeni Cami Caddesi no 21/A",
  city: "Kütahya / Simav",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=Fatih+Mahallesi+Yeni+Cami+Caddesi+21%2FA+Simav+Kutahya",
};

let stored = {};
try {
  stored = JSON.parse(window.localStorage.getItem("meka-business-settings")) ?? {};
} catch {
  stored = {};
}

export const business = { ...defaults, ...stored };
export const BUSINESS_SETTINGS_EVENT = "meka-business-settings-change";

export function saveBusinessSettings(settings) {
  Object.assign(business, settings);
  window.localStorage.setItem("meka-business-settings", JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(BUSINESS_SETTINGS_EVENT, { detail: settings }));
}

export function resetBusinessSettings() {
  Object.keys(business).forEach((key) => delete business[key]);
  Object.assign(business, defaults);
  window.localStorage.removeItem("meka-business-settings");
  window.dispatchEvent(new CustomEvent(BUSINESS_SETTINGS_EVENT, { detail: defaults }));
  return { ...defaults };
}
