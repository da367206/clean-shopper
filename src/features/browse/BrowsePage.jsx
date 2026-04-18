import { useState, useEffect, useRef, useCallback } from 'react'
import ProductCard from '../../components/ProductCard'
import CategoryTag from '../../components/CategoryTag'
import IngredientDeepDivePage from '../../components/IngredientDeepDivePage'
import { fetchProductsByCategory } from '../../lib/api/products'
import { fetchSavedProductIds, saveProduct, unsaveProduct } from '../../lib/api/savedProducts'

const CATEGORIES = ['All', 'Personal Care', 'Home Cleaning', 'Baby Care', 'Kitchen']

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export default function BrowsePage({ onSearchNavigate }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [savedIds, setSavedIds] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deepDiveProduct, setDeepDiveProduct] = useState(null)
  const [heroQuery, setHeroQuery] = useState('')
  const savedScrollYRef = useRef(0)

  const handleHeroSearch = useCallback(() => {
    const trimmed = heroQuery.trim()
    if (trimmed) onSearchNavigate?.(trimmed)
  }, [heroQuery, onSearchNavigate])

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

      {/* Hero */}
      <section className="
        -mx-space-xl -mt-space-xl md:-mx-space-3xl md:-mt-space-3xl
        px-space-xl md:px-space-3xl
        pt-space-4xl pb-space-3xl
        bg-primary
        text-center
      ">
        <h1 className="text-display text-white leading-tight">
          Know what's in<br className="hidden sm:block" /> every product.
        </h1>
        <p className="mt-space-md text-h4 text-white/70 font-normal max-w-lg mx-auto">
          Search hundreds of rated products and see every ingredient scored for safety.
        </p>

        {/* Search input */}
        <div className="mt-space-xl max-w-xl mx-auto flex gap-space-sm">
          <input
            type="text"
            value={heroQuery}
            onChange={(e) => setHeroQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleHeroSearch()}
            placeholder='Try "shampoo", "dish soap", or "Dove"…'
            className="
              flex-1 min-w-0
              bg-white rounded-radius-md
              px-space-md h-touch
              text-body text-neutral-900 placeholder:text-neutral-400
              focus:outline-none focus:ring-2 focus:ring-white
              border-none
            "
          />
          <button
            type="button"
            onClick={handleHeroSearch}
            className="
              flex items-center gap-space-xs
              h-touch px-space-lg flex-shrink-0
              bg-white text-primary font-medium text-body
              rounded-radius-md
              hover:bg-secondary transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-white
            "
          >
            <SearchIcon />
            Search
          </button>
        </div>
      </section>

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
