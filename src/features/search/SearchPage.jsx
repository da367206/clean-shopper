import { useState, useEffect } from 'react'
import SearchBar from '../../components/SearchBar'
import ProductCard from '../../components/ProductCard'
import EmptyState from '../../components/EmptyState'
import { searchProducts } from '../../lib/api/products'
import { fetchSavedProductIds, saveProduct, unsaveProduct } from '../../lib/api/savedProducts'

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState(null)

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

  async function handleSearch() {
    const trimmed = query.trim()
    if (!trimmed) return

    setLoading(true)
    setSearched(true)
    setError(null)
    setResults([])

    try {
      const data = await searchProducts(trimmed)
      setResults(data)
    } catch (err) {
      console.error('Search error:', err)
      setError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="flex flex-col gap-space-xl">

      {/* Header */}
      <div className="flex flex-col gap-space-xs">
        <h1 className="text-h1 text-neutral-900">Search</h1>
        <p className="text-body text-neutral-600">
          Find products by name, brand, or ingredient keyword.
        </p>
      </div>

      {/* Search bar */}
      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={handleSearch}
        placeholder='Try "shampoo" or "dish soap" or "Dove"...'
        isLoading={loading}
      />

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {Array.from({ length: 4 }).map((_, i) => (
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

      {/* Error state */}
      {!loading && error && (
        <EmptyState
          icon={<SearchIcon />}
          title="Search failed"
          message={error}
          action={{ label: 'Try again', onClick: handleSearch }}
        />
      )}

      {/* Empty state */}
      {!loading && !error && searched && results.length === 0 && (
        <EmptyState
          icon={<SearchIcon />}
          title="No results found"
          message={`No products matched "${query}". Try a different keyword or describe what you need.`}
        />
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="flex flex-col gap-space-md">
          <p className="text-small text-neutral-400">
            {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {results.map((product, i) => (
              <ProductCard
                key={product.id ?? `${product.name}-${i}`}
                name={product.name}
                safetyScore={product.safety_score}
                score={product.score}
                category={product.category}
                description={product.description}
                imageUrl={product.image_url}
                onSave={() => toggleSave(product.id)}
                isSaved={savedIds.includes(product.id)}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
