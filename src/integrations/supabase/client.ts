// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://usaeidycxaqfwgjdiksz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzYWVpZHljeGFxZndnamRpa3N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MTg4OTcsImV4cCI6MjA2Nzk5NDg5N30.ooNxlf-Nkb2nQZuK_XEEA_rQz13l5JS2AtT32u2ULCc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});