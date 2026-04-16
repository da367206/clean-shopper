import { supabase } from '../supabase'

export async function fetchProductsByCategory(category) {
  let query = supabase.from('products').select('*').order('score', { ascending: false })
  if (category !== 'All') query = query.eq('category', category)
  const { data, error } = await query
  if (error) {
    console.error('fetchProductsByCategory error:', error)
    throw error
  }
  return data ?? []
}

export async function searchProducts(term) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${term}%,brand.ilike.%${term}%,description.ilike.%${term}%`)
    .order('score', { ascending: false })
  if (error) throw error
  return data ?? []
}
