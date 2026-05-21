/**
 * HaxService (Phase 6)
 * Handles advanced extraction and injection for real-time site integration.
 */

export const HAX_SCRIPTS = {
  sniffies: `
    // Sniffies Extraction Engine
    const extractData = () => {
      const data = {
        profiles: [],
        messages: [],
        activeUser: null
      };

      // 1. Intercept Profile Data from DOM
      document.querySelectorAll('[class*="ProfileCard"], [class*="UserCard"]').forEach(card => {
        const name = card.querySelector('[class*="Name"]')?.textContent;
        const distance = card.querySelector('[class*="Distance"]')?.textContent;
        const status = card.querySelector('[class*="Status"]')?.textContent;
        const stats = card.querySelector('[class*="Stats"]')?.textContent; // e.g. "28 • Athletic • Top"

        if (name) {
          data.profiles.push({
            id: name.toLowerCase().replace(/\s/g, '_'),
            userName: name,
            distance: distance || 'Unknown',
            lastSeen: status || 'Recently',
            statsRaw: stats
          });
        }
      });

      // 2. Intercept API Traffic (Fetch override)
      if (!window._hax_intercepted) {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
          const response = await originalFetch(...args);
          const clone = response.clone();
          try {
            const json = await clone.json();
            if (args[0].includes('/api/profiles') || args[0].includes('/api/chat')) {
              window.postMessage({ type: 'SNIFFIES_API_DATA', data: json }, '*');
            }
          } catch (e) {}
          return response;
        };
        window._hax_intercepted = true;
      }

      // 3. Communicate back to Hax App
      if (data.profiles.length > 0) {
        window.postMessage({ type: 'SNIFFIES_DOM_DATA', data }, '*');
      }
    };

    // Auto-Unblur Logic (Phase 3 legacy)
    const unblurProfiles = () => {
      document.querySelectorAll('img[class*="blur"], .blurred-media, [style*="filter: blur"]').forEach(img => {
        img.style.filter = 'none';
        img.style.webkitFilter = 'none';
        const highRes = img.getAttribute('data-src') || img.getAttribute('data-original');
        if (highRes) img.src = highRes;
      });
    };

    // Run Engine
    setInterval(() => {
      extractData();
      unblurProfiles();
    }, 5000);

    console.log('[HAX4LIFE] Sniffies Extraction Engine Active');
  `,
  grindr: `
    const extractGrindr = () => {
       // Similar extraction logic for Grindr Web
    };
    setInterval(extractGrindr, 5000);
    console.log('[HAX4LIFE] Grindr Engine Active');
  `,
  nkp: `
    console.log('[HAX4LIFE] NKP Engine Injected');
  `,
  barebackrt: `
    console.log('[HAX4LIFE] BRT Engine Injected');
  `
};

export const injectHax = (platform: keyof typeof HAX_SCRIPTS) => {
  const script = HAX_SCRIPTS[platform];
  if (!script) return '';
  return script;
};
