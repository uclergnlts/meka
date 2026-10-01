export function readProductImage(file) {
  return new Promise((resolve, reject) => {
    if (typeof FileReader === "undefined") return reject(new Error("Görsel okuma yalnızca tarayıcıda kullanılabilir."));
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) return reject(new Error("PNG, JPG veya WebP görsel seçin."));
    if (file.size > 1024 * 1024) return reject(new Error("Ürün görseli en fazla 1 MB olabilir."));
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Ürün görseli okunamadı."));
    reader.readAsDataURL(file);
  });
}
