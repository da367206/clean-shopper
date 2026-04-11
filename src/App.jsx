import { useState } from 'react'
import NavBar from './components/NavBar'
import Sidebar from './components/Sidebar'
import BrowsePage from './features/browse/BrowsePage'
import SearchPage from './features/search/SearchPage'

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

export default function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <Sidebar activeTab={activeTab} onNavigate={setActiveTab} />

      {/* Mobile header */}
      <header className="
        md:hidden
        sticky top-0 z-10
        bg-white border-b border-neutral-200
        px-space-lg py-space-md
        flex items-center gap-space-sm
        text-primary
      ">
        <LogoIcon />
        <span className="text-h4 font-semibold text-neutral-900">Clean Shopper</span>
      </header>

      {/* Main content */}
      <main className="md:pl-56">
        <div className="max-w-5xl mx-auto p-space-xl md:p-space-3xl pb-space-4xl md:pb-space-3xl">
          {activeTab === 'search' ? <SearchPage /> : <BrowsePage />}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <NavBar activeTab={activeTab} onNavigate={setActiveTab} />
    </div>
  )
}
