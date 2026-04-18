import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { signOut } from './lib/api/auth'
import NavBar from './components/NavBar'
import Sidebar from './components/Sidebar'
import ChatDrawer from './components/ChatDrawer'
import BrowsePage from './features/browse/BrowsePage'
import SearchPage from './features/search/SearchPage'
import SignInPage from './features/auth/SignInPage'
import SignUpPage from './features/auth/SignUpPage'

const LogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [session, setSession] = useState(undefined) // undefined = loading, null = signed out
  const [authView, setAuthView] = useState('sign-in') // 'sign-in' | 'sign-up'

  async function handleSignOut() {
    await signOut()
    setAuthView('sign-in') // always return to sign-in after signing out
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Loading state — session not yet resolved
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-space-md text-primary opacity-40">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <span className="text-small font-medium tracking-wide uppercase">Clean Shopper</span>
        </div>
      </div>
    )
  }

  // Not signed in — show auth pages
  if (!session) {
    if (authView === 'sign-up') {
      return (
        <SignUpPage onNavigateToSignIn={() => setAuthView('sign-in')} />
      )
    }
    return (
      <SignInPage onNavigateToSignUp={() => setAuthView('sign-up')} />
    )
  }

  // Signed in — show the main app
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <Sidebar activeTab={activeTab} onNavigate={setActiveTab} onSignOut={handleSignOut} />

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
        <button
          onClick={handleSignOut}
          aria-label="Sign out"
          className="ml-auto text-neutral-400 hover:text-neutral-900 transition-colors duration-150"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </header>

      {/* Main content */}
      <main className="md:pl-56">
        <div className="max-w-5xl mx-auto p-space-xl md:p-space-3xl pb-space-4xl md:pb-space-3xl">
          {activeTab === 'search' ? <SearchPage /> : <BrowsePage />}
        </div>
        <footer className="max-w-5xl mx-auto px-space-xl md:px-space-3xl pb-space-4xl md:pb-space-xl text-center">
          <p className="text-small text-neutral-400">Built with Claude Code</p>
        </footer>
      </main>

      {/* Mobile bottom nav */}
      <NavBar activeTab={activeTab} onNavigate={setActiveTab} />

      {/* AI chat assistant */}
      <ChatDrawer />
    </div>
  )
}
