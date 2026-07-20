const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function apiGet(path) {
  return apiRequest(path);
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message ?? `API isteği başarısız: ${response.status}`);
  }

  const payload = await response.json();
  return payload.data;
}

export const api = {
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
    list: () => apiGet("/api/stock"),
    alerts: () => apiGet("/api/stock/alerts"),
  },
  service: {
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
};
