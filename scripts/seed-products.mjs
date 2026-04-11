/**
 * seed-products.mjs
 *
 * Fetches real product data from the Open Beauty Facts API and upserts it
 * into the Supabase `products` table.
 *
 * Usage (from project root):
 *   node scripts/seed-products.mjs
 *
 * Requires: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env or .env.local
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const __dir = dirname(fileURLToPath(import.meta.url))

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    try {
      const raw = readFileSync(resolve(__dir, '..', file), 'utf8')
      for (const line of raw.split('\n')) {
        const [key, ...rest] = line.split('=')
        if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
      }
      console.log(`Loaded env from ${file}`)
      return
    } catch { /* try next */ }
  }
  throw new Error('No .env or .env.local found')
}

loadEnv()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
)

// ---------------------------------------------------------------------------
// Category config
// Maps our app category names → Open Beauty Facts search terms
// ---------------------------------------------------------------------------

const CATEGORY_QUERIES = [
  { appCategory: 'Personal Care',  searchTerms: ['shampoo', 'conditioner', 'body lotion', 'face wash', 'deodorant'] },
  { appCategory: 'Baby Care',      searchTerms: ['baby shampoo', 'baby lotion', 'baby wash', 'diaper cream'] },
  { appCategory: 'Home Cleaning',  searchTerms: ['dish soap', 'laundry detergent', 'surface cleaner', 'all purpose cleaner'] },
  { appCategory: 'Kitchen',        searchTerms: ['dish detergent', 'kitchen cleaner', 'hand soap kitchen', 'fruit wash'] },
]

const PRODUCTS_PER_TERM = 5   // how many products to fetch per search term
const OBF_BASE = 'https://world.openbeautyfacts.org/cgi/search.pl'

// ---------------------------------------------------------------------------
// Ingredient-based safety scoring
// Open Beauty Facts exposes `ingredients_analysis_tags` and ingredient counts
// ---------------------------------------------------------------------------

const CONCERNING_INGREDIENTS = [
  'sodium lauryl sulfate', 'sls', 'parabens', 'paraben',
  'formaldehyde', 'phthalate', 'triclosan', 'oxybenzone',
  'fragrance', 'parfum', 'methylisothiazolinone', 'bha', 'bht',
  'petrolatum', 'mineral oil', 'talc', 'aluminum', 'lead',
]

const AVOID_INGREDIENTS = [
  'formaldehyde', 'mercury', 'lead', 'arsenic', 'asbestos',
  'dibutyl phthalate', 'diethyl phthalate',
]

function scoreProduct(product) {
  const ingredients = (product.ingredients_text ?? '').toLowerCase()
  const analysisFlags = product.ingredients_analysis_tags ?? []

  // Count concerning hits
  const avoidHits = AVOID_INGREDIENTS.filter(i => ingredients.includes(i)).length
  const cautionHits = CONCERNING_INGREDIENTS.filter(i => ingredients.includes(i)).length

  // Base score: start at 80, penalise per concerning ingredient
  let score = 80 - (avoidHits * 25) - (cautionHits * 8)

  // Bonus for clean signals from OBF analysis tags
  if (analysisFlags.includes('en:palm-oil-free')) score += 5
  if (analysisFlags.includes('en:vegan')) score += 5

  // Penalise missing ingredient data (can't verify → lower confidence)
  if (!ingredients) score = 45

  score = Math.max(0, Math.min(100, Math.round(score)))

  const safetyScore =
    avoidHits > 0 || score < 35 ? 'avoid' :
    cautionHits > 0 || score < 65 ? 'caution' :
    'clean'

  return { score, safetyScore }
}

function buildDescription(product) {
  const name = product.product_name ?? ''
  const brand = product.brands ?? ''
  const generic = product.generic_name ?? ''
  const quantity = product.quantity ?? ''

  if (generic) return generic.slice(0, 160)
  if (brand && quantity) return `${brand} · ${quantity}`
  if (brand) return `Made by ${brand}.`
  return `${name} personal care product.`
}

// ---------------------------------------------------------------------------
// Fetch from Open Beauty Facts
// ---------------------------------------------------------------------------

async function fetchProducts(searchTerm, pageSize = PRODUCTS_PER_TERM) {
  const url = new URL(OBF_BASE)
  url.searchParams.set('search_terms', searchTerm)
  url.searchParams.set('search_simple', '1')
  url.searchParams.set('action', 'process')
  url.searchParams.set('json', '1')
  url.searchParams.set('page_size', String(pageSize))
  url.searchParams.set('fields', [
    'id', 'product_name', 'brands', 'generic_name', 'quantity',
    'ingredients_text', 'ingredients_analysis_tags',
    'categories_tags', 'image_url', 'image_front_url', 'image_front_small_url', 'image_small_url',
  ].join(','))

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'CleanShopper/1.0 (ingredient-aware product research)' },
  })

  if (!res.ok) throw new Error(`OBF API error ${res.status} for "${searchTerm}"`)
  const json = await res.json()
  return json.products ?? []
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  let totalInserted = 0
  let totalSkipped = 0
  const seen = new Set()   // global across all categories to prevent duplicate names

  for (const { appCategory, searchTerms } of CATEGORY_QUERIES) {
    console.log(`\n── ${appCategory} ──`)
    const rows = []

    for (const term of searchTerms) {
      let raw
      try {
        raw = await fetchProducts(term)
      } catch (err) {
        console.warn(`  ⚠ Skipping "${term}": ${err.message}`)
        continue
      }

      for (const product of raw) {
        const name = (product.product_name ?? '').trim()
        if (!name || seen.has(name.toLowerCase())) continue
        seen.add(name.toLowerCase())

        const { score, safetyScore } = scoreProduct(product)
        const description = buildDescription(product)

        rows.push({
          name,
          brand: (product.brands ?? '').split(',')[0].trim() || 'Unknown',
          category: appCategory,
          description,
          score,
          safety_score: safetyScore,
          image_url: product.image_front_small_url || product.image_small_url || product.image_front_url || product.image_url || null,
        })
      }

      // Small delay to be polite to the API
      await new Promise(r => setTimeout(r, 300))
    }

    if (rows.length === 0) {
      console.log('  No products found')
      continue
    }

    console.log(`  Upserting ${rows.length} products…`)

    const { error, count } = await supabase
      .from('products')
      .insert(rows, { count: 'exact' })

    if (error) {
      console.error(`  ✗ Supabase error:`, error.message)
    } else {
      console.log(`  ✓ ${count ?? rows.length} rows upserted`)
      totalInserted += rows.length
    }
  }

  console.log(`\nDone. ${totalInserted} products upserted, ${totalSkipped} skipped.`)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
