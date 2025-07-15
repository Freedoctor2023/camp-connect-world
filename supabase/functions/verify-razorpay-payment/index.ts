import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to verify Razorpay signature
async function verifySignature(orderId: string, paymentId: string, signature: string, secret: string): Promise<boolean> {
  const text = `${orderId}|${paymentId}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const key = encoder.encode(secret);
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, data);
  const computedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return computedSignature === signature;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error("Missing payment verification data");
    }

    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!razorpayKeySecret) {
      throw new Error("Razorpay key secret not configured");
    }

    // Verify signature
    const isValidSignature = await verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpayKeySecret
    );

    if (!isValidSignature) {
      throw new Error("Invalid payment signature");
    }

    // Update payment session status
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: paymentSession } = await supabaseService
      .from("payment_sessions")
      .select("*")
      .eq("stripe_session_id", razorpay_order_id) // Using stripe_session_id field for Razorpay order ID
      .single();

    if (!paymentSession) {
      throw new Error("Payment session not found");
    }

    // Update payment session status to completed
    const { error: updateError } = await supabaseService
      .from("payment_sessions")
      .update({ status: "completed" })
      .eq("stripe_session_id", razorpay_order_id);

    if (updateError) {
      throw new Error("Failed to update payment status");
    }

    // Create sponsorship record
    const { error: sponsorshipError } = await supabaseService.from("sponsorships").insert({
      camp_id: paymentSession.camp_id,
      sponsor_name: paymentSession.sponsor_name,
      sponsor_email: paymentSession.sponsor_email,
      amount: paymentSession.amount,
      message: "Payment via Razorpay",
    });

    if (sponsorshipError) {
      console.error("Error creating sponsorship:", sponsorshipError);
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: "Payment verified and sponsorship created successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});