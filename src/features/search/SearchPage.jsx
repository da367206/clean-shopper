import { useState, useEffect, useRef } from 'react'
import SearchBar from '../../components/SearchBar'
import ProductCard from '../../components/ProductCard'
import EmptyState from '../../components/EmptyState'
import IngredientDeepDivePage from '../../components/IngredientDeepDivePage'
import BarcodeScanner from '../../components/BarcodeScanner'
import { searchProducts } from '../../lib/api/products'
import { fetchSavedProductIds, saveProduct, unsaveProduct } from '../../lib/api/savedProducts'
import { lookupBarcode } from '../../lib/api/barcode'

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

export default function SearchPage({ initialQuery = '', onQueryConsumed }) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState(null)
  const [deepDiveProduct, setDeepDiveProduct] = useState(null)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [scanResult, setScanResult] = useState(null) // { product, loading, error }
  const savedScrollYRef = useRef(0)

  function openDeepDive(product) {
    savedScrollYRef.current = window.scrollY
    setDeepDiveProduct(product)
    window.scrollTo(0, 0)
  }

  function closeDeepDive() {
    setDeepDiveProduct(null)
    requestAnimationFrame(() => window.scrollTo(0, savedScrollYRef.current))
  }

  // Auto-run search when arriving from the hero with a pre-filled query.
  useEffect(() => {
    if (initialQuery.trim()) {
      handleSearch()
      onQueryConsumed?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  async function handleBarcodeDetected(barcode) {
    setScannerOpen(false)
    setScanResult({ loading: true, product: null, error: null, barcode })
    try {
      const product = await lookupBarcode(barcode)
      setScanResult({ loading: false, product, error: null, barcode })
    } catch (err) {
      setScanResult({ loading: false, product: null, error: 'Lookup failed. Please try again.', barcode })
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
        <h1 className="text-h1 text-neutral-900">Search</h1>
        <p className="text-body text-neutral-600">
          Find products by name, brand, or ingredient keyword.
        </p>
      </div>

      {/* Search bar + scan button */}
      <div className="flex items-center gap-space-sm">
        <div className="flex-1">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            placeholder='Try "shampoo" or "dish soap" or "Dove"...'
            isLoading={loading}
          />
        </div>
        <button
          onClick={() => { setScanResult(null); setScannerOpen(true) }}
          aria-label="Scan barcode"
          className="flex items-center gap-space-xs px-space-md py-space-sm bg-white border border-neutral-200 rounded-radius-md text-neutral-600 hover:text-primary hover:border-primary transition-colors duration-150 flex-shrink-0 h-full"
        >
          <ScanIcon />
          <span className="text-small font-medium hidden sm:inline">Scan</span>
        </button>
      </div>

      {/* Scan result */}
      {scanResult && (
        <div className="flex flex-col gap-space-md">
          {scanResult.loading && (
            <div className="bg-white border border-neutral-200 rounded-radius-lg p-space-lg flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-radius-sm bg-neutral-100 animate-pulse flex-shrink-0" />
              <div className="flex flex-col gap-space-xs flex-1">
                <div className="h-space-md bg-neutral-100 animate-pulse rounded-radius-sm w-1/2" />
                <div className="h-space-sm bg-neutral-100 animate-pulse rounded-radius-sm w-1/3" />
              </div>
            </div>
          )}
          {!scanResult.loading && scanResult.error && (
            <div className="bg-white border border-neutral-200 rounded-radius-lg p-space-lg text-center">
              <p className="text-body text-neutral-600">{scanResult.error}</p>
              <p className="text-small text-neutral-400 mt-space-xs">Barcode: {scanResult.barcode}</p>
            </div>
          )}
          {!scanResult.loading && !scanResult.error && !scanResult.product && (
            <div className="bg-white border border-neutral-200 rounded-radius-lg p-space-lg text-center">
              <p className="text-body text-neutral-700 font-medium">Product not found</p>
              <p className="text-small text-neutral-400 mt-space-xs">Barcode <span className="font-mono">{scanResult.barcode}</span> isn't in our database yet.</p>
            </div>
          )}
          {!scanResult.loading && scanResult.product && (
            <div className="flex flex-col gap-space-sm">
              <p className="text-small text-neutral-400">Scanned product</p>
              <ProductCard
                name={scanResult.product.name}
                safetyScore={scanResult.product.safety_score}
                score={scanResult.product.score}
                category={scanResult.product.category}
                description={scanResult.product.description}
                imageUrl={scanResult.product.image_url}
                onSave={scanResult.product.id ? () => toggleSave(scanResult.product.id) : undefined}
                isSaved={scanResult.product.id ? savedIds.includes(scanResult.product.id) : false}
                onClick={() => openDeepDive(scanResult.product)}
              />
            </div>
          )}
        </div>
      )}

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
                onClick={() => openDeepDive(product)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Barcode scanner modal */}
      {scannerOpen && (
        <BarcodeScanner
          onDetected={handleBarcodeDetected}
          onClose={() => setScannerOpen(false)}
        />
      )}

    </div>
  )
}
