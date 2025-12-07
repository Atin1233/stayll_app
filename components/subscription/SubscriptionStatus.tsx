"use client"

import { useEffect, useState } from 'react'
import { CreditCardIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface SubscriptionData {
  subscription: {
    tier: string
    status: string
    billing_interval: string | null
    current_period_start: string | null
    current_period_end: string | null
    max_leases: number
  }
  usage: {
    lease_count: number
    lease_limit: number
    is_unlimited: boolean
  }
  organization: {
    id: string
    name: string
    billing_status: string
  }
}

export default function SubscriptionStatus() {
  const [data, setData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscriptions/current')
      const result = await response.json()

      if (result.success) {
        setData(result)
      } else {
        setError(result.error || 'Failed to load subscription')
      }
    } catch (err) {
      setError('Failed to load subscription')
    } finally {
      setLoading(false)
    }
  }

  const handleManageBilling = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      })

      const result = await response.json()

      if (response.ok && result.url) {
        window.location.href = result.url
      } else {
        alert(result.error || 'Failed to open billing portal')
      }
    } catch (err) {
      alert('Failed to open billing portal')
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error || 'Failed to load subscription information'}</p>
      </div>
    )
  }

  const { subscription, usage } = data
  const usagePercentage = usage.is_unlimited
    ? 0
    : usage.lease_limit > 0
    ? Math.round((usage.lease_count / usage.lease_limit) * 100)
    : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return 'text-green-600 bg-green-100'
      case 'past_due':
        return 'text-yellow-600 bg-yellow-100'
      case 'canceled':
      case 'unpaid':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'past_due':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTierName = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1).replace(/_/g, ' ')
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Subscription</h2>
        <button
          onClick={handleManageBilling}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          <CreditCardIcon className="h-4 w-4" />
          Manage Billing
        </button>
      </div>

      {/* Current Plan */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Current Plan</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(subscription.status)}`}>
            {subscription.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">{formatTierName(subscription.tier)}</span>
          {subscription.billing_interval && (
            <span className="text-sm text-gray-500">
              ({subscription.billing_interval === 'year' ? 'Annual' : 'Monthly'} billing)
            </span>
          )}
        </div>
      </div>

      {/* Usage */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Lease Usage</span>
          <span className="text-sm text-gray-900">
            {usage.lease_count.toLocaleString()}
            {!usage.is_unlimited && ` / ${usage.lease_limit.toLocaleString()}`}
            {usage.is_unlimited && ' / Unlimited'}
          </span>
        </div>
        {!usage.is_unlimited && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                usagePercentage >= 90
                  ? 'bg-red-500'
                  : usagePercentage >= 75
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            ></div>
          </div>
        )}
        {usagePercentage >= 90 && !usage.is_unlimited && (
          <p className="text-xs text-red-600 mt-2">
            You're approaching your limit. Consider upgrading to continue uploading leases.
          </p>
        )}
      </div>

      {/* Billing Period */}
      {subscription.current_period_end && (
        <div>
          <span className="text-sm font-medium text-gray-600 block mb-1">Next Billing Date</span>
          <span className="text-sm text-gray-900">{formatDate(subscription.current_period_end)}</span>
        </div>
      )}

      {/* Status Warning */}
      {subscription.status === 'past_due' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-900">Payment Required</p>
              <p className="text-sm text-yellow-700 mt-1">
                Your subscription payment failed. Please update your payment method to continue using the service.
              </p>
            </div>
          </div>
        </div>
      )}

      {subscription.status === 'canceled' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Subscription Canceled</p>
              <p className="text-sm text-gray-700 mt-1">
                Your subscription has been canceled. You'll continue to have access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

