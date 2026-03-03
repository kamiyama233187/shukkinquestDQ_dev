const CACHE_VERSION = "v1.2.1";   // ← 更新ごとに上げる
const CACHE_NAME = "shukkin-quest-dev-1" + CACHE_VERSION;

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./about.html",
  "./sugoroku.html",
  "./manifest.json",
  "./shukkin_logo.png",
  "./attack.mp3",
  "./miss.mp3",
  "./cursor.mp3",
  "./decision.mp3",
  "./battle_end.mp3",
  "./levelup.mp3"
];

// インストール時にキャッシュ
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// 古いキャッシュ削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ネット優先 → 失敗したらキャッシュ
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match(event.request))
  );

});

