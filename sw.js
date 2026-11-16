// Fracta Lite · il service worker (scritto da scripts/web/sito.mjs)
// Prima la copia, poi la rete: l'app si apre subito e anche senza
// rete. Una versione nuova si scarica mentre l'app è aperta e si vede
// alla prossima apertura. Non manda niente a nessuno: risponde solo alle
// richieste dei file del sito.
const VERSIONE = "fracta-fd8593ce5703";
const FILE = [
  "./",
  "./assets/index--_6P6d-4.js",
  "./icona-180.png",
  "./icona-192.png",
  "./icona-512.png",
  "./index.html",
  "./manifest.webmanifest"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(n => n !== VERSIONE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  /* ogni pagina del sito è l'app: l'index tenuto, o la rete se manca */
  if (r.mode === "navigate") {
    e.respondWith(caches.match("./index.html").then(x => x || fetch(r)));
    return;
  }
  e.respondWith(caches.match(r).then(x => x || fetch(r)));
});
