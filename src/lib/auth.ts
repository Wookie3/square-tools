import { supabaseAdmin as supabase } from './supabase-server'

export interface UserProfile {
  id: string
  email: string
  role?: string
  email_confirmed_at?: string | null
}

export async function validateSession(sessionToken?: string): Promise<UserProfile | null> {
  try {
    if (!sessionToken) return null

    const { data: { user }, error } = await supabase.auth.getUser(sessionToken)

    if (error || !user) return null

    return {
      id: user.id,
      email: user.email || '',
      email_confirmed_at: user.email_confirmed_at
    }
  } catch (e) {
    console.error('Session validation error:', e)
    return null
  }
}

export async function requireEmailVerified(sessionToken: string): Promise<UserProfile | null> {
  const userProfile = await validateSession(sessionToken)

  if (!userProfile) return null

  if (!userProfile.email_confirmed_at) {
    return null
  }

  return userProfile
}
