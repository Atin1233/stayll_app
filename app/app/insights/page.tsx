"use client"

import { LightBulbIcon, ExclamationTriangleIcon, ShieldCheckIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline'

const riskAlerts = [
  {
    id: 1,
    title: 'Missing Insurance Clause',
    property: '125 Market Street',
    severity: 'High',
    due: 'Review required',
  },
  {
    id: 2,
    title: 'Escalation language inconsistent',
    property: 'Sunset Plaza Retail',
    severity: 'Medium',
    due: 'Legal QA queued',
  },
]

const financialSignals = [
  {
    id: 1,
    metric: 'Rent escalations pending approval',
    count: 4,
    status: 'Action needed',
  },
  {
    id: 2,
    metric: 'Deposits not reconciled',
    count: 2,
    status: 'Review',
  },
]

export default function InsightsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
        <p className="text-gray-600 max-w-3xl">
          Centralize legal, finance, and operational signals. Spot missing clauses, monitor escalation coverage,
          and surface priority actions before they become expensive.
        </p>
      </header>

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
            {riskAlerts.map((alert) => (
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
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{alert.due}</p>
                <div className="mt-3 flex items-center space-x-3 text-sm">
                  <button className="text-blue-600 hover:text-blue-700">Open contract</button>
                  <span className="text-gray-300">•</span>
                  <button className="text-blue-600 hover:text-blue-700">Assign legal analyst</button>
                </div>
              </div>
            ))}
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
            {financialSignals.map((signal) => (
              <div key={signal.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{signal.metric}</p>
                    <p className="text-sm text-gray-500">{signal.status}</p>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{signal.count}</span>
                </div>
                <div className="mt-3 flex items-center space-x-3 text-sm">
                  <button className="text-blue-600 hover:text-blue-700">Review</button>
                  <span className="text-gray-300">•</span>
                  <button className="text-blue-600 hover:text-blue-700">Approve escalations</button>
                </div>
              </div>
            ))}
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
              <p className="text-sm font-semibold text-gray-900">Compliance Coverage</p>
              <p className="text-xs text-gray-500">Clause inventory and remediation progress</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Contracts meeting coverage</span>
            <span className="font-semibold text-gray-900">84%</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Open remediation tasks</span>
            <span className="font-semibold text-gray-900">7</span>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View missing clauses</button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-blue-100 p-2">
              <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Portfolio Watchlist</p>
              <p className="text-xs text-gray-500">Expirations, escalations, rent exposure</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• 6 leases expiring before Q2 2026</li>
            <li>• $420K quarterly rent due next 90 days</li>
            <li>• 2 escalation reviews pending approval</li>
          </ul>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Open dashboard</button>
        </div>
      </section>
    </div>
  )
}
