import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_TRACKING_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.TRACKING_SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceRoleKey) {
  console.error('[tracking-supabase-server] Missing TRACKING_SUPABASE_SERVICE_ROLE_KEY environment variable')
}

export const trackingSupabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
