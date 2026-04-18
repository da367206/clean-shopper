import { useState, useEffect, useRef } from 'react'
import ProductCard from '../../components/ProductCard'
import CategoryTag from '../../components/CategoryTag'
import IngredientDeepDivePage from '../../components/IngredientDeepDivePage'
import { fetchProductsByCategory } from '../../lib/api/products'
import { fetchSavedProductIds, saveProduct, unsaveProduct } from '../../lib/api/savedProducts'

const CATEGORIES = ['All', 'Personal Care', 'Home Cleaning', 'Baby Care', 'Kitchen']

export default function BrowsePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [savedIds, setSavedIds] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deepDiveProduct, setDeepDiveProduct] = useState(null)
  const savedScrollYRef = useRef(0)

  function openDeepDive(product) {
    savedScrollYRef.current = window.scrollY
    setDeepDiveProduct(product)
    window.scrollTo(0, 0)
  }

  function closeDeepDive() {
    setDeepDiveProduct(null)
    // Restore after React commits the list view.
    requestAnimationFrame(() => window.scrollTo(0, savedScrollYRef.current))
  }

  // Load products when category changes
  useEffect(() => {
    async function loadProducts() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchProductsByCategory(activeCategory)
        setProducts(data)
      } catch (err) {
        console.error('Failed to load products:', err)
        setError('Could not load products. Please try again.')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [activeCategory])

  // Load saved product IDs once on mount
  useEffect(() => {
    async function loadSaved() {
      try {
        const ids = await fetchSavedProductIds()
        setSavedIds(ids)
      } catch (err) {
        console.error('Failed to load saved products:', err)
      }
    }
    loadSaved()
  }, [])

  async function toggleSave(productId) {
    const isSaved = savedIds.includes(productId)
    // Optimistic update
    setSavedIds((prev) =>
      isSaved ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
    try {
      if (isSaved) {
        await unsaveProduct(productId)
      } else {
        await saveProduct(productId)
      }
    } catch (err) {
      // Revert on failure
      setSavedIds((prev) =>
        isSaved ? [...prev, productId] : prev.filter((id) => id !== productId)
      )
      console.error('Failed to toggle save:', err)
    }
  }

  if (deepDiveProduct) {
    return (
      <IngredientDeepDivePage
        product={deepDiveProduct}
        onClose={closeDeepDive}
        onSaveToggle={() => toggleSave(deepDiveProduct.id)}
        isSaved={savedIds.includes(deepDiveProduct.id)}
      />
    )
  }

  return (
    <div className="flex flex-col gap-space-xl">

      {/* Header */}
      <div className="flex flex-col gap-space-xs">
        <h1 className="text-h1 text-neutral-900">Browse</h1>
        <p className="text-body text-neutral-600">
          Explore products rated for ingredient safety.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-space-sm">
        {CATEGORIES.map((cat) => (
          <CategoryTag
            key={cat}
            label={cat}
            isActive={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {/* Error state */}
      {error && (
        <p className="text-small text-error">{error}</p>
      )}

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg [&>*]:max-w-sm">
          {Array.from({ length: 6 }).map((_, i) => (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg [&>*]:max-w-sm">
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
              onClick={() => openDeepDive(product)}
            />
          ))}
        </div>
      )}

    </div>
  )
}
