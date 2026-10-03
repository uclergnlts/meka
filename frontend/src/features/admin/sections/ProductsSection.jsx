import { useMemo, useState } from "react";
import { Image, Pencil, Plus, Save, Search, Trash2, Upload, X } from "lucide-react";
import { DataTable } from "../../../components/ui/DataTable.jsx";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { ResourceNotice } from "../../../components/ui/ResourceNotice.jsx";
import { useApiResource } from "../../../hooks/useApiResource.js";
import { api, assetUrl } from "../../../services/apiClient.js";
import { formatCurrency } from "../../../utils/formatters.js";
import { readProductImage } from "../../../utils/productImages.js";

const emptyProductForm = {
  name: "",
  category: "Yedek Parça",
  brand: "",
  price: "",
  stock: "",
  minStock: "",
  tag: "Stokta",
  image: "brake",
  compatibility: "",
};

export function ProductsSection() {
  const { data: productList, setData: setProductList, reload, error, isLoading } = useApiResource(api.products.list, []);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyProductForm);
  const [editingId, setEditingId] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [productImage, setProductImage] = useState(null);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("tr-TR");

    if (!normalizedQuery) {
      return productList;
    }

    return productList.filter((product) => [product.name, product.category, product.brand, product.compatibility]
      .join(" ")
      .toLocaleLowerCase("tr-TR")
      .includes(normalizedQuery));
  }, [productList, query]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyProductForm);
    setActionError(null);
    setProductImage(null);
  };

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setActionError(null);
    setForm({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      minStock: product.minStock,
      tag: product.tag,
      image: product.image,
      compatibility: product.compatibility,
    });
    setProductImage(product.image?.startsWith("/uploads/") || product.image?.startsWith("data:") ? product.image : null);
  };

  const selectProductImage = async (file) => {
    if (!file) return;
    try {
      setProductImage(await readProductImage(file));
      setActionError(null);
    } catch (imageError) {
      setActionError(imageError.message);
    }
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setActionError(null);

    try {
      const payload = { ...form, image: productImage || "brake" };
      if (editingId) {
        const updatedProduct = await api.products.update(editingId, payload);
        setProductList((current) => current.map((product) => product.id === editingId ? updatedProduct : product));

      } else {
        const createdProduct = await api.products.create(payload);
        setProductList((current) => [createdProduct, ...current]);

      }

      resetForm();
      await reload();
    } catch (requestError) {
      setActionError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProduct = async (productId) => {
    const product = productList.find((item) => item.id === productId);
    if (!window.confirm(`“${product?.name ?? productId}” ürünü stok geçmişiyle birlikte silinecek. Devam edilsin mi?`)) return;
    setActionError(null);

    try {
      await api.products.delete(productId);
      setProductList((current) => current.filter((product) => product.id !== productId));
      await reload();
    } catch (requestError) {
      setActionError(requestError.message);
    }
  };

  return (
    <>
      <PageHeading title="Ürün takibi" description="Vitrinde görünen ürünleri, marka bilgisini ve teklif fiyatlarını yönetin." chip={`${productList.length} ürün`} />
      <ResourceNotice isLoading={isLoading} error={error} />
      {actionError ? <div className="resource-notice error">{actionError}</div> : null}
      <div className="admin-toolbar">
        <label className="admin-search">
          <Search size={17} />
          <input type="search" placeholder="Ürün, kategori veya marka ara" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <button className="primary-btn compact" type="button" onClick={resetForm}>
          <Plus size={18} /> Ürün ekle
        </button>
      </div>
      <form className="admin-form" onSubmit={saveProduct}>
        <div className="form-heading">
          <h3>{editingId ? "Ürünü düzenle" : "Yeni ürün"}</h3>
          {editingId ? (
            <button type="button" className="icon-action" onClick={resetForm} aria-label="Düzenlemeyi kapat">
              <X size={18} />
            </button>
          ) : null}
        </div>
        <div className="form-grid">
          <label>
            Ürün adı
            <input value={form.name} onChange={(event) => updateField("name", event.target.value)} required />
          </label>
          <label>
            Kategori
            <select value={form.category} onChange={(event) => updateField("category", event.target.value)}>
              <option>Yedek Parça</option>
              <option>Aksesuar</option>
              <option>Bakım</option>
              <option>Elektrik</option>
            </select>
          </label>
          <label>
            Marka
            <input value={form.brand} onChange={(event) => updateField("brand", event.target.value)} required />
          </label>
          <label>
            Fiyat
            <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateField("price", event.target.value)} required />
          </label>
          <label>
            Stok
            <input type="number" min="0" value={form.stock} onChange={(event) => updateField("stock", event.target.value)} required />
          </label>
          <label>
            Minimum stok
            <input type="number" min="0" value={form.minStock} onChange={(event) => updateField("minStock", event.target.value)} required />
          </label>
          <label>
            Etiket
            <input value={form.tag} onChange={(event) => updateField("tag", event.target.value)} />
          </label>
          <label>
            Uyumluluk
            <input value={form.compatibility} onChange={(event) => updateField("compatibility", event.target.value)} />
          </label>
        </div>
        <div className="product-image-editor">
          <div className="product-image-preview">{productImage ? <img src={assetUrl(productImage)} alt="Ürün görseli önizlemesi" /> : <Image size={32} />}</div>
          <div><strong>Ürün görseli</strong><p>PNG, JPG veya WebP; en fazla 1 MB.</p><label className="outline-btn upload-button"><Upload size={17} /> Görsel seç<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => selectProductImage(event.target.files?.[0])} /></label>{productImage ? <button className="text-danger-button" type="button" onClick={() => setProductImage(null)}>Görseli kaldır</button> : null}</div>
        </div>
        <button className="primary-btn compact" type="submit" disabled={isSaving}>
          <Save size={18} /> {isSaving ? "Kaydediliyor" : "Kaydet"}
        </button>
      </form>
      <DataTable
        title="Ürün listesi"
        columns={["Ürün", "Kategori", "Marka", "Fiyat", "Stok", "Uyumluluk", "İşlem"]}
        rows={filteredProducts.map((product) => ({
          id: product.id,
          cells: [
            product.name,
            product.category,
            product.brand,
            formatCurrency(product.price),
            `${product.stock} adet`,
            product.compatibility,
            <div className="row-actions">
              <button type="button" onClick={() => startEdit(product)} aria-label={`${product.name} düzenle`}>
                <Pencil size={16} />
              </button>
              <button type="button" onClick={() => deleteProduct(product.id)} aria-label={`${product.name} sil`}>
                <Trash2 size={16} />
              </button>
            </div>,
          ],
        }))}
      />
    </>
  );
}
