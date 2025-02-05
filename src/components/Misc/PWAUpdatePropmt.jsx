import { useState, useEffect } from 'react';

export default function PWAUpdatePrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Handle service worker updates
      const handleServiceWorkerUpdate = (reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setNeedRefresh(true);
              setRegistration(reg);
            }
          });
        });
      };

      // Check for existing service worker
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          handleServiceWorkerUpdate(reg);
        }
      });

      // Listen for new service workers
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          handleServiceWorkerUpdate(reg);
        });
      });
    }
  }, []);

  const updateApp = () => {
    if (!registration?.waiting) return;
    // Send message to service worker to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    setNeedRefresh(false);
    // Refresh all tabs/windows after update
    window.location.reload();
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            New Update Available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            A new version is available. Click update to refresh the app.
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex gap-2">
          <button
            onClick={() => setNeedRefresh(false)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Later
          </button>
          <button
            onClick={updateApp}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}