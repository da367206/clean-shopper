import { useState } from 'react'
import ProductCard from './components/ProductCard'
import NavBar from './components/NavBar'
import SearchBar from './components/SearchBar'
import Button from './components/Button'
import InputField from './components/InputField'
import EmptyState from './components/EmptyState'
import CategoryTag from './components/CategoryTag'

const SAMPLE_PRODUCTS = [
  {
    name: "Dr. Bronner's Pure Castile Soap",
    safetyScore: 'clean',
    score: 92,
    category: 'Personal Care',
    description: 'Organic, fair trade, no synthetic preservatives or detergents.',
  },
  {
    name: 'Method All-Purpose Cleaner',
    safetyScore: 'caution',
    score: 54,
    category: 'Home Cleaning',
    description: 'Biodegradable surfactants with synthetic fragrance. Review ingredient list before use.',
  },
  {
    name: 'Febreze Air Freshener',
    safetyScore: 'avoid',
    score: 18,
    category: 'Home Care',
    description: 'Contains undisclosed fragrance chemicals linked to hormone disruption. Not recommended.',
  },
]

const CATEGORIES = ['All', 'Personal Care', 'Home Cleaning', 'Home Care']

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [search, setSearch] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [savedProducts, setSavedProducts] = useState([])

  return (
    <div className="min-h-screen bg-neutral-50 pb-space-4xl md:pl-56">
      <div className="max-w-5xl mx-auto p-space-xl md:p-space-3xl flex flex-col gap-space-2xl">

        <h1 className="text-h1 text-neutral-900">Clean Shopper</h1>

        {/* SearchBar */}
        <section className="flex flex-col gap-space-sm">
          <h2 className="text-h4 text-neutral-600">SearchBar</h2>
          <SearchBar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSubmit={() => {}}
            placeholder="Search for a product…"
          />
        </section>

        {/* CategoryTag — filter mode */}
        <section className="flex flex-col gap-space-sm">
          <h2 className="text-h4 text-neutral-600">CategoryTag</h2>
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
        </section>

        {/* Button variants */}
        <section className="flex flex-col gap-space-sm">
          <h2 className="text-h4 text-neutral-600">Button</h2>
          <div className="flex flex-wrap gap-space-sm">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
        </section>

        {/* InputField */}
        <section className="flex flex-col gap-space-sm">
          <h2 className="text-h4 text-neutral-600">InputField</h2>
          <div className="flex flex-col gap-space-md">
            <InputField
              label="Ingredient to avoid"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="e.g. sodium lauryl sulfate"
              hint="We'll flag any product containing this ingredient."
            />
            <InputField
              label="Brand name"
              value=""
              onChange={() => {}}
              placeholder="e.g. Method"
              error="This field is required."
            />
          </div>
        </section>

        {/* ProductCards */}
        <section className="flex flex-col gap-space-sm">
          <h2 className="text-h4 text-neutral-600">ProductCard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            {SAMPLE_PRODUCTS.map((product) => (
              <ProductCard
                key={product.name}
                {...product}
                onSave={() => setSavedProducts((prev) =>
                  prev.includes(product.name)
                    ? prev.filter((n) => n !== product.name)
                    : [...prev, product.name]
                )}
                isSaved={savedProducts.includes(product.name)}
              />
            ))}
          </div>
        </section>

        {/* EmptyState */}
        <section className="flex flex-col gap-space-sm">
          <h2 className="text-h4 text-neutral-600">EmptyState</h2>
          <div className="bg-white border border-neutral-200 rounded-radius-lg">
            <EmptyState
              title="No results found"
              message="Try a different search term or browse by category."
              action={{ label: 'Browse categories', onClick: () => {} }}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              }
            />
          </div>
        </section>

      </div>

      <NavBar activeTab={activeTab} onNavigate={setActiveTab} />
    </div>
  )
}
