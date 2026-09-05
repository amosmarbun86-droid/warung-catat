// Service worker Warung Catat.
// Strategi: network-first untuk file sendiri (index.html, dll) supaya
// setiap kali kamu update & deploy ulang, pengguna selalu dapat versi
// terbaru duluan — cache cuma dipakai sebagai cadangan kalau offline.
// Panggilan ke Firebase/Firestore TIDAK disentuh service worker ini,
// jadi data tetap real-time seperti biasa.

const CACHE_VERSION = 'warung-catat-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Hanya tangani GET ke file di origin sendiri (app shell).
  // Biarkan request ke Firebase/Firestore/domain lain lewat jaringan
  // langsung tanpa campur tangan service worker.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        const salinan = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, salinan));
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
  );
});
