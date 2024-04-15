const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/App.jsx',
  '/main.jsx',
  '/db.jsx',
  '/index.css',
  '/App.css',
  '/Form.jsx',
  '/Todo.jsx',
  '/FilterButton.jsx',
  '/index.html',
];

self.addEventListener('install', event => {
  console.log('Service worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});


self.addEventListener("install", (event) => { 
    console.log("Service worker installing..."); 
    // Here, you'll later add code for actions like caching assets.
    //Use the event handler here accordingly of what you want to implement. 
  }); 