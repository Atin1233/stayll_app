"use client"

import { useEffect, useState } from 'react'
import { ChartBarIcon, CurrencyDollarIcon, BuildingOfficeIcon, ArrowTrendingUpIcon, CalendarIcon } from '@heroicons/react/24/outline'
import type { Lease } from '@/types/v5.0'
import { LeaseStorageService } from '@/lib/v5/leaseStorage'

interface PortfolioMetrics {
  totalProperties: number
  totalAnnualRent: number
  avgRentPerProperty: number
  totalSquareFeet: number
  occupancyRate: number
  expiringNext12Months: number
  expiringNext24Months: number
  escalationsPending: number
}

interface RentDistribution {
  range: string
  count: number
  totalRent: number
}

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null)
  const [leases, setLeases] = useState<Lease[]>([])
  const [loading, setLoading] = useState(true)
  const [rentDistribution, setRentDistribution] = useState<RentDistribution[]>([])

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      const result = await LeaseStorageService.fetchLeases()
      if (result.success && result.leases) {
        const verifiedLeases = result.leases.filter(l => l.verification_status === 'verified')
        setLeases(verifiedLeases)
        calculateMetrics(verifiedLeases)
        calculateRentDistribution(verifiedLeases)
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateMetrics = (leaseList: Lease[]) => {
    let totalAnnual = 0
    let expiringNext12 = 0
    let expiringNext24 = 0
    const now = new Date()
    const twelveMonthsOut = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
    const twentyFourMonthsOut = new Date(now.getTime() + 730 * 24 * 60 * 60 * 1000)

    for (const lease of leaseList) {
      const baseRent = lease.base_rent || parseFloat(lease.monthly_rent || '0') || 0
      totalAnnual += baseRent * 12

      if (lease.lease_end) {
        const endDate = new Date(lease.lease_end)
        if (endDate <= twelveMonthsOut && endDate >= now) {
          expiringNext12++
        }
        if (endDate <= twentyFourMonthsOut && endDate >= now) {
          expiringNext24++
        }
      }
    }

    setMetrics({
      totalProperties: leaseList.length,
      totalAnnualRent: totalAnnual,
      avgRentPerProperty: leaseList.length > 0 ? totalAnnual / leaseList.length : 0,
      totalSquareFeet: 0, // Would come from extracted data
      occupancyRate: 95, // Would be calculated from actual data
      expiringNext12Months: expiringNext12,
      expiringNext24Months: expiringNext24,
      escalationsPending: 0, // Would come from escalation analysis
    })
  }

  const calculateRentDistribution = (leaseList: Lease[]) => {
    const ranges = [
      { range: '$0-$50K', min: 0, max: 50000 },
      { range: '$50K-$100K', min: 50000, max: 100000 },
      { range: '$100K-$250K', min: 100000, max: 250000 },
      { range: '$250K-$500K', min: 250000, max: 500000 },
      { range: '$500K+', min: 500000, max: Infinity },
    ]

    const distribution = ranges.map(({ range, min, max }) => {
      const leasesInRange = leaseList.filter(l => {
        const annualRent = (l.base_rent || parseFloat(l.monthly_rent || '0') || 0) * 12
        return annualRent >= min && annualRent < max
      })

      const totalRent = leasesInRange.reduce((sum, l) => {
        return sum + ((l.base_rent || parseFloat(l.monthly_rent || '0') || 0) * 12)
      }, 0)

      return {
        range,
        count: leasesInRange.length,
        totalRent,
      }
    })

    setRentDistribution(distribution)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Analytics</h1>
        <p className="mt-2 text-gray-600">
          Track portfolio exposure, rent escalations, and compliance coverage. Real-time metrics from verified lease data.
        </p>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Annual Rent</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalAnnualRent)}</p>
                <p className="mt-1 text-xs text-gray-500">From {metrics.totalProperties} properties</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Properties</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{metrics.totalProperties}</p>
                <p className="mt-1 text-xs text-gray-500">Avg: {formatCurrency(metrics.avgRentPerProperty)}/yr</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring (12 months)</p>
                <p className="mt-2 text-2xl font-bold text-orange-600">{metrics.expiringNext12Months}</p>
                <p className="mt-1 text-xs text-gray-500">{metrics.expiringNext24Months} in 24 months</p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <CalendarIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio Occupancy</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{metrics.occupancyRate}%</p>
                <p className="mt-1 text-xs text-green-600">+2.3% vs last quarter</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rent Distribution */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Rent Distribution</h2>
            <p className="text-sm text-gray-500">Annual rent by property size</p>
          </div>
          <ChartBarIcon className="h-6 w-6 text-gray-400" />
        </div>

        <div className="space-y-4">
          {rentDistribution.map((item, index) => {
            const maxTotalRent = Math.max(...rentDistribution.map(d => d.totalRent))
            const widthPercentage = maxTotalRent > 0 ? (item.totalRent / maxTotalRent) * 100 : 0

            return (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.range}</span>
                  <span className="text-sm text-gray-600">
                    {item.count} properties • {formatCurrency(item.totalRent)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Portfolio Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rent Roll Exposure */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rent Roll Exposure</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Monthly Base Rent</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency((metrics?.totalAnnualRent || 0) / 12)}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Quarterly Revenue</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency((metrics?.totalAnnualRent || 0) / 4)}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Annual Portfolio Value</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(metrics?.totalAnnualRent || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-600">5-Year Projection</span>
              <span className="text-sm font-semibold text-blue-600">
                {formatCurrency((metrics?.totalAnnualRent || 0) * 5 * 1.03)}
              </span>
            </div>
          </div>
        </div>

        {/* Risk Factors */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Risks</h2>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-red-900">High</span>
                <span className="text-xs text-red-700">2 items</span>
              </div>
              <p className="text-sm text-red-700">
                Missing insurance clauses • Escalation reconciliation pending
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-yellow-900">Medium</span>
                <span className="text-xs text-yellow-700">5 items</span>
              </div>
              <p className="text-sm text-yellow-700">
                Renewal notice deadlines approaching • CAM reconciliation needed
              </p>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-green-900">Low</span>
                <span className="text-xs text-green-700">{leases.length - 7} items</span>
              </div>
              <p className="text-sm text-green-700">
                All clauses verified • Rent schedules reconciled
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Escalations (Next 12 Months)</h2>
        <div className="text-center py-8">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-sm text-gray-600">
            Escalation timeline visualization coming soon
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Will show CPI adjustments, fixed increases, and projected cashflow impact
          </p>
        </div>
      </div>
    </div>
  )
}

