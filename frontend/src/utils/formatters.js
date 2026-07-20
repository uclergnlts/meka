export function formatCurrency(value) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
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
