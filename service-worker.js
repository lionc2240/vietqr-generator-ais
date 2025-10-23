const CACHE_NAME = 'vietqr-generator-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-512x512.png',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/services/vietqrService.ts',
  '/services/profileService.ts',
  '/services/messageService.ts',
  '/services/locationService.ts',
  '/utils/templateProcessor.ts',
  '/utils/smartMessageGenerator.ts',
  '/components/Header.tsx',
  '/components/QRForm.tsx',
  '/components/QRDisplay.tsx',
  '/components/QRModal.tsx',
  '/components/QuickActionsDropdown.tsx',
  '/components/Spinner.tsx'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Use a "stale-while-revalidate" strategy for all GET requests.
  // This strategy prioritizes cached content for speed and offline availability,
  // while fetching updates in the background for next time.
  if (event.request.method === 'GET') {
      event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
          return cache.match(event.request)
            .then(response => {
              // Fetch a new version from the network and update the cache.
              const fetchPromise = fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                  cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
              });

              // Return the cached response if it's available, otherwise wait for the network.
              return response || fetchPromise;
            });
        })
      );
  }
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});