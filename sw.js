// 製程助手 V2 離線快取。改版時把 VERSION 加一，手機會自動換新檔案。
const VERSION = "pa2-v1";
const FILES = ["./", "index.html", "manifest.json", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // 先上網拿最新版，沒網路時用快取
  e.respondWith(fetch(e.request).then(r => { if (new URL(e.request.url).origin === location.origin) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(e.request, cp)); } return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
