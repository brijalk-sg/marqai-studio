import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    console.log('Login submitted:', { email, password })
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary-400">
            MARQAI Studio
          </h1>
          <p className="mt-2 text-surface-400">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-surface-700 bg-surface-900 p-8"
        >
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-surface-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3.5 py-2.5 text-surface-100 placeholder-surface-500 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-surface-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-surface-700 bg-surface-800 px-3.5 py-2.5 text-surface-100 placeholder-surface-500 outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-primary-600 py-2.5 font-semibold text-white transition hover:bg-primary-500"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-surface-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary-400 hover:text-primary-300">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
