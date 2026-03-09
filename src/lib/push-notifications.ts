/**
 * Web Push Notifications utility module.
 * All functions are safe to call on the server (they return early when window is undefined).
 */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/**
 * Check whether the browser supports the Push API and service workers.
 */
export function isPushSupported(): boolean {
  if (!isBrowser()) return false;
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

/**
 * Return the current notification permission status.
 * Possible values: "default" | "granted" | "denied"
 */
export function getNotificationPermission(): NotificationPermission | null {
  if (!isBrowser() || !("Notification" in window)) return null;
  return Notification.permission;
}

/**
 * Request notification permission from the user.
 * Returns true if permission was granted, false otherwise.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isBrowser() || !("Notification" in window)) return false;

  try {
    const result = await Notification.requestPermission();
    return result === "granted";
  } catch {
    return false;
  }
}

/**
 * Subscribe to push notifications via the active service worker.
 * Returns the PushSubscription on success, or null on failure.
 */
export async function subscribeToPush(
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  if (!isBrowser() || !isPushSupported()) return null;

  try {
    const registration = await navigator.serviceWorker.ready;

    // Convert the VAPID public key from base64 URL-safe to a Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey).buffer as ArrayBuffer;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    return subscription;
  } catch {
    return null;
  }
}

/**
 * Unsubscribe from the current push subscription.
 * Returns true if successfully unsubscribed, false otherwise.
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isBrowser() || !isPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) return true;

    return await subscription.unsubscribe();
  } catch {
    return false;
  }
}

/**
 * Show a local notification (not via push) if permission is granted.
 */
export function sendLocalNotification(
  title: string,
  options?: NotificationOptions
): void {
  if (!isBrowser() || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    new Notification(title, options);
  } catch {
    // Some browsers (mobile) require showing notifications via service worker
    navigator.serviceWorker?.ready
      .then((registration) => {
        registration.showNotification(title, options);
      })
      .catch(() => {
        // Silently fail
      });
  }
}

/**
 * Convert a base64 URL-safe string to a Uint8Array (for VAPID keys).
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
