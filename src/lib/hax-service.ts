/**
 * HaxService (Phase 3)
 * Handles advanced script injections for bypassing premium gates and unblurring media.
 */

export const HAX_SCRIPTS = {
  sniffies: `
    // Auto-Unblur Profile Photos
    const unblurProfiles = () => {
      document.querySelectorAll('img[class*="blur"], .blurred-media, [style*="filter: blur"]').forEach(img => {
        img.style.filter = 'none';
        img.style.webkitFilter = 'none';
        // Attempt to swap high-res source if stored in data attributes
        const highRes = img.getAttribute('data-src') || img.getAttribute('data-original');
        if (highRes) img.src = highRes;
      });
    };

    // Remove Premium Overlays & Gated UI
    const removeGates = () => {
      const selectors = [
        '.premium-only', '.upgrade-prompt', '[class*="Paywall"]',
        '[class*="Subscription"]', '.modal-backdrop', '#premium-modal'
      ];
      selectors.forEach(s => {
        document.querySelectorAll(s).forEach(el => el.remove());
      });
      document.body.style.overflow = 'auto'; // Re-enable scroll if locked by modal
    };

    // Continuous Monitoring
    const observer = new MutationObserver(() => {
      unblurProfiles();
      removeGates();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial Run
    unblurProfiles();
    removeGates();
    console.log('[HAX4LIFE] Sniffies Engine Injected');
  `,
  grindr: `
    // Unlock Cascade Filters & View More
    const unlockFilters = () => {
      // Mocking premium status in global state
      if (window.grindr) {
        window.grindr.isPremium = true;
        window.grindr.hasXtra = true;
      }
    };

    const removeAds = () => {
      document.querySelectorAll('.ad-container, .native-ad').forEach(el => el.remove());
    };

    setInterval(() => {
      unlockFilters();
      removeAds();
    }, 2000);
    console.log('[HAX4LIFE] Grindr Engine Injected');
  `,
  nkp: `
    const bypassPaywall = () => {
      document.querySelectorAll('.paywall-barrier, .blur-content').forEach(el => {
        el.classList.remove('blur-content');
        if (el.style) el.style.filter = 'none';
      });
    };
    setInterval(bypassPaywall, 1000);
    console.log('[HAX4LIFE] NKP Engine Injected');
  `,
  barebackrt: `
    const revealVIP = () => {
      document.querySelectorAll('.vip-only').forEach(el => {
        el.style.display = 'block';
        el.style.filter = 'none';
      });
    };
    setInterval(revealVIP, 1500);
    console.log('[HAX4LIFE] BRT Engine Injected');
  `
};

/**
 * For Capacitor, we use the Browser.executeScript method or
 * webview.evaluateJavaScript on Android/iOS.
 */
export const injectHax = (platform: keyof typeof HAX_SCRIPTS) => {
  const script = HAX_SCRIPTS[platform];
  if (!script) return '';

  console.log(`[HAX4LIFE] Executing Phase 3 injection for ${platform}...`);
  return script;
};
