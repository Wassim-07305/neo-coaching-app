const CACHE_NAME = "neo-coaching-v2";

const PRECACHE_URLS = ["/offline", "/manifest.json", "/icons/icon-192x192.svg", "/icons/icon-512x512.svg"];

const STATIC_CACHE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

// Install: precache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Message listener for skipWaiting
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Fetch handler with different strategies per route
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip chrome-extension and other non-http(s) schemes
  if (!url.protocol.startsWith("http")) return;

  // Network-only for API and auth routes
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/auth")) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache-first for static assets
  if (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot|css|js)$/)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network-first for pages/navigation, fallback to /offline
  event.respondWith(networkFirstWithOfflineFallback(request));
});

// Cache-first strategy with 30-day expiry
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    // Check expiry via custom header
    const dateHeader = cached.headers.get("sw-cache-date");
    if (dateHeader) {
      const cacheDate = new Date(dateHeader).getTime();
      if (Date.now() - cacheDate > STATIC_CACHE_MAX_AGE) {
        // Cache expired, fetch fresh copy
        return fetchAndCache(request);
      }
    }
    return cached;
  }
  return fetchAndCache(request);
}

// Network-first with offline fallback
async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    // Cache successful page responses
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Try cache
    const cached = await caches.match(request);
    if (cached) return cached;

    // For navigation requests, show offline page
    if (request.mode === "navigate") {
      const offlinePage = await caches.match("/offline");
      if (offlinePage) return offlinePage;
    }

    return new Response("Offline", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Fetch, tag with cache date, and store
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const clonedHeaders = new Headers(response.headers);
      clonedHeaders.set("sw-cache-date", new Date().toISOString());
      const taggedResponse = new Response(await response.clone().blob(), {
        status: response.status,
        statusText: response.statusText,
        headers: clonedHeaders,
      });
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, taggedResponse);
    }
    return response;
  } catch {
    // If fetch fails, try cache as last resort
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Offline", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}
