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