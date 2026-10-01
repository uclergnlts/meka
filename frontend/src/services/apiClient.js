const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const REQUEST_TIMEOUT_MS = 12000;

export async function apiGet(path) {
  return apiRequest(path);
}

async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const headers = new Headers(options.headers);
  headers.set("X-Meka-Request", "1");
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const abortFromCaller = () => controller.abort();
  options.signal?.addEventListener("abort", abortFromCaller, { once: true });

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers,
      signal: controller.signal,
    });
  } catch (requestError) {
    if (requestError.name === "AbortError") {
      throw new Error("Sunucu yanıt vermedi. Lütfen tekrar deneyin.");
    }
    throw new Error("Sunucuya bağlanılamadı. Backend servisinin çalıştığını kontrol edin.");
  } finally {
    globalThis.clearTimeout(timeoutId);
    options.signal?.removeEventListener("abort", abortFromCaller);
  }

  if (response.status === 401 && !path.startsWith("/api/auth/")) window.dispatchEvent(new Event("meka-session-expired"));
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const details = Array.isArray(payload?.details) ? ` ${payload.details.join(" ")}` : "";
    throw new Error(payload?.message ? `${payload.message}${details}` : `API isteği başarısız: ${response.status}`);
  }

  if (response.status === 204) return null;
  const payload = await response.json().catch(() => null);
  if (!payload || !("data" in payload)) {
    throw new Error("Sunucudan beklenmeyen bir yanıt alındı.");
  }
  return payload.data;
}

export function assetUrl(value) { return value?.startsWith("/uploads/") ? `${API_BASE_URL}${value}` : value; }
export const api = {
  publicProducts: () => apiGet("/api/public/products"),
  publicSettings: () => apiGet("/api/public/settings"),
  exportRecords: () => apiGet("/api/export"),
  auth: {
    session: () => apiGet("/api/auth/session"),
    login: payload => apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify(payload) }),
    logout: () => apiRequest("/api/auth/logout", { method: "POST" }),
    changePassword: payload => apiRequest("/api/auth/password", { method: "POST", body: JSON.stringify(payload) }),
  },
  dashboard: {
    summary: () => apiGet("/api/dashboard/summary"),
  },
  products: {
    list: () => apiGet("/api/products"),
    detail: (id) => apiGet(`/api/products/${id}`),
    create: (payload) => apiRequest("/api/products", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    update: (id, payload) => apiRequest(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
    delete: (id) => apiRequest(`/api/products/${id}`, {
      method: "DELETE",
    }),
  },
  stock: {
    history: () => apiGet("/api/stock/history"),
    move: payload => apiRequest("/api/stock/movements", { method: "POST", body: JSON.stringify(payload) }),
    reverse: id => apiRequest(`/api/stock/movements/${id}/reverse`, { method: "POST" }),
    list: () => apiGet("/api/stock"),
    alerts: () => apiGet("/api/stock/alerts"),
  },
  service: {
    create: payload => apiRequest("/api/service/jobs", { method: "POST", body: JSON.stringify(payload) }),
    update: (id, payload) => apiRequest(`/api/service/jobs/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    delete: id => apiRequest(`/api/service/jobs/${id}`, { method: "DELETE" }),
    jobs: () => apiGet("/api/service/jobs"),
    summary: () => apiGet("/api/service/summary"),
  },
  customers: {
    list: () => apiGet("/api/customers"),
    create: (payload) => apiRequest("/api/customers", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    update: (id, payload) => apiRequest(`/api/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
    delete: (id) => apiRequest(`/api/customers/${id}`, {
      method: "DELETE",
    }),
  },
  invoices: {
    list: () => apiGet("/api/invoices"),
    summary: () => apiGet("/api/invoices/summary"),
    create: (payload) => apiRequest("/api/invoices", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    update: (id, payload) => apiRequest(`/api/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
    delete: (id) => apiRequest(`/api/invoices/${id}`, {
      method: "DELETE",
    }),
  },
  balance: {
    list: () => apiGet("/api/balance"),
    create: (payload) => apiRequest("/api/balance", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    update: (id, payload) => apiRequest(`/api/balance/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
    delete: (id) => apiRequest(`/api/balance/${id}`, {
      method: "DELETE",
    }),
  },
  settings: {
    saveBusiness: (payload) => apiRequest("/api/settings/business", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
    resetBusiness: () => apiRequest("/api/settings/business", {
      method: "DELETE",
    }),
    saveBrand: (payload) => apiRequest("/api/settings/brand", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  },
};
