/* Memory Jar service worker.
   Keeps an offline copy of the four app files and nothing else.
   Raising the number in CACHE makes phones fetch a fresh copy.
   Do NOT clear the site data in Chrome: Garden Diary and Boundaries share this
   web address, and clearing it would wipe their data too. */

var CACHE = 'memory-jar-v23';

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
        // only this app's own old copies; other apps share this address
        if(n.indexOf('memory-jar-') === 0 && n !== CACHE) return caches.delete(n);
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
