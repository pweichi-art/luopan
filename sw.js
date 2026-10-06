// 離線用：同源檔案走 network-first（有網路拿最新版，離線才用快取）
// cache:'no-cache' 讓瀏覽器每次都先問伺服器檔案有沒有變（沒變只回一個很小的 304），
// 不然 GitHub Pages 的 max-age=600 會讓更新晚 10 分鐘才看得到。
const CACHE = 'luopan-v7';
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './lunar.js', './almanac.js', './sun.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  // 用網址重新發請求：導覽請求（打開頁面）不能直接帶 cache 選項
  e.respondWith(
    fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' })
      .then(r => {
        if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return r;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
