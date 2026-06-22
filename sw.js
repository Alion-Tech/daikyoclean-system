/* ============================================================
   ダイキョウクリーン 現場アプリ — Service Worker
   方針: 全リクエスト NETWORK-FIRST（オンライン時は常にネット取得、
        失敗時=オフライン時のみキャッシュにフォールバック）。
        これにより再デプロイ時に古いキャッシュを返さない。
   ============================================================ */
const CACHE = 'dk-mobile-v1';

/* インストール時に最小シェルを相対URLで事前キャッシュ（オフライン起動用） */
const SHELL = [
  './ops.html',
  './manifest.webmanifest',
  './icon.svg',
  './js/9266091e-31ee-4869-8666-cd44c3eb4dad.js',
  './js/4782e1c3-7b82-453c-aa15-e66f59cde9b3.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL))
      .catch(() => {})           // 一部取得失敗でもインストールは継続
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // GET 以外（将来の POST 等）はそのまま通す
  if (req.method !== 'GET') return;

  // NETWORK-FIRST: まずネットワーク。成功したらキャッシュも更新。
  e.respondWith(
    fetch(req)
      .then((res) => {
        // 同一オリジンの正常レスポンスのみキャッシュ更新（オフライン用の控え）
        try {
          if (res && res.ok && new URL(req.url).origin === self.location.origin) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
        } catch (_) {}
        return res;
      })
      .catch(async () => {
        // オフライン: キャッシュにフォールバック
        const cached = await caches.match(req);
        if (cached) return cached;
        // ナビゲーション要求はアプリ本体を返す（SPA フォールバック）
        if (req.mode === 'navigate') {
          const shell = await caches.match('./ops.html');
          if (shell) return shell;
        }
        return new Response('オフラインです（キャッシュ未取得）', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
  );
});
