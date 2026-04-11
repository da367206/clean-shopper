import { useState, useEffect } from 'react'
import ProductCard from '../../components/ProductCard'
import CategoryTag from '../../components/CategoryTag'
import { supabase } from '../../lib/supabase'

const CATEGORIES = ['All', 'Personal Care', 'Home Cleaning', 'Baby Care', 'Kitchen']

export default function BrowsePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [savedIds, setSavedIds] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      let query = supabase.from('products').select('*').order('score', { ascending: false })
      if (activeCategory !== 'All') query = query.eq('category', activeCategory)
      const { data } = await query
      setProducts(data ?? [])
      setLoading(false)
    }
    fetchProducts()
  }, [activeCategory])

  const filtered = products

  function toggleSave(id) {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
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

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg [&>*]:max-w-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-radius-lg p-space-lg flex flex-col gap-space-sm">
              <div className="h-[20px] bg-neutral-100 animate-pulse rounded-radius-sm w-1/2" />
              <div className="h-[16px] bg-neutral-100 animate-pulse rounded-radius-sm w-1/4" />
              <div className="h-[24px] bg-neutral-100 animate-pulse rounded-radius-sm w-3/4" />
              <div className="h-[40px] bg-neutral-100 animate-pulse rounded-radius-sm w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg [&>*]:max-w-sm">
          {filtered.map((product) => (
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
      )}

    </div>
  )
}
