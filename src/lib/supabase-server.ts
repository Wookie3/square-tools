import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client with service role key (bypasses RLS)
// This file should only be imported in server functions

const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceRoleKey) {
  console.error('[supabase-server] Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
