import { supabase } from '../supabase'

/**
 * Fetch all product IDs the current user has saved.
 * Returns an array of product_id strings.
 */
export async function fetchSavedProductIds() {
  // Ensure the session is active before running an RLS-protected query.
  // On a fresh page load, the client may not have restored the session yet,
  // causing auth.uid() to return null and the policy to silently return 0 rows.
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []

  const { data, error } = await supabase
    .from('saved_products')
    .select('product_id')

  if (error) {
    console.error('fetchSavedProductIds error:', error)
    throw error
  }

  return data.map((row) => row.product_id)
}

/**
 * Save a product for the current user.
 */
export async function saveProduct(productId) {
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('saved_products')
    .insert({ user_id: user.id, product_id: productId })

  if (error) {
    console.error('saveProduct error:', error)
    throw error
  }
}

/**
 * Remove a saved product for the current user.
 */
export async function unsaveProduct(productId) {
  const { error } = await supabase
    .from('saved_products')
    .delete()
    .eq('product_id', productId)

  if (error) {
    console.error('unsaveProduct error:', error)
    throw error
  }
}
