import { useState } from 'react'
import ProductCard from '../../components/ProductCard'
import CategoryTag from '../../components/CategoryTag'

const CATEGORIES = ['All', 'Personal Care', 'Home Cleaning', 'Baby Care']

const PRODUCTS = [
  {
    id: 1,
    name: "Dr. Bronner's Pure Castile Soap",
    safetyScore: 'clean',
    score: 94,
    category: 'Personal Care',
    description: 'Organic, fair trade, no synthetic preservatives or detergents. Safe for skin and the environment.',
  },
  {
    id: 2,
    name: 'Native Deodorant',
    safetyScore: 'clean',
    score: 88,
    category: 'Personal Care',
    description: 'Aluminum-free with naturally derived ingredients. No parabens, sulfates, or phthalates.',
  },
  {
    id: 3,
    name: 'Branch Basics Concentrate',
    safetyScore: 'clean',
    score: 96,
    category: 'Home Cleaning',
    description: 'Plant- and mineral-based, fragrance-free all-purpose cleaner. No synthetic chemicals.',
  },
  {
    id: 4,
    name: 'Method All-Purpose Cleaner',
    safetyScore: 'caution',
    score: 54,
    category: 'Home Cleaning',
    description: 'Biodegradable surfactants with synthetic fragrance. Review ingredient list before use.',
  },
  {
    id: 5,
    name: "Burt's Bees Baby Lotion",
    safetyScore: 'clean',
    score: 91,
    category: 'Baby Care',
    description: '98.9% natural, pediatrician-tested. Free from parabens, phthalates, and petrolatum.',
  },
  {
    id: 6,
    name: 'Huggies Natural Care Wipes',
    safetyScore: 'caution',
    score: 61,
    category: 'Baby Care',
    description: 'Contains some synthetic preservatives. Generally well-tolerated but check for sensitivities.',
  },
]

export default function BrowsePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [savedIds, setSavedIds] = useState([])

  const filtered = activeCategory === 'All'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory)

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg [&>*]:max-w-sm">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            safetyScore={product.safetyScore}
            score={product.score}
            category={product.category}
            description={product.description}
            onSave={() => toggleSave(product.id)}
            isSaved={savedIds.includes(product.id)}
          />
        ))}
      </div>

    </div>
  )
}
