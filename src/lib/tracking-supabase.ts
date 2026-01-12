import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_TRACKING_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_TRACKING_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Tracking Supabase environment variables');
}

export const trackingSupabase = createClient(supabaseUrl || '', supabaseKey || '');
