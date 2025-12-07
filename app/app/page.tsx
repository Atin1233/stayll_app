'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LeaseStorageService } from '@/lib/v5/leaseStorage'
import type { Lease } from '@/types/v5.0'
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'

interface PortfolioMetrics {
  totalLeases: number
  totalAnnualRent: number
  totalMonthlyRent: number
  verifiedLeases: number
}

interface RenewalAlert {
  leaseId: string
  tenantName?: string
  propertyAddress?: string
  renewalDate: string
  noticeDeadline?: string
  daysUntil: number
}

interface EscalationAlert {
  leaseId: string
  tenantName?: string
  propertyAddress?: string
  escalationDate: string
  escalationType: string
  escalationValue: string
  daysUntil: number
}

export default function DashboardPage() {
  const [leases, setLeases] = useState<Lease[]>([])
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState<PortfolioMetrics | null>(null)
  const [renewalAlerts, setRenewalAlerts] = useState<RenewalAlert[]>([])
  const [escalationAlerts, setEscalationAlerts] = useState<EscalationAlert[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load leases
      const result = await LeaseStorageService.fetchLeases()
      if (result.success && result.leases) {
        setLeases(result.leases)
        calculateMetrics(result.leases)
        calculateRenewalAlerts(result.leases)
        calculateEscalationAlerts(result.leases)
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateMetrics = (leaseList: Lease[]) => {
    const verified = leaseList.filter(l => l.verification_status === 'verified')
    
    // Calculate total rent from verified leases
    let totalAnnual = 0
    for (const lease of verified) {
      const baseRent = lease.base_rent || parseFloat(lease.monthly_rent || '0') || 0
      totalAnnual += baseRent * 12
    }

    setMetrics({
      totalLeases: leaseList.length,
      totalAnnualRent: totalAnnual,
      totalMonthlyRent: totalAnnual / 12,
      verifiedLeases: verified.length,
    })
  }

  const calculateRenewalAlerts = (leaseList: Lease[]) => {
    const alerts: RenewalAlert[] = []
    const now = new Date()
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

    for (const lease of leaseList) {
      if (lease.lease_end) {
        const endDate = new Date(lease.lease_end)
        const daysUntil = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        
        // Alert if renewal is within 90 days
        if (endDate <= ninetyDaysFromNow && endDate >= now) {
          const noticeDeadline = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days before
          
          alerts.push({
            leaseId: lease.id,
            tenantName: lease.tenant_name,
            propertyAddress: lease.property_address,
            renewalDate: lease.lease_end,
            noticeDeadline: noticeDeadline.toISOString().split('T')[0],
            daysUntil,
          })
        }
      }
    }

    // Sort by days until renewal (soonest first)
    alerts.sort((a, b) => a.daysUntil - b.daysUntil)
    setRenewalAlerts(alerts.slice(0, 5)) // Top 5
  }

  const calculateEscalationAlerts = async (leaseList: Lease[]) => {
    const alerts: EscalationAlert[] = []
    const now = new Date()
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

    // Check lease fields for escalation data
    for (const lease of leaseList) {
      if (lease.analysis_data?.escalations) {
        const escalations = lease.analysis_data.escalations
        if (Array.isArray(escalations)) {
          for (const escalation of escalations) {
            if (escalation.effective_date) {
              const escalationDate = new Date(escalation.effective_date)
              const daysUntil = Math.ceil((escalationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
              
              if (escalationDate <= ninetyDaysFromNow && escalationDate >= now) {
                alerts.push({
                  leaseId: lease.id,
                  tenantName: lease.tenant_name,
                  propertyAddress: lease.property_address,
                  escalationDate: escalation.effective_date,
                  escalationType: escalation.type || 'Unknown',
                  escalationValue: escalation.value ? `${escalation.value}${escalation.type === 'percent' ? '%' : ''}` : 'N/A',
                  daysUntil,
                })
              }
            }
          }
        }
      }
    }

    // Sort by days until escalation (soonest first)
    alerts.sort((a, b) => a.daysUntil - b.daysUntil)
    setEscalationAlerts(alerts.slice(0, 5)) // Top 5
  }

  const statusCounts = {
    inProgress: leases.filter(l => l.verification_status !== 'verified' && l.verification_status !== 'in_review').length,
    reviewReady: leases.filter(l => l.verification_status === 'in_review').length,
    complete: leases.filter(l => l.verification_status === 'verified').length,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor your portfolio exposure, upcoming renewals, and escalation alerts
          </p>
        </div>
        <Link
          href="/app/contracts"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
        >
          <CloudArrowUpIcon className="h-5 w-5" />
          Upload Leases
        </Link>
      </div>

      {/* Portfolio Exposure Metrics */}
      {metrics && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leases</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{metrics.totalLeases}</p>
                <p className="mt-1 text-sm text-gray-500">{metrics.verifiedLeases} verified</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annual Portfolio Value</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(metrics.totalAnnualRent)}</p>
                <p className="mt-1 text-sm text-gray-500">Verified leases only</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Rent</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(metrics.totalMonthlyRent)}</p>
                <p className="mt-1 text-sm text-gray-500">Current month</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <ArrowTrendingUpIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing Status</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{statusCounts.complete}</p>
                <p className="mt-1 text-sm text-gray-500">{statusCounts.reviewReady} ready for review</p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Renewals & Escalation Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Renewals */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <CalendarIcon className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Renewals</h2>
                  <p className="text-sm text-gray-500">Next 90 days</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : renewalAlerts.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">No renewals in the next 90 days</p>
              </div>
            ) : (
              <div className="space-y-4">
                {renewalAlerts.map((alert) => (
                  <div key={alert.leaseId} className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {alert.propertyAddress || alert.tenantName || 'Unknown Property'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {alert.tenantName && alert.propertyAddress && alert.tenantName}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                          <span>Expires: {new Date(alert.renewalDate).toLocaleDateString()}</span>
                          <span className="font-semibold text-orange-700">{alert.daysUntil} days</span>
                        </div>
                        {alert.noticeDeadline && (
                          <p className="text-xs text-orange-700 mt-1">
                            Notice deadline: {new Date(alert.noticeDeadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/app/contracts?contract=${alert.leaseId}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-900"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Escalation Alerts */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-100 p-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Escalation Alerts</h2>
                  <p className="text-sm text-gray-500">Next 90 days</p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-4">
            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : escalationAlerts.length === 0 ? (
              <div className="text-center py-8">
                <ArrowTrendingUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">No escalations in the next 90 days</p>
              </div>
            ) : (
              <div className="space-y-4">
                {escalationAlerts.map((alert) => (
                  <div key={`${alert.leaseId}-${alert.escalationDate}`} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {alert.propertyAddress || alert.tenantName || 'Unknown Property'}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {alert.tenantName && alert.propertyAddress && alert.tenantName}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                          <span>
                            {alert.escalationType}: {alert.escalationValue}
                          </span>
                          <span className="font-semibold text-red-700">{alert.daysUntil} days</span>
                        </div>
                        <p className="text-xs text-red-700 mt-1">
                          Effective: {new Date(alert.escalationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        href={`/app/contracts?contract=${alert.leaseId}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-900"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{statusCounts.inProgress}</p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Review Ready</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{statusCounts.reviewReady}</p>
            </div>
            <div className="rounded-full bg-yellow-100 p-3">
              <DocumentTextIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Complete</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{statusCounts.complete}</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leases */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Leases</h2>
        </div>
        <div className="px-6 py-4">
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : leases.length === 0 ? (
            <div className="text-center py-8">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-600">No leases uploaded yet</p>
              <Link
                href="/app/contracts"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
              >
                <CloudArrowUpIcon className="h-5 w-5" />
                Upload Your First Lease
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {leases.slice(0, 10).map((lease) => (
                    <tr key={lease.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {lease.property_address || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {lease.tenant_name || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            lease.verification_status === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : lease.verification_status === 'in_review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : lease.verification_status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {lease.verification_status === 'verified'
                            ? 'Complete'
                            : lease.verification_status === 'in_review'
                            ? 'Review Ready'
                            : lease.verification_status === 'rejected'
                            ? 'Rejected'
                            : 'In Progress'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(lease.created_at).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <Link
                          href={`/app/contracts?contract=${lease.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {leases.length > 10 && (
          <div className="border-t border-gray-200 px-6 py-4 text-center">
            <Link
              href="/app/contracts"
              className="text-sm font-medium text-blue-600 hover:text-blue-900"
            >
              View all leases →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
