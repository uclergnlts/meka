import { useState } from "react";
import { DatabaseBackup, Download, RotateCcw } from "lucide-react";
import { PageHeading } from "../../../components/ui/PageHeading.jsx";
import { api } from "../../../services/apiClient.js";
import { todayIso } from "../../../utils/formatters.js";

// Browser copies of server settings, plus keys left behind by the older browser-only panel.
const cacheKeys = [
  "meka-brand-assets",
  "meka-business-settings",
  "meka-product-images",
  "meka-service-jobs",
  "meka-stock-cards",
  "meka-stock-history",
];

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
  const [isExporting, setIsExporting] = useState(false);

  const exportRecords = async () => {
    setIsExporting(true);
    setError("");
    setNotice("");
    try {
      const records = await api.exportRecords();
      downloadFile(JSON.stringify(records, null, 2), `meka-kayitlar-${todayIso()}.json`, "application/json");
      setNotice("Kayıtlar indirildi.");
    } catch (exportError) {
      setError(exportError.message || "Kayıtlar indirilemedi.");
    } finally {
      setIsExporting(false);
    }
  };

  const clearBrowserCache = () => {
    if (!window.confirm("Bu tarayıcıdaki panel önbelleği temizlenecek. Sunucudaki kayıtlar ve ayarlar etkilenmez. Devam edilsin mi?")) return;
    cacheKeys.forEach((key) => window.localStorage.removeItem(key));
    setError("");
    setNotice("Tarayıcı önbelleği temizlendi. Panel yenileniyor.");
    window.setTimeout(() => window.location.reload(), 500);
  };

  return (
    <>
      <PageHeading title="Yedekleme ve aktarım" description="Sunucudaki kayıtların bir kopyasını indirin." chip="Sunucu verisi" />
      {error ? <div className="resource-notice error">{error}</div> : null}
      {notice ? <div className="resource-notice success">{notice}</div> : null}
      <div className="backup-grid">
        <article className="backup-card"><DatabaseBackup size={28} /><div><h2>Kayıtları indir</h2><p>Ürün, müşteri, fatura, servis, stok hareketi, gelir/gider kayıtlarını ve site ayarlarını tek bir JSON dosyası olarak indirir.</p><button className="primary-btn compact" type="button" onClick={exportRecords} disabled={isExporting}><Download size={17} /> {isExporting ? "Hazırlanıyor" : "Kayıtları indir"}</button></div></article>
        <article className="backup-card danger-card"><RotateCcw size={28} /><div><h2>Tarayıcı önbelleğini temizle</h2><p>Bu tarayıcıda tutulan ayar kopyalarını ve eski sürümden kalan yerel verileri siler. Ayarlar sunucudan yeniden yüklenir.</p><button className="outline-btn danger-outline" type="button" onClick={clearBrowserCache}><RotateCcw size={17} /> Önbelleği temizle</button></div></article>
      </div>
      <div className="backup-note"><strong>Önemli:</strong> İndirilen dosya fotoğrafları ve yönetici hesabını içermez, geri yükleme için de kullanılmaz. Geri yüklenebilir tam yedek için sunucuda <code>npm run db:backup</code> çalıştırılmalıdır; bu komut veritabanını ve uploads klasörünü birlikte yedekler.</div>
    </>
  );
}
