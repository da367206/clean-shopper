import { useState } from 'react'
import ProductCard from './components/ProductCard'
import NavBar from './components/NavBar'

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

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-neutral-50 pb-space-4xl">
      <div className="max-w-2xl mx-auto p-space-3xl">
        <h1 className="text-h1 text-neutral-900 mb-space-2xl">
          Clean Shopper
        </h1>
        <div className="flex flex-col gap-space-lg">
          {SAMPLE_PRODUCTS.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </div>
      <NavBar activeTab={activeTab} onNavigate={setActiveTab} />
    </div>
  )
}
