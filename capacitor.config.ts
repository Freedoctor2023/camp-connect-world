import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.5ac98c2347204cc29b4d54ea92783919',
  appName: 'freedoctor',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://5ac98c23-4720-4cc2-9b4d-54ea92783919.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;