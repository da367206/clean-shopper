import { useState } from 'react'
import SearchBar from '../../components/SearchBar'
import ProductCard from '../../components/ProductCard'
import EmptyState from '../../components/EmptyState'
import { searchProducts } from '../../lib/api/products'

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

  async function handleSearch() {
    const trimmed = query.trim()
    if (!trimmed) return

    setLoading(true)
    setSearched(true)

    const data = await searchProducts(trimmed)
    setResults(data)
    setLoading(false)
  }

  function toggleSave(id) {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
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
        placeholder='Try "dish soap" or "fragrance-free"...'
        isLoading={loading}
      />

      {/* Results */}
      {searched && !loading && results.length === 0 && (
        <EmptyState
          icon={<SearchIcon />}
          title="No results found"
          message={`No products matched "${query}". Try a different keyword or brand name.`}
        />
      )}

      {results.length > 0 && (
        <div className="flex flex-col gap-space-sm">
          <p className="text-small text-neutral-400">
            {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                safetyScore={product.safety_score}
                score={product.score}
                category={product.category}
                description={product.description}
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
