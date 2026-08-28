import { useState } from "react";
import { Image, RotateCcw, Save, Upload } from "lucide-react";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { applyFavicon, getBrandAssets, saveBrandAssets } from "../../../utils/brandAssets.js";

const MAX_FILE_SIZE = 1024 * 1024;
const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

function readImage(file) {
  return new Promise((resolve, reject) => {
    if (!allowedTypes.includes(file.type)) {
      reject(new Error("PNG, JPG veya WebP biçiminde bir görsel seçin."));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("Görsel boyutu en fazla 1 MB olabilir."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Görsel okunamadı."));
    reader.readAsDataURL(file);
  });
}

export function BrandingSection() {
  const [assets, setAssets] = useState(getBrandAssets);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const selectImage = async (field, file) => {
    if (!file) return;
    setError("");
    setNotice("");
    try {
      const value = await readImage(file);
      setAssets((current) => ({ ...current, [field]: value }));
    } catch (uploadError) {
      setError(uploadError.message);
    }
  };

  const save = () => {
    try {
      saveBrandAssets(assets);
      applyFavicon(assets.favicon);
      setError("");
      setNotice("Logo ayarları kaydedildi ve siteye uygulandı.");
    } catch {
      setError("Görseller kaydedilemedi. Daha küçük dosyalar deneyin.");
    }
  };

  const reset = () => {
    const emptyAssets = {};
    setAssets(emptyAssets);
    saveBrandAssets(emptyAssets);
    document.querySelector('link[rel="icon"]')?.remove();
    setError("");
    setNotice("Varsayılan MEKA görünümüne dönüldü.");
  };

  return (
    <>
      <PageHeading title="Logo yönetimi" description="Kullanıcı sitesindeki ana logoyu ve tarayıcı sekmesi simgesini yönetin." chip="Marka" />
      {error ? <div className="resource-notice error">{error}</div> : null}
      {notice ? <div className="resource-notice success">{notice}</div> : null}
      <div className="branding-grid">
        <article className="branding-card">
          <div className="branding-preview logo-preview-admin">
            {assets.logo ? <img src={assets.logo} alt="Yüklenen ana logo önizlemesi" /> : <Image size={34} />}
          </div>
          <div>
            <h2>Ana logo</h2>
            <p>Üst menüde kullanılacak yatay veya kare logo. Şeffaf arka planlı PNG önerilir.</p>
            <label className="outline-btn upload-button">
              <Upload size={17} /> Logo seç
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => selectImage("logo", event.target.files?.[0])} />
            </label>
          </div>
        </article>
        <article className="branding-card">
          <div className="branding-preview favicon-preview-admin">
            {assets.favicon ? <img src={assets.favicon} alt="Yüklenen favicon önizlemesi" /> : <span>ME</span>}
          </div>
          <div>
            <h2>Tarayıcı simgesi</h2>
            <p>Sekmede görünecek kare simge. En az 128 × 128 piksel PNG önerilir.</p>
            <label className="outline-btn upload-button">
              <Upload size={17} /> Simge seç
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => selectImage("favicon", event.target.files?.[0])} />
            </label>
          </div>
        </article>
      </div>
      <div className="branding-actions">
        <button className="primary-btn" type="button" onClick={save}><Save size={18} /> Değişiklikleri kaydet</button>
        <button className="outline-btn" type="button" onClick={reset}><RotateCcw size={17} /> Varsayılana dön</button>
      </div>
      <p className="branding-storage-note">Bu sürümde görseller bu tarayıcıda saklanır. Başka cihazlara aktarım için daha sonra sunucu tabanlı medya alanı eklenebilir.</p>
    </>
  );
}
