// V2
var cacheName = 'app-science';
var filesToCache = [
    "/", "/about", "/health-policies-and-tech", "/connections",
    "/references", "/images/logo/science-128.png", "/images/logo/science-256.png", "/images/logo/science-30.png", "/images/logo/science-32.png", "/images/logo/science-48.png", "/images/logo/science-512.png", "/images/logo/science-60.png", "/images/logo/science-72.png", "/images/logo/science-80.png", "/images/logo/science-96.png", "/images/logo/science.ico", "/images/logo/science.png", "/images/logo/science.svg",
    "/js/cache.min.js", "/js/jquery.min.js", "/js/main.min.js", "/js/sw.min.js", "/css/error.min.css", "/css/main.min.css", "/fonts/MaterialIconMod.eot", "/fonts/MaterialIconMod.otf", "/fonts/MaterialIconMod.svg", "/fonts/MaterialIconMod.ttf", "/fonts/MaterialIconMod.woff", "/fonts/MaterialIconMod.woff2", "/fonts/PermanentMarker-Regular.eot", "/fonts/PermanentMarker-Regular.otf", "/fonts/PermanentMarker-Regular.svg",
    "/fonts/PermanentMarker-Regular.ttf", "/fonts/PermanentMarker-Regular.woff", "/fonts/PermanentMarker-Regular.woff2", "/fonts/Roboto-Bold.eot", "/fonts/Roboto-Bold.otf", "/fonts/Roboto-Bold.svg", "/fonts/Roboto-Bold.ttf", "/fonts/Roboto-Bold.woff", "/fonts/Roboto-Bold.woff2", "/fonts/Roboto-Medium.eot", "/fonts/Roboto-Medium.otf", "/fonts/Roboto-Medium.svg", "/fonts/Roboto-Medium.ttf", "/fonts/Roboto-Medium.woff",
    "/fonts/Roboto-Medium.woff2", "/fonts/Roboto-Regular.eot", "/fonts/Roboto-Regular.otf", "/fonts/Roboto-Regular.svg", "/fonts/Roboto-Regular.ttf", "/fonts/Roboto-Regular.woff", "/fonts/Roboto-Regular.woff2", "/fonts/SourceSansPro-Regular.eot", "/fonts/SourceSansPro-Regular.otf", "/fonts/SourceSansPro-Regular.svg", "/fonts/SourceSansPro-Regular.ttf", "/fonts/SourceSansPro-Regular.woff", "/fonts/SourceSansPro-Regular.woff2",
    "/fonts/fonts.min.css"
];
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        }).catch(console.error)
    );
});
self.addEventListener('activate', function(event) {
    var cacheWhitelist = ['app-science'];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(CacheName) {
                    if (cacheWhitelist.indexOf(CacheName) === -1) {
                        return caches.delete(CacheName);
                    }
                })
            );
        })
    );
});
self.addEventListener('fetch', function(evt) {
    console.log('The service worker is serving the asset.');

    // You can use respondWith() to answer ASAP…
    evt.respondWith(fromCache(evt.request));

    // …and waitUntil() to prevent the worker to be killed until the cache is updated.
    evt.waitUntil(
        update(evt.request)

            // Finally, send a message to the client to inform it about the resource is up to date.
            .then(refresh)
    );
});

// Open the cache where the assets were stored and search for the requested resource. Notice that in case of no matching, the promise still resolves but it does with undefined as value.
function fromCache(request) {
    return caches.open(CACHE).then(function(cache) {
        return cache.match(request);
    });
}

// Update consists in opening the cache, performing a network request and storing the new response data.
function update(request) {
    return caches.open(CACHE).then(function(cache) {
        return fetch(request).then(function(response) {
            return cache.put(request, response.clone()).then(function() {
                return response;
            });
        });
    });
}

// Sends a message to the clients.
function refresh(response) {
    return self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
            // Encode which resource has been updated. By including the ETag the client can check if the content has changed.
            var message = {
                type: 'refresh',
                url: response.url,
                // Notice not all servers return the ETag header. If this is not provided you should use other cache headers or rely on your own means to check if the content has changed.
                eTag: response.headers.get('ETag')
            };

            // Tell the client about the update.
            client.postMessage(JSON.stringify(message));
        });
    });
}