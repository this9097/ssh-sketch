const CACHE_NAME = 'ssh-sketch-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// 네트워크 우선 전략: 항상 최신 버전을 먼저 시도하고, 오프라인일 때만 캐시로 대체.
// (예전 버전이 캐시에 남아 새 배포를 가리는 문제를 피하기 위함)
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
