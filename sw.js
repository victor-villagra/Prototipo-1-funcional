// KCALIA Service Worker — offline-first cache
const CACHE = 'kcalia-v2';
const ASSETS = [
  './',
  './index.html',
  './AppShell.jsx',
  './Dashboard.jsx',
  './AddMeal.jsx',
  './Progress.jsx',
  './Profile.jsx',
  './Onboarding.jsx',
  './FoodLibrary.jsx',
  './WeeklyAnalysis.jsx',
  './Notifications.jsx',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap',
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Only handle GET requests
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        // Cache successful responses from same origin and CDN
        if (res && res.status === 200) {
          const url = new URL(e.request.url);
          const isCacheable = url.origin === self.location.origin
            || url.hostname === 'unpkg.com'
            || url.hostname === 'fonts.googleapis.com'
            || url.hostname === 'fonts.gstatic.com';
          if (isCacheable) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
