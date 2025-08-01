"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationCode, setConfirmationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [useMagicLink, setUseMagicLink] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase) {
      setError('Authentication service not configured')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    if (useMagicLink) {
      // Use magic link approach
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login`
        }
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setMessage('Check your email for a magic link to sign in!')
        setLoading(false)
      }
    } else {
      // Use confirmation code approach
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/login`
        }
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setMessage('Check your email for a confirmation code!')
        setShowConfirmation(true)
        setLoading(false)
      }
    }
  }

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supabase) {
      setError('Authentication service not configured')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: confirmationCode,
      type: 'signup'
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setMessage('Email confirmed successfully! You can now sign in.')
      setShowConfirmation(false)
      setConfirmationCode('')
      setLoading(false)
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    }
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Confirm your email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We sent a confirmation code to {email}
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleConfirmation}>
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}
            {message && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">{message}</div>
              </div>
            )}
            <div>
              <label htmlFor="confirmation-code" className="sr-only">
                Confirmation Code
              </label>
              <input
                id="confirmation-code"
                name="confirmationCode"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter 6-digit code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                maxLength={6}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Confirming...' : 'Confirm Email'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Back to registration
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          {message && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{message}</div>
            </div>
          )}
          
          {/* Authentication Method Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => setUseMagicLink(false)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                !useMagicLink
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setUseMagicLink(true)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                useMagicLink
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Magic Link
            </button>
          </div>

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {!useMagicLink && (
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : useMagicLink ? 'Send Magic Link' : 'Create account'}
            </button>
          </div>

          {useMagicLink && (
            <div className="text-center">
              <p className="text-sm text-gray-600">
                We'll send you a magic link to sign in without a password
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 