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
  const [isSaving, setIsSaving] = useState(false);

  const save = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setNotice("");
    try {
      setForm(await saveBusinessSettings(form));
      setError("");
      setNotice("İşletme bilgileri kaydedildi ve siteye uygulandı.");
    } catch (saveError) {
      setError(saveError.message || "İşletme bilgileri kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const reset = async () => {
    setIsSaving(true);
    setNotice("");
    try {
      setForm(await resetBusinessSettings());
      setError("");
      setNotice("Varsayılan işletme bilgilerine dönüldü.");
    } catch (resetError) {
      setError(resetError.message || "Varsayılan ayarlara dönülemedi.");
    } finally {
      setIsSaving(false);
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
          <button className="primary-btn compact" type="submit" disabled={isSaving}><Save size={18} /> {isSaving ? "Kaydediliyor" : "Kaydet"}</button>
          <button className="outline-btn" type="button" onClick={reset} disabled={isSaving}><RotateCcw size={17} /> Varsayılana dön</button>
        </div>
      </form>
      <p className="branding-storage-note">Bu ayarlar sunucuda saklanır ve kaydedildiğinde tüm ziyaretçilere yansır.</p>
    </>
  );
}
