/**
 * Barcode product lookup.
 *
 * Tries Open Beauty Facts first (personal care / cosmetics / home cleaning),
 * then falls back to Open Food Facts (general consumer products).
 * Both are free, open-source databases — no API key required.
 */

const BEAUTY_API = 'https://world.openbeautyfacts.org/api/v2/product'
const FOOD_API   = 'https://world.openfoodfacts.org/api/v2/product'

async function fetchFromApi(baseUrl, barcode) {
  const res = await fetch(`${baseUrl}/${barcode}.json?fields=product_name,brands,categories_tags,image_url,ingredients_text,nutriscore_grade`)
  if (!res.ok) return null
  const json = await res.json()
  if (json.status !== 1 || !json.product) return null
  return json.product
}

function normalizeProduct(raw, barcode) {
  const name  = raw.product_name?.trim()
  const brand = raw.brands?.split(',')[0]?.trim()
  if (!name) return null
  return {
    barcode,
    name,
    brand:       brand || null,
    description: raw.ingredients_text?.trim() || null,
    image_url:   raw.image_url || null,
    // Map to our safety_score schema — unknown until Claude analyses ingredients
    safety_score: null,
    score:        null,
    category:     null,
  }
}

export async function lookupBarcode(barcode) {
  // Try personal care / home products first
  const beauty = await fetchFromApi(BEAUTY_API, barcode).catch(() => null)
  if (beauty) {
    const product = normalizeProduct(beauty, barcode)
    if (product) return product
  }

  // Fallback: general consumer / food products
  const food = await fetchFromApi(FOOD_API, barcode).catch(() => null)
  if (food) {
    const product = normalizeProduct(food, barcode)
    if (product) return product
  }

  return null
}
