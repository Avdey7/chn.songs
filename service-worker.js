/* Service worker (network-first for app/songs, cache-first for static assets).
   ----------------------------------------------------------------------------
   When ONLINE the app always loads the latest files from your host, so new
   songs show up on reload without any cache-clearing. When OFFLINE it serves
   the last cached copy. You no longer need to bump the version every time you
   add a song; only bump it if you change the icons or the chordsheetjs file. */
const CACHE_VERSION = "songbook-v45";

const PRECACHE = [
  ".", "index.html", "app.js", "songs.js", "convert-core.js", "chord-diagrams.js", "manifest.json",
  "vendor/chordsheetjs.min.js",
  "icons/icon-192.png", "icons/icon-512.png",
  "icons/icon-maskable-512.png", "icons/icon-180.png"
];

// these never change between updates -> serve from cache (fast + offline).
// songs.js is only the offline seed (Supabase is the source of truth), so it's
// safe to cache-first too; a CACHE_VERSION bump re-precaches a fresh copy.
const STATIC = ["vendor/chordsheetjs.min.js", "songs.js", "icons/"];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_VERSION).then((c) => c.addAll(PRECACHE)).catch(() => {}));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION && k !== CACHE_VERSION + "-fonts").map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function cacheFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  const hit = await cache.match(req);
  if (hit) return hit;
  try { const res = await fetch(req); cache.put(req, res.clone()); return res; }
  catch { return hit || Response.error(); }
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    // bypass the browser HTTP cache so app.js/index.html stay fresh after deploy
    const res = await fetch(req, { cache: "no-store" });
    cache.put(req, res.clone());
    return res;
  } catch {
    const hit = await cache.match(req);
    if (hit) return hit;
    if (req.mode === "navigate") return (await cache.match("index.html")) || Response.error();
    return Response.error();
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Google Fonts -> cache-first in a separate cache
  if (url.hostname.includes("fonts.googleapis.com") || url.hostname.includes("fonts.gstatic.com")) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION + "-fonts");
      const hit = await cache.match(req);
      if (hit) return hit;
      try { const res = await fetch(req); cache.put(req, res.clone()); return res; }
      catch { return hit || Response.error(); }
    })());
    return;
  }

  // same-origin static assets -> cache-first; everything else -> network-first
  if (url.origin === self.location.origin && STATIC.some((p) => url.pathname.includes(p))) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkFirst(req));
  }
});
