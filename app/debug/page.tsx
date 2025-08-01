"use client"

import { useEffect, useState } from 'react'
import { debugEnvironment, getSiteUrl, getAuthRedirectUrl } from '@/lib/utils'

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    // Run debug function
    debugEnvironment()
    
    // Collect debug information
    const info = {
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      NODE_ENV: process.env.NODE_ENV,
      window: typeof window !== 'undefined' ? {
        origin: window.location.origin,
        href: window.location.href,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        port: window.location.port
      } : 'Server side - no window object',
      siteUrl: getSiteUrl(),
      authRedirectUrl: getAuthRedirectUrl('/auth/login')
    }
    
    setDebugInfo(info)
    console.log('Debug info:', info)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <div><strong>NEXT_PUBLIC_SITE_URL:</strong> {debugInfo.NEXT_PUBLIC_SITE_URL || 'Not set'}</div>
            <div><strong>NODE_ENV:</strong> {debugInfo.NODE_ENV}</div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Window Information</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.window, null, 2)}
          </pre>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Generated URLs</h2>
          <div className="space-y-2">
            <div><strong>Site URL:</strong> {debugInfo.siteUrl}</div>
            <div><strong>Auth Redirect URL:</strong> {debugInfo.authRedirectUrl}</div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Check the console for additional debug information</li>
            <li>If NEXT_PUBLIC_SITE_URL is "Not set", add it to your Vercel environment variables</li>
            <li>The Auth Redirect URL should point to your production domain, not localhost</li>
            <li>If it's still showing localhost, the environment variable isn't being read correctly</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-yellow-900">Quick Fix</h2>
          <p className="text-yellow-800 mb-4">
            If you're still having issues, try this temporary fix:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-yellow-800">
            <li>Go to your Vercel dashboard</li>
            <li>Add environment variable: <code>NEXT_PUBLIC_SITE_URL=https://your-actual-domain.vercel.app</code></li>
            <li>Redeploy the app</li>
            <li>Check this debug page again</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 