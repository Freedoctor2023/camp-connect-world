import { useState, useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface PushNotificationState {
  isSupported: boolean;
  isPermissionGranted: boolean;
  token: string | null;
  isRegistered: boolean;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isPermissionGranted: false,
    token: null,
    isRegistered: false,
  });
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const initializePushNotifications = async () => {
      // Check if push notifications are supported
      if (!Capacitor.isNativePlatform()) {
        console.log('Push notifications are only supported on native platforms');
        return;
      }

      setState(prev => ({ ...prev, isSupported: true }));

      // Request permission
      const permissionResult = await PushNotifications.requestPermissions();
      
      if (permissionResult.receive === 'granted') {
        setState(prev => ({ ...prev, isPermissionGranted: true }));
        
        // Register for push notifications
        await PushNotifications.register();
      } else {
        console.log('Push notification permission denied');
        toast({
          title: "Permission Required",
          description: "Push notifications require permission to work properly.",
          variant: "destructive"
        });
      }
    };

    initializePushNotifications();
  }, [toast]);

  useEffect(() => {
    // Set up push notification listeners
    const setupListeners = () => {
      // Successfully registered
      PushNotifications.addListener('registration', async (token) => {
        console.log('Push notification registration successful:', token.value);
        setState(prev => ({ ...prev, token: token.value, isRegistered: true }));
        
        // Store token in database if user is authenticated
        if (user && token.value) {
          await storeDeviceToken(token.value);
        }
      });

      // Registration failed
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Push notification registration error:', error);
        toast({
          title: "Registration Error",
          description: "Failed to register for push notifications.",
          variant: "destructive"
        });
      });

      // Notification received
      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
        toast({
          title: notification.title || "New Notification",
          description: notification.body || "You have a new notification",
        });
      });

      // Notification tapped
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification);
        // Handle navigation or other actions when notification is tapped
      });
    };

    if (state.isSupported) {
      setupListeners();
    }

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [state.isSupported, user, toast]);

  const storeDeviceToken = async (token: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('device_tokens')
        .upsert({
          user_id: user.id,
          token: token,
          platform: Capacitor.getPlatform(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,token'
        });

      if (error) {
        console.error('Error storing device token:', error);
      } else {
        console.log('Device token stored successfully');
      }
    } catch (error) {
      console.error('Error storing device token:', error);
    }
  };

  const sendTestNotification = async () => {
    if (!user || !state.token) {
      toast({
        title: "Error",
        description: "User not authenticated or device token not available",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          user_id: user.id,
          title: 'Test Notification',
          body: 'This is a test push notification from Freedoctor.World',
          data: {
            type: 'test',
            timestamp: new Date().toISOString()
          }
        }
      });

      if (error) {
        console.error('Error sending test notification:', error);
        toast({
          title: "Error",
          description: "Failed to send test notification",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Test notification sent successfully"
        });
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: "Error",
        description: "Failed to send test notification",
        variant: "destructive"
      });
    }
  };

  return {
    ...state,
    sendTestNotification,
    storeDeviceToken: () => state.token ? storeDeviceToken(state.token) : Promise.resolve(),
  };
};