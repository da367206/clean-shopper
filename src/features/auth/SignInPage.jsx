import { useState } from 'react'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import { signIn } from '../../lib/api/auth'

const LogoIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

export default function SignInPage({ onNavigateToSignUp }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { error: authError } = await signIn(email, password)

    setIsLoading(false)

    if (authError) {
      setError(authError.message)
    }
    // On success, App.jsx's onAuthStateChange listener updates the session
    // and re-renders the main app automatically — no navigation needed here.
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-space-lg">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center gap-space-sm mb-space-3xl text-primary">
          <LogoIcon />
          <span className="text-h4 font-semibold text-neutral-900">Clean Shopper</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-neutral-200 rounded-radius-lg shadow-shadow-md p-space-xl flex flex-col gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <h1 className="text-h2 text-neutral-900">Sign in</h1>
            <p className="text-small text-neutral-400">Welcome back. Enter your details below.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
            />

            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              error={error}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              disabled={!email || !password}
            >
              Sign in
            </Button>
          </form>
        </div>

        {/* Switch to sign-up */}
        <p className="text-center text-small text-neutral-400 mt-space-lg">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToSignUp}
            className="text-primary font-medium hover:underline"
          >
            Create one
          </button>
        </p>

      </div>
    </div>
  )
}
