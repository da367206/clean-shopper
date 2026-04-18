import { useEffect, useState, useCallback } from 'react'
import SafetyBadge from './SafetyBadge'
import CategoryTag from './CategoryTag'
import Button from './Button'
import EmptyState from './EmptyState'
import IngredientList from './IngredientList'
import { fetchIngredientAnalysis } from '../lib/api/ingredients'

const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

function SkeletonRow() {
  return (
    <li className="flex items-center justify-between gap-space-md p-space-md">
      <div className="flex items-center gap-space-sm w-full">
        <div className="h-space-lg w-20 bg-neutral-100 animate-pulse rounded-radius-sm" />
        <div className="h-space-md bg-neutral-100 animate-pulse rounded-radius-sm flex-1 max-w-xs" />
      </div>
    </li>
  )
}

export default function IngredientDeepDivePage({
  product,
  onClose,
  onSaveToggle,
  isSaved,
  onAskAI,
}) {
  const [ingredients, setIngredients] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { ingredients: rows } = await fetchIngredientAnalysis(product)
      setIngredients(rows)
    } catch (err) {
      console.error('fetchIngredientAnalysis failed:', err)
      setError(err.message ?? 'Could not load ingredient analysis.')
      setIngredients(null)
    } finally {
      setLoading(false)
    }
  }, [product])

  useEffect(() => {
    load()
  }, [load])

  // Open the global ChatDrawer with a prefilled question. Uses a custom event
  // so ChatDrawer's public API (props) stays unchanged per the feature spec.
  const handleAskAI = (ingredient) => {
    const seed = `Tell me about ${ingredient.name} in ${product.name}.`
    if (onAskAI) {
      onAskAI(seed)
      return
    }
    window.dispatchEvent(
      new CustomEvent('clean-shopper:ask', { detail: { prompt: seed } })
    )
  }

  return (
    <section className="flex flex-col gap-space-xl pb-space-4xl max-w-3xl mx-auto w-full">

      {/* Back */}
      <div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <span className="inline-flex items-center gap-space-xs">
            <BackIcon />
            Back
          </span>
        </Button>
      </div>

      {/* Header: image left, meta right */}
      <header className="flex flex-col sm:flex-row gap-space-lg sm:gap-space-xl items-stretch">

        {/* Image */}
        <div className="relative w-full sm:w-56 sm:flex-shrink-0 h-img-card sm:h-auto rounded-radius-lg overflow-hidden bg-neutral-100 flex items-center justify-center shadow-shadow-sm">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-space-xs text-primary opacity-30">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span className="text-micro font-medium tracking-wide uppercase">Clean Shopper</span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-space-sm flex-1 min-w-0">
          <div>
            <CategoryTag label={product.category} />
          </div>
          <h1 className="text-h1 text-neutral-900 break-words">{product.name}</h1>
          <div className="flex items-center gap-space-md flex-wrap">
            <SafetyBadge score={product.safety_score} size="md" variant="light" />
            {typeof product.score === 'number' && (
              <span className="text-body text-neutral-600">
                Overall score: <span className="font-medium text-neutral-900">{product.score}</span>
              </span>
            )}
          </div>
          {product.brand && (
            <p className="text-small text-neutral-600">
              by <span className="text-neutral-900 font-medium">{product.brand}</span>
            </p>
          )}
          {product.description && (
            <p className="text-body text-neutral-900 leading-relaxed">
              {product.description}
            </p>
          )}
          {onSaveToggle && (
            <div className="mt-space-xs">
              <Button variant="secondary" size="sm" onClick={onSaveToggle}>
                <BookmarkIcon />
                {isSaved ? 'Saved' : 'Save to list'}
              </Button>
            </div>
          )}
        </div>

      </header>

      {/* Body: loading | error | empty | list */}
      {loading && (
        <div className="flex flex-col gap-space-sm">
          <h2 className="text-h3 text-neutral-900">Ingredients</h2>
          <ul className="flex flex-col rounded-radius-lg border border-neutral-200 bg-white divide-y divide-neutral-200 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
          </ul>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col gap-space-sm">
          <p className="text-small text-error">{error}</p>
          <div>
            <Button variant="ghost" size="sm" onClick={load}>
              Try again
            </Button>
          </div>
        </div>
      )}

      {!loading && !error && ingredients && ingredients.length === 0 && (
        <EmptyState
          icon={<ChatIcon />}
          title="No ingredient data yet"
          message="We couldn't find an ingredient list for this product. Ask Clean Shopper and we'll dig in."
          action={{
            label: 'Ask Clean Shopper',
            onClick: () => handleAskAI({ name: 'this product' }),
          }}
        />
      )}

      {!loading && !error && ingredients && ingredients.length > 0 && (
        <IngredientList ingredients={ingredients} onAskAI={handleAskAI} />
      )}
    </section>
  )
}
