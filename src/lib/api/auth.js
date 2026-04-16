import { supabase } from '../supabase'

/**
 * Sign up a new user with email and password.
 * Returns { data, error } from Supabase.
 */
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { data, error }
}

/**
 * Sign in an existing user with email and password.
 * Returns { data, error } from Supabase.
 */
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

/**
 * Sign out the current user.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}
