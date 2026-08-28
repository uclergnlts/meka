const STORAGE_KEY = "meka-product-images";
export const PRODUCT_IMAGES_EVENT = "meka-product-images-change";

export function getProductImages() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

export function saveProductImage(productId, image) {
  const images = getProductImages();
  if (image) images[productId] = image;
  else delete images[productId];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  window.dispatchEvent(new CustomEvent(PRODUCT_IMAGES_EVENT, { detail: images }));
}

export function readProductImage(file) {
  return new Promise((resolve, reject) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) return reject(new Error("PNG, JPG veya WebP görsel seçin."));
    if (file.size > 1024 * 1024) return reject(new Error("Ürün görseli en fazla 1 MB olabilir."));
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Ürün görseli okunamadı."));
    reader.readAsDataURL(file);
  });
}
