// serviceworker.js
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/vite.svg',
    badge: '/vite.svg'
  };

  event.waitUntil(
    self.registration.showNotification('New Message', options)
  );
});

// Add update functionality
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});