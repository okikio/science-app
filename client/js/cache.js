var navigator = window.navigator;
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registries) {
        if (registries.length == 0) {
            navigator.serviceWorker.register('/js/sw.min.js')
                .then(function(registry) {
                    // Registration was successful
                    console.log('[Service Worker] registration successful with scope: ', registry.scope);
                    if (registry.installing) {
                        console.log('[Service Worker] installing');
                    }
                    else if (registry.waiting) {
                        console.log('[Service Worker] installed');
                    }
                    else if (registry.active) {
                        console.log('[Service Worker] active');
                    }
                })
                .catch(function(err) {
                    // Registration failed :(
                    console.error('[Service Worker] registration failed: ', err);
                });
        }
    });
}
else if ('applicationCache' in window) {
    var appCache = window.applicationCache,
        status;
    appCache.update(); // Attempt to update the user's cache.
    status = (function() {
        switch (appCache.status) {
            case appCache.UNCACHED: // UNCACHED == 0
                return 'UNCACHED';
                break;
            case appCache.IDLE: // IDLE == 1
                return 'IDLE';
                break;
            case appCache.CHECKING: // CHECKING == 2
                return 'CHECKING';
                break;
            case appCache.DOWNLOADING: // DOWNLOADING == 3
                return 'DOWNLOADING';
                break;
            case appCache.UPDATEREADY: // UPDATEREADY == 4
                appCache.swapCache(); // The fetch was successful, swap in the new cache.
                return 'UPDATEREADY';
                break;
            case appCache.OBSOLETE: // OBSOLETE == 5
                return 'OBSOLETE';
                break;
            default:
                return 'UKNOWN CACHE STATUS';
                break;
        }
    })();

    // Check if a new cache is available on page load.
    window.addEventListener("load", function() {
        window.applicationCache.addEventListener('updateready', function(e) {
            if (status == 'UPDATEREADY') {
                // Browser downloaded a new app cache.
                window.applicationCache.swapCache();
                if (confirm('A new version of this site is available. Load it?')) {
                    window.location.reload();
                }
            }
            else { // Manifest didn't changed. Nothing new to server.
                console.log("No Cache Change.")
            }
        }, false);
    }, false);
}
else {
    console.log("No Service Worker's or App Cache Support")
}