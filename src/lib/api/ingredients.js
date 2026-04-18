// Ingredient deep-dive data source.
//
// V1 contract (per /docs/feature-spec-ingredient-deep-dive.md):
//   Calls Claude via the shared /anthropic proxy using claude-sonnet-4-20250514
//   and returns { ingredients: [{ name, safetyScore, purpose, concerns }] }.
//
// For preview / development we return deterministic placeholder data so the UI
// can be exercised without spending API credits. Flip USE_MOCK to false once
// the live prompt is tuned.

const USE_MOCK = true
const MODEL = 'claude-sonnet-4-20250514'

const VALID_SCORES = new Set(['clean', 'caution', 'avoid'])
const DEFAULT_SOURCE = 'AI-generated (Claude) · grounded in EWG Skin Deep'

// ---------- Placeholder fixtures ----------

const MOCK_BY_CATEGORY = {
  'Personal Care': [
    { name: 'Water (Aqua)',                     safetyScore: 'clean',   purpose: 'Solvent that carries the other ingredients and makes the product spreadable.',                       concerns: 'No known safety concerns. Considered inert at standard cosmetic concentrations.' },
    { name: 'Glycerin',                         safetyScore: 'clean',   purpose: 'Plant-derived humectant that draws moisture into the skin.',                                        concerns: 'Very low hazard. Widely tolerated across skin types.' },
    { name: 'Sodium Lauroyl Glutamate',         safetyScore: 'clean',   purpose: 'Amino-acid derived surfactant that produces a mild, rinseable lather.',                             concerns: 'Considered one of the gentler surfactants on the EWG Skin Deep database.' },
    { name: 'Tocopherol (Vitamin E)',           safetyScore: 'clean',   purpose: 'Antioxidant that protects the formula and the skin barrier.',                                       concerns: 'Generally recognized as safe. Minor sensitization risk only at very high concentrations.' },
    { name: 'Citric Acid',                      safetyScore: 'caution', purpose: 'pH adjuster used in small amounts to keep the product skin-compatible.',                             concerns: 'Safe at the concentrations used in rinse-off products, but can irritate sensitive skin in leave-ons.' },
    { name: 'Phenoxyethanol',                   safetyScore: 'caution', purpose: 'Broad-spectrum preservative that keeps the product free of microbes.',                               concerns: 'EWG rates it a moderate hazard. Can cause irritation or contact allergy in sensitive users, especially at higher concentrations.' },
    { name: 'Fragrance (Parfum)',               safetyScore: 'avoid',   purpose: 'Proprietary scent blend added for sensory appeal.',                                                  concerns: '"Fragrance" can contain dozens of undisclosed compounds, including phthalates and synthetic musks linked to hormone disruption and allergies.' },
  ],
  'Home Cleaning': [
    { name: 'Water',                            safetyScore: 'clean',   purpose: 'Base solvent for the formula.',                                                                     concerns: 'No concerns.' },
    { name: 'Coco-Glucoside',                   safetyScore: 'clean',   purpose: 'Plant-derived surfactant that lifts grease and soil.',                                              concerns: 'Readily biodegradable. Low hazard rating on EWG.' },
    { name: 'Sodium Citrate',                   safetyScore: 'clean',   purpose: 'Water softener that helps surfactants work in hard water.',                                         concerns: 'Recognized as safe at cleaning-product concentrations.' },
    { name: 'Lactic Acid',                      safetyScore: 'caution', purpose: 'Mild acid that cuts mineral buildup and controls pH.',                                              concerns: 'Safe as formulated, but concentrated exposure can irritate skin and eyes — gloves recommended.' },
    { name: 'Methylisothiazolinone',            safetyScore: 'avoid',   purpose: 'Preservative that prevents bacterial growth in water-based formulas.',                              concerns: 'Well-documented skin sensitizer. Restricted in leave-on cosmetics in the EU; EWG flags it as a high-concern ingredient.' },
  ],
  'Baby Care': [
    { name: 'Water (Aqua)',                     safetyScore: 'clean',   purpose: 'Base solvent.',                                                                                      concerns: 'No concerns.' },
    { name: 'Coco-Betaine',                     safetyScore: 'clean',   purpose: 'Mild secondary surfactant that boosts lather without stripping the skin.',                          concerns: 'Low hazard at standard concentrations.' },
    { name: 'Panthenol (Provitamin B5)',        safetyScore: 'clean',   purpose: 'Humectant and skin-soother.',                                                                        concerns: 'Widely considered safe and non-irritating.' },
    { name: 'Sodium Benzoate',                  safetyScore: 'caution', purpose: 'Preservative.',                                                                                      concerns: 'Safe at standard concentrations. Can form low levels of benzene if combined with vitamin C at high heat.' },
    { name: 'Fragrance (Parfum)',               safetyScore: 'avoid',   purpose: 'Added scent.',                                                                                        concerns: 'Undisclosed mixture. Not recommended for infant products by many pediatric dermatologists.' },
  ],
  'Kitchen': [
    { name: 'Water',                            safetyScore: 'clean',   purpose: 'Base solvent.',                                                                                      concerns: 'No concerns.' },
    { name: 'Sodium Laureth Sulfate (SLES)',    safetyScore: 'caution', purpose: 'Primary surfactant producing a dense lather.',                                                       concerns: 'Can be contaminated with 1,4-dioxane during manufacturing unless the supplier certifies dioxane removal.' },
    { name: 'Lauryl Glucoside',                 safetyScore: 'clean',   purpose: 'Gentle plant-based co-surfactant.',                                                                  concerns: 'Low hazard; readily biodegradable.' },
    { name: 'Citric Acid',                      safetyScore: 'clean',   purpose: 'pH adjuster.',                                                                                       concerns: 'Safe at formula concentrations.' },
    { name: 'Methylchloroisothiazolinone',      safetyScore: 'avoid',   purpose: 'Preservative.',                                                                                      concerns: 'Strong skin sensitizer and a common cause of allergic contact dermatitis. Restricted in many regions.' },
  ],
}

const FALLBACK = MOCK_BY_CATEGORY['Personal Care']

function mockAnalysis(product) {
  const list = MOCK_BY_CATEGORY[product?.category] ?? FALLBACK
  // Empty-state preview: names containing "empty" return zero ingredients.
  if (typeof product?.name === 'string' && /empty/i.test(product.name)) {
    return { ingredients: [] }
  }
  return {
    ingredients: list.map((i) => ({ ...i, source: DEFAULT_SOURCE })),
  }
}

// ---------- Validation ----------

function validate(list) {
  if (!Array.isArray(list)) return []
  const cleaned = []
  for (const row of list) {
    if (!row || typeof row.name !== 'string' || !VALID_SCORES.has(row.safetyScore)) {
      console.warn('Dropping malformed ingredient row:', row)
      continue
    }
    cleaned.push({
      name: row.name,
      safetyScore: row.safetyScore,
      purpose: typeof row.purpose === 'string' ? row.purpose : '',
      concerns: typeof row.concerns === 'string' ? row.concerns : '',
      source: typeof row.source === 'string' ? row.source : DEFAULT_SOURCE,
    })
  }
  return cleaned
}

// ---------- Public API ----------

/**
 * Fetch an ingredient-level safety breakdown for a product.
 * @param {{ id?: string, name: string, brand?: string, category?: string }} product
 * @returns {Promise<{ ingredients: Array<{ name: string, safetyScore: 'clean'|'caution'|'avoid', purpose: string, concerns: string, source: string }> }>}
 */
export async function fetchIngredientAnalysis(product) {
  if (USE_MOCK) {
    // Simulate a realistic Claude latency so the loading skeleton is visible.
    await new Promise((r) => setTimeout(r, 900))
    const { ingredients } = mockAnalysis(product)
    return { ingredients: validate(ingredients) }
  }

  // Live path — wired but unused until USE_MOCK is flipped.
  const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!ANTHROPIC_API_KEY) throw new Error('Missing VITE_ANTHROPIC_API_KEY in .env.local')

  const system = `You are an ingredient-safety analyst for Clean Shopper. Given a product, list its ingredients in order and rate each as "clean", "caution", or "avoid" using EWG Skin Deep as your reference.

Return ONLY a valid JSON object with no markdown, no code fences, and no text outside the object.

Shape:
{
  "ingredients": [
    { "name": "...", "safetyScore": "clean" | "caution" | "avoid", "purpose": "1 sentence", "concerns": "1-3 sentences" }
  ]
}`

  const userMsg = `Product: ${product.name}\nBrand: ${product.brand ?? ''}\nCategory: ${product.category ?? ''}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      system,
      messages: [{ role: 'user', content: userMsg }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Claude API error: ${res.status}`)
  }

  const data = await res.json()
  const text = data.content?.[0]?.text ?? ''
  const cleaned = text.replace(/```json|```/g, '').trim()

  let parsed
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error('Claude returned an unexpected response format. Please try again.')
  }

  return { ingredients: validate(parsed?.ingredients) }
}
