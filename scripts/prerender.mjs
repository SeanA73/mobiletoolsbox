/**
 * Post-build prerender step.
 *
 * Vite builds a single empty-shell index.html (a client-rendered SPA). That's
 * invisible to crawlers that don't run JS. This script runs AFTER `vite build`
 * and writes a real, content-filled HTML file for each SEO route:
 *
 *   dist/public/tools/index.html
 *   dist/public/tools/<slug>/index.html
 *
 * Because the production server uses express.static (which serves real files
 * before falling through to the SPA index.html), these files get served
 * directly to crawlers and users — no server changes required.
 *
 * The page content is generated from the SAME tool-seo data the React pages
 * use, so the static HTML and the live app never drift. React still boots
 * normally on top and takes over interactivity.
 *
 * Run automatically via the build script. Requires the client to be built
 * first (reads dist/public/index.html for the hashed asset tags).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist", "public");
const INDEX = path.join(DIST, "index.html");

const SITE_URL = "https://mobiletoolsbox.com";
const SITE_NAME = "MobileToolsBox";

// --- Load the tool metadata --------------------------------------------------
// We import the compiled data by reading the TS source and evaluating just the
// data array would be brittle; instead we keep a tiny build-time loader that
// uses tsx/esbuild-register isn't available here, so we read the JSON-safe
// fields via a dynamic import of a generated module. Simplest robust approach:
// import the source through a transpile. Since this script is run with tsx
// (same as the dev server), a direct import works.
import { TOOL_SEO } from "../client/src/lib/tool-seo.ts";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

if (!fs.existsSync(INDEX)) {
  console.error("[prerender] dist/public/index.html not found. Run `vite build` first.");
  process.exit(1);
}

const shell = fs.readFileSync(INDEX, "utf8");

// Pull the built <script> and <stylesheet> tags out of the shell so our
// generated pages load the exact same hashed assets and hydrate correctly.
const headAssetTags = [];
const scriptMatch = shell.match(/<script[^>]*type="module"[^>]*><\/script>/g) || [];
const cssMatch = shell.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || [];
headAssetTags.push(...cssMatch, ...scriptMatch);

function headFor({ title, description, keywords, canonical, jsonLd }) {
  const ld = (jsonLd || [])
    .map((obj) => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join("\n    ");
  return `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/icons/icon-192.webp" />
    <meta name="theme-color" content="#6366f1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    ${keywords ? `<meta name="keywords" content="${esc(keywords)}" />` : ""}
    <link rel="canonical" href="${esc(canonical)}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${esc(canonical)}" />
    <meta property="og:site_name" content="${esc(SITE_NAME)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    ${ld}
    ${headAssetTags.join("\n    ")}`;
}

// Static content markup that mirrors what the React component renders. React
// replaces this on mount; it exists for crawlers and fast first paint.
function toolBodyHtml(tool) {
  const appUrl = `/app?tool=${esc(tool.appToolId)}`;
  const faq = tool.faq
    .map(
      (f) => `<div class="pr-card"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`
    )
    .join("\n");
  const body = tool.body.map((p) => `<p>${esc(p)}</p>`).join("\n");
  const related = TOOL_SEO.filter((t) => t.slug !== tool.slug)
    .slice(0, 4)
    .map(
      (r) =>
        `<li><a href="/tools/${esc(r.slug)}"><strong>${esc(r.name)}</strong> — ${esc(r.tagline)}</a></li>`
    )
    .join("\n");

  return `<main class="pr">
  <nav aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/tools">Tools</a> › <span>${esc(tool.name)}</span></nav>
  <h1>${esc(tool.name)}</h1>
  <p class="pr-tagline">${esc(tool.tagline)}</p>
  <p><a class="pr-cta" href="${appUrl}">Open ${esc(tool.name)}</a></p>
  <section>${body}</section>
  <section><h2>Frequently asked questions</h2>${faq}</section>
  <section><h2>More free tools</h2><ul>${related}</ul></section>
  <footer><a href="/tools">All tools</a> · <a href="/">Home</a></footer>
</main>`;
}

function pageHtml(headHtml, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
${headHtml}
  </head>
  <body>
    <div id="root">${bodyHtml}</div>
  </body>
</html>`;
}

function writePage(relPath, html) {
  const outPath = path.join(DIST, relPath, "index.html");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
  console.log(`[prerender] wrote ${path.relative(DIST, outPath)}`);
}

// --- /tools/<slug> -----------------------------------------------------------
let count = 0;
for (const tool of TOOL_SEO) {
  const canonical = `${SITE_URL}/tools/${tool.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      url: canonical,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: tool.description,
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/tools` },
        { "@type": "ListItem", position: 3, name: tool.name, item: canonical },
      ],
    },
  ];
  const head = headFor({
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    canonical,
    jsonLd,
  });
  writePage(path.join("tools", tool.slug), pageHtml(head, toolBodyHtml(tool)));
  count++;
}

// --- /tools (hub) ------------------------------------------------------------
const hubCanonical = `${SITE_URL}/tools`;
const hubHead = headFor({
  title: "Free Online Tools — Calculators, Converters & More | MobileToolsBox",
  description:
    "A free collection of online productivity and utility tools: calculator, password generator, QR scanner, unit converter, timers, and more. No sign-up needed.",
  keywords:
    "free online tools, productivity tools, utility tools, online calculator, password generator, qr scanner",
  canonical: hubCanonical,
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Free Online Tools",
      url: hubCanonical,
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
      hasPart: TOOL_SEO.map((t) => ({
        "@type": "WebApplication",
        name: t.name,
        url: `${SITE_URL}/tools/${t.slug}`,
        applicationCategory: "UtilitiesApplication",
      })),
    },
  ],
});
const hubList = TOOL_SEO.map(
  (t) =>
    `<li><a href="/tools/${esc(t.slug)}"><strong>${esc(t.name)}</strong> — ${esc(t.tagline)}</a></li>`
).join("\n");
const hubBody = `<main class="pr">
  <h1>Free Online Tools</h1>
  <p class="pr-tagline">A growing collection of free productivity and utility tools that run right in your browser — no downloads, no sign-up.</p>
  <ul>${hubList}</ul>
  <footer><a href="/">Home</a></footer>
</main>`;
writePage("tools", pageHtml(hubHead, hubBody));

// --- sitemap.xml -------------------------------------------------------------
// Generated here so it always matches the pages that actually exist.
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "weekly" },
  { loc: `${SITE_URL}/tools`, priority: "0.9", changefreq: "weekly" },
  { loc: `${SITE_URL}/app`, priority: "0.8", changefreq: "weekly" },
  ...TOOL_SEO.map((t) => ({
    loc: `${SITE_URL}/tools/${t.slug}`,
    priority: "0.8",
    changefreq: "monthly",
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap, "utf8");
console.log(`[prerender] wrote sitemap.xml (${urls.length} urls)`);

console.log(`[prerender] done — ${count} tool pages + 1 hub page.`);
