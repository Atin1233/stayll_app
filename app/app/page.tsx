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
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const [leases, setLeases] = useState<Lease[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLeases = async () => {
      try {
        const result = await LeaseStorageService.fetchLeases()
        if (result.success && result.leases) {
          setLeases(result.leases)
        }
      } catch (error) {
        console.error('Failed to load leases:', error)
      } finally {
        setLoading(false)
      }
    }
    loadLeases()
  }, [])

  const statusCounts = {
    inProgress: leases.filter(l => l.verification_status === 'unverified' || l.verification_status === 'pending').length,
    reviewReady: leases.filter(l => l.verification_status === 'in_review').length,
    complete: leases.filter(l => l.verification_status === 'verified').length,
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor your lease abstraction project status
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
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {lease.verification_status === 'verified'
                            ? 'Complete'
                            : lease.verification_status === 'in_review'
                            ? 'Review Ready'
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
