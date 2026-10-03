// What search engines and link previews read about the page. The tags start out in index.html
// with the home page's values and follow the page being shown from here.
export const SITE_ORIGIN = "https://mekamotogarage.com";

const setContent = (selector, content) => document.querySelector(selector)?.setAttribute("content", content);

export function applyPageMeta({ title, description, path }) {
  const url = `${SITE_ORIGIN}${path}`;
  document.title = title;
  setContent('meta[name="description"]', description);
  setContent('meta[property="og:title"]', title);
  setContent('meta[property="og:description"]', description);
  setContent('meta[property="og:url"]', url);
  // Each page names one address as its own, so www, old #links and unknown paths do not
  // count as separate copies.
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = url;
}

// The shop details shown in search results come from the same settings as the site itself,
// so a phone or address changed in the panel does not leave a stale copy behind.
export function applyBusinessSchema(business) {
  const node = document.getElementById("business-schema");
  if (!node) return;
  const [locality, region] = business.city.split("/").map((part) => part.trim());
  node.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": ["Store", "MotorcycleRepair"],
    name: business.brand,
    description: "Simav'da motosiklet servisi, bakım, yedek parça ve aksesuar.",
    url: `${SITE_ORIGIN}/`,
    image: `${SITE_ORIGIN}/og-image.jpg`,
    telephone: business.phoneHref.replace("tel:", ""),
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: locality,
      addressRegion: region,
      addressCountry: "TR",
    },
    hasMap: business.mapsHref,
    areaServed: locality,
    sameAs: [business.instagramHref],
  });
}
