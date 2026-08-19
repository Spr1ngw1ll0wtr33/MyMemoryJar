/* Memory Jar service worker.
   Keeps an offline copy of the four app files and nothing else.
   Updating is manual: uninstall the app, clear the site data in Chrome,
   then install again. Nothing here checks for a new version on its own. */

var CACHE = 'memory-jar-v22';

var FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(ev){
  ev.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(FILES); })
  );
});

self.addEventListener('activate', function(ev){
  ev.waitUntil(
    caches.keys().then(function(names){
      return Promise.all(names.map(function(n){
        if(n !== CACHE) return caches.delete(n);
      }));
    })
  );
});

self.addEventListener('fetch', function(ev){
  if(ev.request.method !== 'GET') return;
  if(new URL(ev.request.url).origin !== self.location.origin) return;
  ev.respondWith(
    caches.match(ev.request).then(function(hit){
      return hit || fetch(ev.request);
    })
  );
});
