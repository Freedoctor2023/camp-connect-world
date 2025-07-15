import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushNotificationPayload {
  user_id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  target_tokens?: string[];
}

interface DeviceToken {
  token: string;
  platform: string;
  user_id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { user_id, title, body, data, target_tokens }: PushNotificationPayload = await req.json();

    console.log('Sending push notification:', { user_id, title, body, data });

    let deviceTokens: DeviceToken[] = [];

    if (target_tokens && target_tokens.length > 0) {
      // Use provided tokens
      deviceTokens = target_tokens.map(token => ({
        token,
        platform: 'unknown',
        user_id: user_id
      }));
    } else {
      // Fetch device tokens from database
      const { data: tokens, error } = await supabaseClient
        .from('device_tokens')
        .select('token, platform, user_id')
        .eq('user_id', user_id);

      if (error) {
        console.error('Error fetching device tokens:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch device tokens' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      deviceTokens = tokens || [];
    }

    if (deviceTokens.length === 0) {
      console.log('No device tokens found for user:', user_id);
      return new Response(
        JSON.stringify({ message: 'No device tokens found for user' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send notifications to all device tokens
    const notificationPromises = deviceTokens.map(async (deviceToken) => {
      try {
        const payload = {
          to: deviceToken.token,
          title,
          body,
          data: data || {},
          sound: 'default',
          badge: 1,
        };

        // For now, we'll use Firebase Cloud Messaging (FCM) for Android
        // and Apple Push Notification Service (APNS) for iOS
        // You would need to implement the actual push notification service here
        
        console.log('Would send notification to:', deviceToken.token, 'Platform:', deviceToken.platform);
        
        // This is a placeholder - implement actual push notification sending
        // based on your chosen service (FCM, APNS, or a service like OneSignal)
        
        return { success: true, token: deviceToken.token };
      } catch (error) {
        console.error('Error sending notification to token:', deviceToken.token, error);
        return { success: false, token: deviceToken.token, error: error.message };
      }
    });

    const results = await Promise.allSettled(notificationPromises);
    
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failCount = results.length - successCount;

    console.log(`Notification sending complete: ${successCount} success, ${failCount} failed`);

    // Log the notification in the database
    const { error: logError } = await supabaseClient
      .from('push_notifications_log')
      .insert({
        user_id,
        title,
        body,
        data,
        sent_at: new Date().toISOString(),
        success_count: successCount,
        fail_count: failCount,
        device_tokens: deviceTokens.map(dt => dt.token)
      });

    if (logError) {
      console.error('Error logging notification:', logError);
    }

    return new Response(
      JSON.stringify({
        message: 'Push notification processing complete',
        total_tokens: deviceTokens.length,
        success_count: successCount,
        fail_count: failCount,
        results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: r.reason })
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in send-push-notification function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});