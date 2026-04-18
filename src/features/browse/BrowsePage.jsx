import { useState, useEffect, useRef, useCallback } from 'react'
import ProductCard from '../../components/ProductCard'
import IngredientDeepDivePage from '../../components/IngredientDeepDivePage'
import { fetchProductsByCategory, fetchFeaturedProducts } from '../../lib/api/products'
import { fetchSavedProductIds, saveProduct, unsaveProduct } from '../../lib/api/savedProducts'

const CATEGORIES = [
  {
    key: 'All',
    label: 'All',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    key: 'Personal Care',
    label: 'Personal Care',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a5 5 0 0 1 5 5c0 3-2 5.5-5 7-3-1.5-5-4-5-7a5 5 0 0 1 5-5z"/>
        <path d="M5 20c0-3 3-5 7-5s7 2 7 5"/>
      </svg>
    ),
  },
  {
    key: 'Home Cleaning',
    label: 'Home Cleaning',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key: 'Baby Care',
    label: 'Baby Care',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
  },
  {
    key: 'Kitchen',
    label: 'Kitchen',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><line x1="7" y1="2" x2="7" y2="11"/>
        <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
      </svg>
    ),
  },
]

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const ScanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
    <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
    <line x1="7" y1="12" x2="17" y2="12"/>
  </svg>
)

export default function BrowsePage({ onSearchNavigate, onScanOpen }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [savedIds, setSavedIds] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deepDiveProduct, setDeepDiveProduct] = useState(null)
  const [heroQuery, setHeroQuery] = useState('')
  const [featured, setFeatured] = useState([])
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

  // Load featured (top clean) products once on mount
  useEffect(() => {
    fetchFeaturedProducts(3).then(setFeatured).catch(() => {})
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
    <div className="flex flex-col">

      {/* Hero — full-bleed, no container constraint */}
      <section className="relative px-space-xl md:px-space-3xl pt-space-4xl pb-space-3xl text-center overflow-hidden">

        {/* Clean rustic farmhouse background */}
        <img
          src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1920&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-primary/75" />

        <div className="relative z-10">
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
          <button
            type="button"
            onClick={onScanOpen}
            aria-label="Scan barcode"
            className="
              flex items-center gap-space-xs
              h-touch px-space-md flex-shrink-0
              bg-white/20 text-white font-medium text-body
              rounded-radius-md border border-white/40
              hover:bg-white/30 transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-white
            "
          >
            <ScanIcon />
            <span className="hidden sm:inline">Scan</span>
          </button>
        </div>
        </div>{/* end content */}
      </section>

      {/* Constrained content below the hero */}
      <div className="max-w-5xl mx-auto w-full px-space-xl md:px-space-3xl pt-space-xl pb-space-4xl flex flex-col gap-space-xl">

      {/* Featured products */}
      {featured.length > 0 && (
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 text-neutral-900">Top Picks</h2>
            <button
              onClick={() => setActiveCategory('All')}
              className="text-small text-primary font-medium hover:underline"
            >
              Browse all →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-lg">
            {featured.map((product) => (
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
        </div>
      )}

      {/* Divider */}
      {featured.length > 0 && (
        <hr className="border-neutral-200" />
      )}

      {/* Category filters */}
      <div className="grid grid-cols-5 gap-space-sm">
        {CATEGORIES.map(({ key, label, icon }) => {
          const isActive = activeCategory === key
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`
                flex flex-col items-center justify-center gap-space-xs
                py-space-md px-space-xs
                rounded-radius-md border
                text-center transition-colors duration-150
                ${isActive
                  ? 'bg-primary text-white border-primary shadow-shadow-sm'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary hover:text-primary'}
              `}
            >
              {icon}
              <span className="text-micro font-medium leading-tight">{label}</span>
            </button>
          )
        })}
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

      </div>{/* end constrained content */}
    </div>
  )
}
