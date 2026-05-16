import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thunderconstellations.sniffieshax',
  appName: 'Sniffies Hax4Life',
  webDir: 'dist',
  server: {
    url: 'https://d17a570d-d172-4b19-8eee-010d21329c5b.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  plugins: {
    BackgroundRunner: {
      label: 'com.thunderconstellations.sniffieshax.background',
      src: 'src/lib/background-worker.ts',
      event: 'checkSession',
      repeat: true,
      interval: 15,
      autoStart: true,
    },
  },
};

export default config;
