import { useState } from "react";
import { DatabaseBackup, Download, RotateCcw, Upload } from "lucide-react";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";

const storageKeys = [
  "meka-brand-assets",
  "meka-business-settings",
  "meka-product-images",
  "meka-service-jobs",
  "meka-stock-cards",
  "meka-stock-history",
];
const MAX_BACKUP_SIZE = 10 * 1024 * 1024;

function downloadFile(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function BackupSection() {
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const exportBackup = () => {
    const data = Object.fromEntries(storageKeys.map((key) => [key, window.localStorage.getItem(key)]));
    const backup = { application: "MEKA Moto Garage", version: 1, exportedAt: new Date().toISOString(), data };
    downloadFile(JSON.stringify(backup, null, 2), `meka-panel-yedek-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
    setError("");
    setNotice("Panel yedeği indirildi.");
  };

  const importBackup = async (file) => {
    if (!file) return;
    setError("");
    setNotice("");
    try {
      if (file.size > MAX_BACKUP_SIZE) throw new Error("Yedek dosyası en fazla 10 MB olabilir.");
      const backup = JSON.parse(await file.text());
      if (backup?.application !== "MEKA Moto Garage" || backup?.version !== 1 || !backup.data || typeof backup.data !== "object" || Array.isArray(backup.data)) throw new Error("Geçerli bir MEKA panel yedeği seçin.");
      storageKeys.forEach((key) => {
        const value = backup.data[key];
        if (value !== null && value !== undefined && typeof value !== "string") throw new Error("Yedek dosyasında geçersiz veri bulundu.");
        if (typeof value === "string") JSON.parse(value);
      });
      if (!window.confirm("Mevcut yerel panel verileri yedekteki verilerle değiştirilecek. Devam edilsin mi?")) return;
      storageKeys.forEach((key) => {
        const value = backup.data[key];
        if (typeof value === "string") window.localStorage.setItem(key, value);
        else window.localStorage.removeItem(key);
      });
      setNotice("Yedek geri yüklendi. Panel yenileniyor.");
      window.setTimeout(() => window.location.reload(), 500);
    } catch (importError) {
      setError(importError.message || "Yedek dosyası okunamadı.");
    }
  };

  const resetLocalData = () => {
    if (!window.confirm("Logo, ürün görselleri, işletme ayarları, servis ve stok kayıtları bu tarayıcıdan silinecek. Bu işlem geri alınamaz. Devam edilsin mi?")) return;
    storageKeys.forEach((key) => window.localStorage.removeItem(key));
    setNotice("Yerel panel verileri temizlendi. Panel yenileniyor.");
    window.setTimeout(() => window.location.reload(), 500);
  };

  return (
    <>
      <PageHeading title="Yedekleme ve aktarım" description="Bu tarayıcıdaki ayarları ve önceki yerel kayıtları yedekleyin." chip="Yerel veri" />
      {error ? <div className="resource-notice error">{error}</div> : null}
      {notice ? <div className="resource-notice success">{notice}</div> : null}
      <div className="backup-grid">
        <article className="backup-card"><DatabaseBackup size={28} /><div><h2>Panel yedeği oluştur</h2><p>İşletme ayarları, görseller, servis ve stok kayıtlarını JSON dosyası olarak indirir.</p><button className="primary-btn compact" type="button" onClick={exportBackup}><Download size={17} /> Yedeği indir</button></div></article>
        <article className="backup-card"><Upload size={28} /><div><h2>Yedeği geri yükle</h2><p>Daha önce indirilen MEKA panel yedeğini bu tarayıcıya aktarır.</p><label className="outline-btn upload-button"><Upload size={17} /> Yedek seç<input type="file" accept="application/json,.json" onChange={(event) => importBackup(event.target.files?.[0])} /></label></div></article>
        <article className="backup-card danger-card"><RotateCcw size={28} /><div><h2>Yerel verileri sıfırla</h2><p>Yalnızca bu tarayıcıda tutulan panel verilerini temizler ve varsayılan görünüme döner.</p><button className="outline-btn danger-outline" type="button" onClick={resetLocalData}><RotateCcw size={17} /> Yerel verileri temizle</button></div></article>
      </div>
      <div className="backup-note"><strong>Önemli:</strong> Bu dosya MySQL kayıtlarını ve sunucuya yüklenen fotoğrafları içermez. Tam yedek için veritabanı ve uploads klasörü birlikte yedeklenmelidir.</div>
    </>
  );
}
