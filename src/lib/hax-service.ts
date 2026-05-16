/**
 * HaxService handles the generation and management of injection scripts
 * for bypassing paywalls and unlocking features on target platforms.
 */

export const HAX_SCRIPTS = {
  sniffies: `
    // Hide premium overlays and upgrade prompts
    const style = document.createElement('style');
    style.innerHTML = \`
      .premium-only, .upgrade-prompt, [class*="Paywall"], [class*="Subscription"] {
        display: none !important;
      }
      .map-blur { filter: none !important; }
    \`;
    document.head.appendChild(style);

    // Attempt to set premium flags in local storage or global state
    try {
      localStorage.setItem('sniffies_premium', 'true');
      if (window.sniffies) window.sniffies.isPremium = true;
    } catch (e) {}
  `,
  grindr: `
    const style = document.createElement('style');
    style.innerHTML = \`
      .grindr-cascade-premium-banner, .upsell-container {
        display: none !important;
      }
    \`;
    document.head.appendChild(style);
  `,
  nkp: `
    const style = document.createElement('style');
    style.innerHTML = \`
      #premium-modal, .paywall-barrier {
        display: none !important;
      }
    \`;
    document.head.appendChild(style);
  `,
  barebackrt: `
    const style = document.createElement('style');
    style.innerHTML = \`
      .vip-only-content { display: block !important; }
      .vip-blur { filter: none !important; }
    \`;
    document.head.appendChild(style);
  `
};

/**
 * For Capacitor, we use the Browser.executeScript method or
 * webview.evaluateJavaScript on Android/iOS.
 */
export const injectHax = (platform: keyof typeof HAX_SCRIPTS) => {
  const script = HAX_SCRIPTS[platform];
  console.log(\`[HAX4LIFE] Injecting hax for \${platform}...\`);

  // In a real WebView environment, this would be:
  // Capacitor.Plugins.Browser.executeScript({ code: script });

  return script;
};
