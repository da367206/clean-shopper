const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY
const MODEL = 'claude-sonnet-4-20250514'

const SYSTEM_PROMPT = `You are a product research assistant for Clean Shopper, an app that helps health-conscious consumers find safe, non-toxic home and personal care products.

Given a user's search query, recommend 4–6 real, widely available products that match what they are looking for. For each product, evaluate ingredient safety using EWG Skin Deep standards and common clean standards (avoiding parabens, sulfates, phthalates, synthetic fragrances, formaldehyde releasers, and other high-concern chemicals).

Assign each product:
- safety_score: "clean" (minimal concerning ingredients, score 80–100), "caution" (some concerning ingredients, score 50–79), or "avoid" (multiple high-concern ingredients, score below 50)
- score: an integer 0–100 representing overall ingredient safety

Return ONLY a valid JSON array with no markdown formatting, no code blocks, and no text outside the array.

Required shape for each item:
{
  "name": "Full product name",
  "brand": "Brand name",
  "category": "Personal Care" or "Home Cleaning" or "Baby Care" or "Kitchen",
  "description": "2–3 sentences describing what it does, key ingredients, and why it earned its safety rating.",
  "safety_score": "clean" or "caution" or "avoid",
  "score": 85
}`

/**
 * Search for products using Claude AI.
 * Returns an array of product objects shaped to match ProductCard props.
 */
export async function aiSearchProducts(query) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Missing VITE_ANTHROPIC_API_KEY in .env.local')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
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
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: query }
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `Claude API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.content?.[0]?.text ?? ''

  // Strip any accidental markdown code fences before parsing
  const cleaned = text.replace(/```json|```/g, '').trim()

  let products
  try {
    products = JSON.parse(cleaned)
  } catch {
    throw new Error('Claude returned an unexpected response format. Please try again.')
  }

  if (!Array.isArray(products)) {
    throw new Error('Claude returned an unexpected response format. Please try again.')
  }

  return products
}
