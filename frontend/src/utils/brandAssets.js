const STORAGE_KEY = "meka-brand-assets";
export const BRAND_ASSETS_EVENT = "meka-brand-assets-change";

export function getBrandAssets() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

export function saveBrandAssets(assets) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  window.dispatchEvent(new CustomEvent(BRAND_ASSETS_EVENT, { detail: assets }));
}

export function applyFavicon(favicon) {
  if (!favicon || typeof document === "undefined") return;
  let link = document.querySelector('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = favicon;
}
