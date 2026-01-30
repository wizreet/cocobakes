/**
 * Service Worker for CocoBakes PWA
 * Provides offline support, caching strategies, and performance optimization
 *
 * Caching Strategies:
 * - Cache First: Static assets (CSS, JS, images)
 * - Network First: API calls and dynamic content
 * - Stale While Revalidate: Non-critical resources
 *
 * @version 1.0.0
 */

// ============================================================================
// Configuration
// ============================================================================

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `cocobakes-${CACHE_VERSION}`;

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/cocobakes/',
  '/cocobakes/menu',
  '/cocobakes/craft',
  '/cocobakes/gallery',
];

// ============================================================================
// Install Event
// ============================================================================

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      }),
  );
});

// ============================================================================
// Activate Event
// ============================================================================

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              return caches.delete(name);
            }),
        );
      })
      .then(() => {
        return self.clients.claim();
      }),
  );
});

// ============================================================================
// Fetch Event - Caching Strategies
// ============================================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (except for CDN assets)
  if (!url.origin.includes(self.location.origin)) {
    // Allow CDN requests for fonts, icons
    if (
      !url.href.includes('fonts.googleapis.com') &&
      !url.href.includes('fonts.gstatic.com') &&
      !url.href.includes('api.iconify.design')
    ) {
      return;
    }
  }

  // Determine caching strategy based on request type
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
  } else if (isImageRequest(url)) {
    event.respondWith(cacheFirst(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

// ============================================================================
// Caching Strategy: Cache First
// ============================================================================

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    // Return offline fallback if available
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
}

// ============================================================================
// Caching Strategy: Network First
// ============================================================================

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline page fallback
    return caches.match('/cocobakes/') || new Response('Offline');
  }
}

// ============================================================================
// Caching Strategy: Stale While Revalidate
// ============================================================================

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// ============================================================================
// Helper Functions
// ============================================================================

function isStaticAsset(url) {
  return (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2')
  );
}

function isImageRequest(url) {
  return (
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.avif')
  );
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// ============================================================================
// Background Sync (for offline form submissions)
// ============================================================================

self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForm());
  }
});

async function syncContactForm() {
  // Background sync implementation
}

// ============================================================================
// Push Notifications (future feature)
// ============================================================================

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};

  const title = data.title || 'CocoBakes';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/cocobakes/favicon.ico',
    badge: '/cocobakes/favicon.ico',
    tag: data.tag || 'notification',
    data: data.url || '/cocobakes/',
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data || '/cocobakes/';
  event.waitUntil(self.clients.openWindow(url));
});
