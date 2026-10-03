import { api, assetUrl } from "../services/apiClient.js";

// The server holds the logo and favicon; this browser copy only avoids a flash of the
// default mark on the next visit.
const STORAGE_KEY = "meka-brand-assets";
const brandFields = ["logo", "favicon"];
export const BRAND_ASSETS_EVENT = "meka-brand-assets-change";

export function getBrandAssets() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function applyBrandAssets(assets) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  } catch {
    // The copy is optional; private browsing or a full quota must not break the page.
  }
  applyFavicon(assets.favicon);
  window.dispatchEvent(new CustomEvent(BRAND_ASSETS_EVENT, { detail: assets }));
}

// Called with the public settings response; the server is the source of truth, so a reset
// there clears this browser's copy as well.
export function applyServerBrandAssets(assets) {
  applyBrandAssets(assets ?? {});
}

// Each image goes in its own request so two 1 MB files stay under the API's body limit.
// Images that already live on the server are left untouched.
export async function saveBrandAssets(assets) {
  let saved = assets;
  for (const field of brandFields) {
    if (assets[field]?.startsWith("/uploads/")) continue;
    saved = await api.settings.saveBrand({ [field]: assets[field] ?? null });
  }
  applyBrandAssets(saved);
  return saved;
}

export function applyFavicon(favicon) {
  if (!favicon || typeof document === "undefined") return;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = assetUrl(favicon);
}
