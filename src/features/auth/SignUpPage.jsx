import { useState } from 'react'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import { signUp } from '../../lib/api/auth'

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

export default function SignUpPage({ onNavigateToSignIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const { error: authError } = await signUp(email, password)

    setIsLoading(false)

    if (authError) {
      setError(authError.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-space-lg">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center gap-space-sm mb-space-3xl text-primary">
            <LogoIcon />
            <span className="text-h4 font-semibold text-neutral-900">Clean Shopper</span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-radius-lg shadow-shadow-md p-space-xl flex flex-col gap-space-md text-center">
            <div className="flex justify-center text-success">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <h2 className="text-h3 text-neutral-900">Check your email</h2>
              <p className="text-small text-neutral-400 mt-space-xs">
                We sent a confirmation link to <strong className="text-neutral-600">{email}</strong>.
                Click it to activate your account.
              </p>
            </div>
            <button
              type="button"
              onClick={onNavigateToSignIn}
              className="text-small text-primary font-medium hover:underline"
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    )
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
            <h1 className="text-h2 text-neutral-900">Create account</h1>
            <p className="text-small text-neutral-400">Start researching clean products today.</p>
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
              hint="Minimum 6 characters"
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
              Create account
            </Button>
          </form>
        </div>

        {/* Switch to sign-in */}
        <p className="text-center text-small text-neutral-400 mt-space-lg">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateToSignIn}
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </button>
        </p>

      </div>
    </div>
  )
}
