// Legacy invoices store a final total without line items. Treat that total as a
// single tax-inclusive line, so opening and saving cannot tax it a second time.
export function invoiceToForm(invoice) {
  const hasItems = Array.isArray(invoice.items) && invoice.items.length > 0;
  return {
    customer: invoice.customer,
    description: invoice.description,
    amount: invoice.amount,
    status: invoice.status,
    date: invoice.date,
    discount: hasItems ? invoice.discount ?? "0" : "0",
    taxRate: hasItems ? invoice.taxRate ?? "20" : "0",
    items: hasItems ? invoice.items : [{ description: invoice.description, quantity: 1, unitPrice: invoice.amount }],
  };
}
export function invoiceTotal(form) {
  const cents = value => Math.round((Number(value || 0) + Number.EPSILON) * 100);
  const subtotal = form.items.reduce((sum, item) => sum + Math.round(Number(item.quantity || 0) * cents(item.unitPrice)), 0);
  const discounted = Math.max(0, subtotal - cents(form.discount));
  return Math.round(discounted * (10000 + cents(form.taxRate)) / 10000) / 100;
}
