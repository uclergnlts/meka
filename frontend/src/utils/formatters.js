export function formatCurrency(value) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function stockStatus(stock, minStock) {
  if (stock <= minStock) {
    return "Sipariş ver";
  }

  if (stock <= minStock * 1.5) {
    return "Takipte";
  }

  return "Sağlıklı";
}

// Local calendar date as YYYY-MM-DD; toISOString() alone would report UTC's date.
export function todayIso() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
