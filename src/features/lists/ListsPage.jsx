import { useState, useEffect } from 'react'
import ProductCard from '../../components/ProductCard'
import IngredientDeepDivePage from '../../components/IngredientDeepDivePage'
import EmptyState from '../../components/EmptyState'
import { fetchSavedProducts } from '../../lib/api/savedProducts'
import { saveProduct, unsaveProduct } from '../../lib/api/savedProducts'

const BookmarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

export default function ListsPage() {
  const [products, setProducts] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deepDiveProduct, setDeepDiveProduct] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchSavedProducts()
        setProducts(data)
        setSavedIds(data.map((p) => p.id))
      } catch (err) {
        console.error('Failed to load saved products:', err)
        setError('Could not load your saved products.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function toggleSave(productId) {
    const isSaved = savedIds.includes(productId)
    // Optimistic update
    setSavedIds((prev) => isSaved ? prev.filter((id) => id !== productId) : [...prev, productId])
    if (isSaved) {
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    }
    try {
      if (isSaved) {
        await unsaveProduct(productId)
      } else {
        await saveProduct(productId)
      }
    } catch (err) {
      // Revert on failure
      setSavedIds((prev) => isSaved ? [...prev, productId] : prev.filter((id) => id !== productId))
      if (isSaved) {
        // Reload to restore removed item
        const data = await fetchSavedProducts()
        setProducts(data)
        setSavedIds(data.map((p) => p.id))
      }
      console.error('Failed to toggle save:', err)
    }
  }

  if (deepDiveProduct) {
    return (
      <IngredientDeepDivePage
        product={deepDiveProduct}
        onClose={() => setDeepDiveProduct(null)}
        onSaveToggle={() => toggleSave(deepDiveProduct.id)}
        isSaved={savedIds.includes(deepDiveProduct.id)}
      />
    )
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-space-xl md:px-space-3xl pt-space-xl pb-space-4xl flex flex-col gap-space-xl">

      <div className="flex flex-col gap-space-xs">
        <h1 className="text-h1 text-neutral-900">My List</h1>
        <p className="text-body text-neutral-600">
          {loading ? '' : `${products.length} saved ${products.length === 1 ? 'product' : 'products'}`}
        </p>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-radius-lg overflow-hidden flex flex-col">
              <div className="h-img-card bg-neutral-100 animate-pulse w-full flex-shrink-0" />
              <div className="flex flex-col gap-space-sm p-space-lg">
                <div className="h-space-lg bg-neutral-100 animate-pulse rounded-radius-sm w-3/4" />
                <div className="h-space-md bg-neutral-100 animate-pulse rounded-radius-sm w-1/4" />
                <div className="h-space-xl bg-neutral-100 animate-pulse rounded-radius-sm w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <p className="text-small text-error">{error}</p>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <EmptyState
          icon={<BookmarkIcon />}
          title="Nothing saved yet"
          message="Tap the bookmark on any product to save it here for easy access."
        />
      )}

      {/* Saved products grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              safetyScore={product.safety_score}
              score={product.score}
              category={product.category}
              description={product.description}
              imageUrl={product.image_url}
              onSave={() => toggleSave(product.id)}
              isSaved={savedIds.includes(product.id)}
              onClick={() => setDeepDiveProduct(product)}
            />
          ))}
        </div>
      )}

    </div>
  )
}
