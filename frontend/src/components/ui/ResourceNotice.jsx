export function ResourceNotice({ isLoading, error }) {
  if (isLoading) {
    return <div className="resource-notice loading" role="status"><span className="loading-dot" /> Veriler yükleniyor...</div>;
  }

  if (error) {
    return <div className="resource-notice error">Sunucuya ulaşılamadı; kayıtlar yüklenemedi veya güncel olmayabilir.</div>;
  }

  return null;
}
