"use client"

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { CheckIcon } from '@heroicons/react/24/outline'

const TIERS = [
  {
    id: 'essential',
    name: 'Essential',
    description: 'Perfect for small portfolios',
    leases: '0–500 leases',
    annualPrice: 25000,
    monthlyPrice: 2200,
    features: [
      'Up to 500 leases',
      'Automated QA only',
      'Email support',
      'CSV exports',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing portfolios',
    leases: '500–1,500 leases',
    annualPrice: 60000,
    monthlyPrice: 5300,
    features: [
      'Up to 1,500 leases',
      'Human QA for top 20%',
      'One standard integration',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large portfolios',
    leases: '1,500–3,000 leases',
    annualPrice: 120000,
    monthlyPrice: 10600,
    features: [
      'Up to 3,000 leases',
      'Human QA for top 30%',
      'Multiple integrations',
      'Dedicated support',
    ],
  },
  {
    id: 'enterprise_plus',
    name: 'Enterprise Plus',
    description: 'Custom solutions',
    leases: '3,000+ leases',
    annualPrice: null,
    monthlyPrice: null,
    features: [
      'Unlimited leases',
      'Custom QA coverage',
      'Unlimited integrations',
      'Dedicated account manager',
    ],
    custom: true,
  },
]

interface SubscriptionTierSelectorProps {
  currentTier?: string
  onSelect?: (tier: string, billingInterval: 'month' | 'year') => void
}

export default function SubscriptionTierSelector({ currentTier, onSelect }: SubscriptionTierSelectorProps) {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('year')
  const [loading, setLoading] = useState<string | null>(null)

  const handleSelect = async (tierId: string) => {
    if (tierId === 'enterprise_plus') {
      alert('Please contact sales for Enterprise Plus pricing.')
      return
    }

    setLoading(tierId)

    try {
      // Call checkout API
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: tierId,
          billingInterval,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else if (onSelect) {
        onSelect(tierId, billingInterval)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error instanceof Error ? error.message : 'Failed to start checkout')
    } finally {
      setLoading(null)
    }
  }

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Custom'
    if (billingInterval === 'year') {
      return `$${(price / 1000).toFixed(0)}K/year`
    }
    return `$${price.toLocaleString()}/month`
  }

  return (
    <div className="space-y-6">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium ${billingInterval === 'year' ? 'text-gray-900' : 'text-gray-500'}`}>
          Annual
        </span>
        <button
          type="button"
          onClick={() => setBillingInterval(billingInterval === 'year' ? 'month' : 'year')}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              billingInterval === 'month' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${billingInterval === 'month' ? 'text-gray-900' : 'text-gray-500'}`}>
          Monthly
        </span>
        {billingInterval === 'year' && (
          <span className="text-xs text-green-600 font-medium">Save 10%</span>
        )}
      </div>

      {/* Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TIERS.map((tier) => {
          const isCurrentTier = currentTier === tier.id
          const price = billingInterval === 'year' ? tier.annualPrice : tier.monthlyPrice
          const isLoading = loading === tier.id

          return (
            <div
              key={tier.id}
              className={`relative rounded-lg border-2 p-6 ${
                tier.popular
                  ? 'border-blue-500 bg-blue-50'
                  : isCurrentTier
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}

              {isCurrentTier && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Current
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{tier.description}</p>
                <p className="text-xs text-gray-400 mt-1">{tier.leases}</p>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">{formatPrice(price)}</div>
                {billingInterval === 'year' && price && (
                  <div className="text-sm text-gray-500 mt-1">
                    ${Math.round(price / 12).toLocaleString()}/month billed annually
                  </div>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-600">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelect(tier.id)}
                disabled={isLoading || isCurrentTier || tier.custom}
                className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  tier.custom
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isCurrentTier
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : tier.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {isLoading
                  ? 'Loading...'
                  : tier.custom
                  ? 'Contact Sales'
                  : isCurrentTier
                  ? 'Current Plan'
                  : tier.id === 'enterprise_plus'
                  ? 'Contact Sales'
                  : 'Select Plan'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

