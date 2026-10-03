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
  return localIso(new Date());
}

export function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localIso(date);
}

function localIso(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
