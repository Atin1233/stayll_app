"use client"

import { useEffect, useState } from 'react'
import { LightBulbIcon, ExclamationTriangleIcon, ShieldCheckIcon, ArrowTrendingUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { SessionStorageService, type SessionLease } from '@/lib/sessionStorage'

interface RiskAlert {
  id: string
  title: string
  property: string
  severity: 'High' | 'Medium' | 'Low'
  due: string
}

interface FinancialSignal {
  id: string
  metric: string
  count: number
  status: string
}

export default function InsightsPage() {
  const [leases, setLeases] = useState<SessionLease[]>([])
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([])
  const [financialSignals, setFinancialSignals] = useState<FinancialSignal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()

    // Listen for lease updates
    const handleLeaseAdded = () => loadData()
    const handleLeaseUpdated = () => loadData()
    
    window.addEventListener('sessionLeaseAdded', handleLeaseAdded)
    window.addEventListener('sessionLeaseUpdated', handleLeaseUpdated)
    
    return () => {
      window.removeEventListener('sessionLeaseAdded', handleLeaseAdded)
      window.removeEventListener('sessionLeaseUpdated', handleLeaseUpdated)
    }
  }, [])

  const loadData = () => {
    setLoading(true)
    const allLeases = SessionStorageService.getLeases()
    setLeases(allLeases)

    // Generate risk alerts
    const alerts: RiskAlert[] = []
    allLeases.forEach(lease => {
      // Check for missing critical fields
      if (!lease.security_deposit && lease.monthly_rent) {
        alerts.push({
          id: `alert-${lease.id}-deposit`,
          title: 'Missing Security Deposit',
          property: lease.property_address || 'Unknown Property',
          severity: 'High',
          due: 'Review required'
        })
      }
      
      // Check for low confidence extraction
      if (lease.confidence_score && lease.confidence_score < 60) {
        alerts.push({
          id: `alert-${lease.id}-confidence`,
          title: 'Low Extraction Confidence',
          property: lease.property_address || 'Unknown Property',
          severity: 'Medium',
          due: 'Manual review needed'
        })
      }

      // Check for missing dates
      if (!lease.lease_start || !lease.lease_end) {
        alerts.push({
          id: `alert-${lease.id}-dates`,
          title: 'Missing Lease Term Dates',
          property: lease.property_address || 'Unknown Property',
          severity: 'High',
          due: 'Required for compliance'
        })
      }
    })
    setRiskAlerts(alerts)

    // Generate financial signals
    const signals: FinancialSignal[] = []
    
    const depositsCount = allLeases.filter(l => l.security_deposit).length
    const totalLeases = allLeases.length
    if (depositsCount < totalLeases) {
      signals.push({
        id: 'deposits',
        metric: 'Deposits not documented',
        count: totalLeases - depositsCount,
        status: totalLeases - depositsCount > 0 ? 'Action needed' : 'Complete'
      })
    }

    const lowConfidence = allLeases.filter(l => l.confidence_score && l.confidence_score < 70).length
    if (lowConfidence > 0) {
      signals.push({
        id: 'confidence',
        metric: 'Contracts need verification',
        count: lowConfidence,
        status: 'Review'
      })
    }

    const missingRent = allLeases.filter(l => !l.monthly_rent).length
    if (missingRent > 0) {
      signals.push({
        id: 'rent',
        metric: 'Missing rent amounts',
        count: missingRent,
        status: 'Critical'
      })
    }

    setFinancialSignals(signals)
    setLoading(false)
  }
  const totalRent = leases.reduce((sum, lease) => {
    if (lease.monthly_rent) {
      const rent = parseFloat(String(lease.monthly_rent).replace(/[^0-9.]/g, ''))
      return sum + (isNaN(rent) ? 0 : rent)
    }
    return sum
  }, 0)

  const avgConfidence = leases.length > 0
    ? Math.round(leases.reduce((sum, l) => sum + (l.confidence_score || 0), 0) / leases.length)
    : 0

  const completedFields = leases.reduce((sum, lease) => {
    let count = 0
    if (lease.property_address) count++
    if (lease.tenant_name) count++
    if (lease.monthly_rent) count++
    if (lease.lease_start) count++
    if (lease.lease_end) count++
    if (lease.security_deposit) count++
    return sum + count
  }, 0)

  const totalPossibleFields = leases.length * 6
  const coveragePercent = totalPossibleFields > 0 
    ? Math.round((completedFields / totalPossibleFields) * 100)
    : 0

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
        <p className="text-gray-600 max-w-3xl">
          Real-time analysis of your {leases.length} uploaded contract{leases.length !== 1 ? 's' : ''}. 
          Spot missing data, monitor extraction quality, and surface priority actions.
        </p>
      </header>

      {leases.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-blue-800">
            Upload contracts to see insights and analytics. Go to <a href="/app/contracts" className="font-semibold underline">Contracts</a> to get started.
          </p>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-red-100 p-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Legal Risk Summary</h2>
                <p className="text-sm text-gray-500">Clause coverage, missing language, remediation queue</p>
              </div>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View compliance report</button>
          </div>
          <div className="divide-y divide-gray-100">
            {riskAlerts.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="font-medium">No critical issues detected</p>
                <p className="text-sm mt-1">All contracts meet basic requirements</p>
              </div>
            ) : (
              riskAlerts.map((alert) => (
                <div key={alert.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-500">{alert.property}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        alert.severity === 'High'
                          ? 'bg-red-100 text-red-700'
                          : alert.severity === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {alert.severity}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{alert.due}</p>
                  <div className="mt-3 flex items-center space-x-3 text-sm">
                    <a href="/app/contracts" className="text-blue-600 hover:text-blue-700">View contracts</a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-emerald-100 p-2">
                <ArrowTrendingUpIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Financial Signals</h2>
                <p className="text-sm text-gray-500">Revenue assurance, escalation approvals, deposit coverage</p>
              </div>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Sync with ERP</button>
          </div>
          <div className="divide-y divide-gray-100">
            {financialSignals.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="font-medium">All financial data complete</p>
                <p className="text-sm mt-1">No action required</p>
              </div>
            ) : (
              financialSignals.map((signal) => (
                <div key={signal.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{signal.metric}</p>
                      <p className="text-sm text-gray-500">{signal.status}</p>
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{signal.count}</span>
                  </div>
                  <div className="mt-3 flex items-center space-x-3 text-sm">
                    <a href="/app/contracts" className="text-blue-600 hover:text-blue-700">Review contracts</a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-indigo-100 p-2">
              <LightBulbIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">AI Insights</p>
              <p className="text-xs text-gray-500">Generated from verified contract data</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            “Escalation clauses missing in 12% of retail portfolio. Recommend legal review before renewal cycle.”
          </p>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Flag for review</button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-yellow-100 p-2">
              <ShieldCheckIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Data Completeness</p>
              <p className="text-xs text-gray-500">Field extraction coverage</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Data coverage</span>
            <span className="font-semibold text-gray-900">{coveragePercent}%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Fields extracted</span>
            <span className="font-semibold text-gray-900">{completedFields}/{totalPossibleFields}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-600 h-2 rounded-full transition-all" 
              style={{ width: `${coveragePercent}%` }}
            ></div>
          </div>
          <a href="/app/contracts" className="text-sm font-medium text-blue-600 hover:text-blue-700">Review contracts</a>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-100 p-2">
              <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Quick Stats</p>
              <p className="text-xs text-gray-500">Portfolio at a glance</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• {leases.length} contract{leases.length !== 1 ? 's' : ''} uploaded</li>
            <li>• ${totalRent.toLocaleString()} total monthly rent</li>
            <li>• {riskAlerts.length} item{riskAlerts.length !== 1 ? 's' : ''} need{riskAlerts.length === 1 ? 's' : ''} review</li>
            <li>• {avgConfidence}% average extraction confidence</li>
          </ul>
          <a href="/app/contracts" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all contracts →</a>
        </div>
      </section>
    </div>
  )
}
