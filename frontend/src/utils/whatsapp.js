// Builds a wa.me link for a phone number typed the Turkish way ("0543 543 17 18").
export function whatsappLink(phone, text) {
  let digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `9${digits}`;
  else if (digits.length === 10) digits = `90${digits}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
