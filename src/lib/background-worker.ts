/**
 * Heartbeat Service for Hax4Life
 * Handles session heartbeats to keep user "online" while the app is active.
 * For full background persistence on Android, native Background Service implementation is required.
 */

export const startHeartbeat = (platform: string, intervalSeconds: number) => {
  console.log(`[HAX4LIFE] Starting heartbeat for ${platform} every ${intervalSeconds}s`);

  const timer = setInterval(() => {
    console.log(`[HAX4LIFE] Sending heartbeat to ${platform}...`);
    // Example: fetch(`${platform_url}/api/heartbeat`, { method: 'POST' });
  }, intervalSeconds * 1000);

  return () => {
    console.log(`[HAX4LIFE] Stopping heartbeat for ${platform}`);
    clearInterval(timer);
  };
};
