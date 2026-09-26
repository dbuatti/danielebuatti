import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { SITE_URL, pageMeta } from "../src/seo/pages";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Tags the per-page block replaces. twitter:card and everything else in
// index.html are left as they are.
const REPLACED_TAGS = [
  /\s*<title>[\s\S]*?<\/title>/i,
  /\s*<meta\s+name="description"[^>]*>/gi,
  /\s*<meta\s+property="(?:og|twitter):(?:type|url|title|description|image)"[^>]*>/gi,
  /\s*<link\s+rel="canonical"[^>]*>/gi,
];

function headFor(route: string, meta: { title: string; description: string; image: string }) {
  const url = `${SITE_URL}${route}`;
  const image = `${SITE_URL}${meta.image}`;
  const t = escapeHtml(meta.title);
  const d = escapeHtml(meta.description);
  return `
    <title>${t}</title>
    <meta name="description" content="${d}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Daniele Buatti" />
    <meta property="og:locale" content="en_AU" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="twitter:url" content="${url}" />
    <meta property="twitter:title" content="${t}" />
    <meta property="twitter:description" content="${d}" />
    <meta property="twitter:image" content="${image}" />
  `;
}

// After a production build, writes one HTML file per public page (e.g.
// dist/about.html) with that page's title, description, canonical URL and share
// image in the <head>. Link-preview bots don't run JavaScript, so without this
// every shared link shows the homepage's details. The app itself is unchanged:
// each file loads the same bundle. vercel.json's cleanUrls serves /about from
// about.html; anything else still falls through to index.html.
export default function pageMetaPlugin(): Plugin {
  let outDir = "dist";
  return {
    name: "page-meta",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const template = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      const stripped = REPLACED_TAGS.reduce((html, re) => html.replace(re, ""), template);
      for (const [route, meta] of Object.entries(pageMeta)) {
        const html = stripped.replace("</head>", `${headFor(route, meta)}</head>`);
        const file = route === "/" ? "index.html" : `${route.slice(1)}.html`;
        fs.writeFileSync(path.join(outDir, file), html);
      }
    },
  };
}
