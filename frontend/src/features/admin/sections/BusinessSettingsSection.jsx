import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { business, resetBusinessSettings, saveBusinessSettings } from "../../../data/business.js";

const fields = [
  ["brand", "İşletme adı"], ["owner", "Yetkili"], ["phone", "Telefon"], ["phoneHref", "Telefon bağlantısı"],
  ["whatsappHref", "WhatsApp bağlantısı"], ["email", "E-posta"], ["emailHref", "E-posta bağlantısı"],
  ["instagram", "Instagram kullanıcı adı"], ["instagramHref", "Instagram bağlantısı"], ["address", "Adres"],
  ["city", "Şehir / İlçe"], ["mapsHref", "Google Maps bağlantısı"],
];

export function BusinessSettingsSection() {
  const [form, setForm] = useState(() => ({ ...business }));
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const save = (event) => {
    event.preventDefault();
    try {
      saveBusinessSettings(form);
      setError("");
      setNotice("İşletme bilgileri siteye uygulandı.");
    } catch {
      setNotice("");
      setError("İşletme bilgileri tarayıcıya kaydedilemedi.");
    }
  };

  const reset = () => {
    try {
      setForm(resetBusinessSettings());
      setError("");
      setNotice("Varsayılan işletme bilgilerine dönüldü.");
    } catch {
      setNotice("");
      setError("Varsayılan ayarlara dönülemedi.");
    }
  };

  return (
    <>
      <PageHeading title="İşletme ayarları" description="Kullanıcı sitesinde gösterilen iletişim ve işletme bilgilerini yönetin." chip="Site" />
      {error ? <div className="resource-notice error">{error}</div> : null}
      {notice ? <div className="resource-notice success">{notice}</div> : null}
      <form className="admin-form" onSubmit={save}>
        <div className="form-grid">
          {fields.map(([key, label]) => <label key={key}>{label}<input value={form[key] ?? ""} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} required /></label>)}
        </div>
        <div className="branding-actions">
          <button className="primary-btn compact" type="submit"><Save size={18} /> Kaydet</button>
          <button className="outline-btn" type="button" onClick={reset}><RotateCcw size={17} /> Varsayılana dön</button>
        </div>
      </form>
      <p className="branding-storage-note">Bu ayarlar canlı sunucuya geçene kadar yalnızca mevcut tarayıcıda saklanır.</p>
    </>
  );
}
