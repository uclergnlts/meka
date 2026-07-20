export function ResourceNotice({ isLoading, error }) {
  if (isLoading) {
    return <div className="resource-notice">Veriler yükleniyor...</div>;
  }

  if (error) {
    return <div className="resource-notice error">API bağlantısı kurulamadı, ekranda son bilinen veri gösteriliyor.</div>;
  }

  return null;
}
