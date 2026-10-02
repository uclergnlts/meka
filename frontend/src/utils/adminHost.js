// The panel is served only on its own host (admin.<domain>, or admin.localhost while
// developing). The public site neither links to it nor opens it.
export const isAdminHost = typeof window !== "undefined" && window.location.hostname.startsWith("admin.");

// Address of the public site as seen from the panel: the same host without the "admin." prefix.
export function publicSiteUrl() {
  const { protocol, host } = window.location;
  return `${protocol}//${host.replace(/^admin\./, "")}/`;
}
