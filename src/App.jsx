import { useState } from 'react'
import NavBar from './components/NavBar'
import BrowsePage from './features/browse/BrowsePage'

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-neutral-50 pb-space-4xl md:pl-56">
      <div className="max-w-5xl mx-auto p-space-xl md:p-space-3xl">
        <BrowsePage />
      </div>
      <NavBar activeTab={activeTab} onNavigate={setActiveTab} />
    </div>
  )
}
