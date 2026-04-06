import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d17a570dd1724b198eee010d21329c5b',
  appName: 'Smart Calculator',
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
};

export default config;
