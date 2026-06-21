import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  /** Arbitrary JSON-LD objects to inject as <script type="application/ld+json"> */
  jsonLd?: object[];
  ogType?: string;
}

// Lightweight client-side head management. The prerender step bakes the same
// tags into static HTML for crawlers; this keeps them correct during SPA
// navigation for users (and for any crawler that does execute JS).
function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSeo({
  title,
  description,
  keywords,
  canonical,
  jsonLd,
  ogType = "website",
}: SeoOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    setMeta("name", "description", description);
    if (keywords) setMeta("name", "keywords", keywords);

    // Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", ogType);
    if (canonical) setMeta("property", "og:url", canonical);

    // Twitter card
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    if (canonical) setLink("canonical", canonical);

    // JSON-LD structured data (tagged so we can clean up our own on unmount)
    const scripts: HTMLScriptElement[] = [];
    if (jsonLd) {
      jsonLd.forEach((obj) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.setAttribute("data-seo-managed", "true");
        s.textContent = JSON.stringify(obj);
        document.head.appendChild(s);
        scripts.push(s);
      });
    }

    return () => {
      document.title = prevTitle;
      scripts.forEach((s) => s.remove());
    };
  }, [title, description, keywords, canonical, jsonLd, ogType]);
}
