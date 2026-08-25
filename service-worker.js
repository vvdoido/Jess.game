const CACHE_NAME = 'cyber-classica-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/game.js',
  '/js/entities.js',
  '/js/renderer.js',
  '/js/audio.js',
  '/js/map.js',
  '/manifest.webmanifest',
  '/assets/favicon.svg',
  '/assets/icon-180x180.png',
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png',
  '/assets/cyber-classica-home.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Service Worker: Arquivos essenciais em cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Removendo cache antigo', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        }).catch(() => {
          if (event.request.destination === 'image') {
            return new Response('', { status: 404, statusText: 'Imagem não disponível offline' });
          }
        });
      })
  );
});
