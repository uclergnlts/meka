export function getStockStatus(stock, minStock) {
  if (stock <= minStock) {
    return "Sipariş ver";
  }

  if (stock <= minStock * 1.5) {
    return "Takipte";
  }

  return "Sağlıklı";
}
