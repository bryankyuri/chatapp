if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('SW registered: ', registration);
        
        registration.addEventListener('push', (event) => {
          const options = {
            body: event.data.text(),
            icon: '/vite.svg',
            badge: '/vite.svg'
          };
        
          event.waitUntil(
            registration.showNotification('New Message', options)
          );
        });

        registration.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'SKIP_WAITING') {
            registration.skipWaiting();
          }
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}