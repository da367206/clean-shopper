import { supabase } from '../supabase'

export async function fetchFeaturedProducts(limit = 3) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('safety_score', 'clean')
    .order('score', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

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

export async function fetchProductById(id) {
  // Support both full UUIDs and the 8-char prefix used in the chat system prompt
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('id', `${id}%`)
    .limit(1)
    .single()
  if (error) throw error
  return data
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
