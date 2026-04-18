import { supabase } from '../supabase'

const MODEL = 'claude-sonnet-4-20250514'
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

async function getProductCatalog() {
  const { data } = await supabase
    .from('products')
    .select('name, brand, category, safety_score, score, description')
    .order('score', { ascending: false })
  return data ?? []
}

function buildSystemPrompt(products) {
  const catalog = products
    .map(
      p =>
        `• [id:${p.id}] ${p.brand} ${p.name} (${p.category}) — ${p.safety_score.toUpperCase()} rating, score ${p.score}/100. ${p.description}`
    )
    .join('\n')

  return `You are the Clean Shopper AI assistant. You help users find safe, non-toxic home and personal care products by answering questions about ingredients, product safety, and recommending products from the catalog.

PRODUCT CATALOG (${products.length} products):
${catalog}

RATING SYSTEM:
• Clean (80–100): Minimal concerning ingredients. Avoids parabens, sulfates, phthalates, synthetic fragrances, formaldehyde releasers, and other high-concern chemicals.
• Caution (50–79): Some moderate-concern ingredients present. Usable with awareness.
• Avoid (below 50): Multiple high-concern or undisclosed ingredients. Not recommended.

INSTRUCTIONS:
- Recommend products only from the catalog above. Be specific — mention brand, product name, and score.
- Explain safety ratings and ingredient concerns clearly and helpfully.
- For ingredient questions (e.g. "what are parabens?"), give a clear, factual answer.
- Keep responses concise — 2–4 sentences for simple questions, slightly longer for comparisons or lists.
- Be warm and helpful, not clinical.

FORMATTING:
- When mentioning a specific product from the catalog, always format it as a link: [[Product Name|id]] using the product's id from the catalog. Example: [[Wool Dryer Balls|abc-123]].
- Use **bold** (double asterisks) for key terms and ingredient names (not product names, since those use the link format).
- Use a dash + space (- ) at the start of a line for bullet lists when listing multiple products or points.
- Separate distinct sections with a blank line.
- Do not use headers, numbered lists, or any other markdown.`
}

/**
 * Send a chat message to Claude with full product catalog context.
 * @param {Array<{role: 'user'|'assistant', content: string}>} messages - Full conversation history
 * @returns {Promise<string>} - Assistant reply text
 */
export async function sendChatMessage(messages) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error(
      'Chat is not configured. Add VITE_ANTHROPIC_API_KEY to your .env.local file.'
    )
  }

  const products = await getProductCatalog()
  const systemPrompt = buildSystemPrompt(products)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(
      err?.error?.message ?? `Chat unavailable (${response.status}). Please try again.`
    )
  }

  const data = await response.json()
  return data.content?.[0]?.text ?? ''
}
