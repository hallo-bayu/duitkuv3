const CACHE = "domi-v1";
const STATIC = [
  "/",
  "/chat",
  "/login",
  "/manifest.json",
];

// Install — cache static assets
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — network first, fallback to cache
self.addEventListener("fetch", e => {
  // Skip API calls and Supabase — always need network
  if (e.request.url.includes("/api/") || e.request.url.includes("supabase")) return;
  // Skip non-GET
  if (e.request.method !== "GET") return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache fresh responses
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r ?? fetch(e.request)))
  );
});
