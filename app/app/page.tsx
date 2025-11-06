'use client'

import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState } from 'react'

const metrics = [
  {
    name: 'Active leases',
    value: '82',
    change: 'Portfolio total',
    icon: ShieldCheckIcon,
    href: '/app/contracts?filter=active',
  },
  {
    name: 'Upcoming renewals',
    value: '9',
    change: 'Within next 90 days',
    icon: ClockIcon,
    href: '/app/insights?tab=obligations',
  },
  {
    name: 'Contracts needing review',
    value: '12',
    change: 'Pending analyst approval',
    icon: ExclamationTriangleIcon,
    href: '/app/contracts#qa',
  },
  {
    name: 'Verified contracts',
    value: '18',
    change: '+3 this week',
    icon: ShieldCheckIcon,
    href: '/app/contracts?filter=verified',
  },
]

const analyticsSelections = ['Last 6M', 'Last 12M', 'Custom'] as const

const rentDistribution = [
  { label: 'Retail', value: 45 },
  { label: 'Office', value: 32 },
  { label: 'Industrial', value: 18 },
  { label: 'Other', value: 5 },
]

const expiryTimeline = [
  { year: '2024', value: 6 },
  { year: '2025', value: 12 },
  { year: '2026', value: 18 },
  { year: '2027', value: 9 },
]

const riskTrend = [
  { month: 'Jul', value: 78 },
  { month: 'Aug', value: 80 },
  { month: 'Sep', value: 83 },
  { month: 'Oct', value: 85 },
  { month: 'Nov', value: 87 },
  { month: 'Dec', value: 89 },
]

const pipeline = [
  { stage: 'Ingestion', count: 4, status: 'Uploaded in last 24h' },
  { stage: 'Extraction', count: 2, status: 'Processing with Stayll AI' },
  { stage: 'Validation', count: 5, status: 'Deterministic rules applied' },
  { stage: 'QA review', count: 3, status: 'Waiting for analyst approval' },
]

const qaTasks = [
  {
    id: 'task-1',
    contract: '125 Market Street',
    field: 'Insurance coverage',
    severity: 'High risk – missing clause',
  },
  {
    id: 'task-2',
    contract: 'Sunset Plaza Retail',
    field: 'Escalation schedule',
    severity: 'Review adjustment',
  },
  {
    id: 'task-3',
    contract: 'Riverside Offices',
    field: 'Renewal notice period',
    severity: 'Verify dates',
  },
]

const obligations = [
  { id: 'obl-1', type: 'Rent escalation', property: 'Sunset Plaza', due: 'Mar 31', owner: 'Finance' },
  { id: 'obl-2', type: 'Renewal notice', property: '125 Market Street', due: 'Apr 15', owner: 'Legal' },
  { id: 'obl-3', type: 'Deposit audit', property: 'Riverside Offices', due: 'Apr 30', owner: 'Finance' },
]

const assistantPrompts = [
  'Summarize leases expiring before 2026',
  'Show tenants with missing escalation clauses',
  'What rent is due next quarter?',
]

const recentContracts = [
  {
    id: 'contract-1',
    name: 'Sunset Plaza Retail LT',
    property: 'Sunset Plaza',
    type: 'Lease',
    status: 'In review',
    statusTone: 'yellow',
    updated: 'Nov 5, 2025 • 3:12 PM',
  },
  {
    id: 'contract-2',
    name: 'Riverside Offices Master Lease',
    property: 'Riverside Offices',
    type: 'Lease',
    status: 'Verified',
    statusTone: 'green',
    updated: 'Nov 4, 2025 • 11:02 AM',
  },
  {
    id: 'contract-3',
    name: 'Alpha Plaza Security Services',
    property: 'Alpha Plaza',
    type: 'Vendor',
    status: 'Extraction error',
    statusTone: 'red',
    updated: 'Nov 3, 2025 • 5:48 PM',
  },
  {
    id: 'contract-4',
    name: 'Market Street Anchor Tenant',
    property: '125 Market Street',
    type: 'Lease',
    status: 'Verified',
    statusTone: 'green',
    updated: 'Nov 2, 2025 • 9:30 AM',
  },
]

export default function DashboardPage() {
  const [analyticsRange, setAnalyticsRange] = useState<typeof analyticsSelections[number]>('Last 6M')

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Stayll Intelligence Center</h1>
        <p className="text-gray-600 max-w-3xl">
          Financial-grade contract operations at a glance. Track ingestion, QA accuracy, compliance coverage, and
          upcoming obligations across the portfolio.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/app/contracts"
            className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500"
          >
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            Upload contract
          </Link>
          <Link
            href="/app/contracts#qa"
            className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
            Open QA queue
          </Link>
          <Link
            href="/app/reports"
            className="inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <DocumentChartBarIcon className="h-5 w-5 mr-2 text-gray-500" />
            Generate report
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:border-blue-200 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{item.name}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{item.value}</p>
                <p className="mt-1 text-xs text-gray-500">{item.change}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <item.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Portfolio summary</h2>
            <p className="text-sm text-gray-500">Financial and risk performance based on verified data.</p>
          </div>
          <div className="flex items-center gap-2">
            {analyticsSelections.map((option) => (
              <button
                key={option}
                onClick={() => setAnalyticsRange(option)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  analyticsRange === option
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Rent distribution</h3>
            <div className="space-y-2">
              {rentDistribution.map((slice) => (
                <div key={slice.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{slice.label}</span>
                    <span>{slice.value}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: `${slice.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Lease expiration timeline</h3>
            <div className="flex items-end gap-3 h-32">
              {expiryTimeline.map((item) => (
                <div key={item.year} className="flex-1">
                  <div
                    className="bg-indigo-400 rounded-t-md"
                    style={{ height: `${item.value * 6}px` }}
                    title={`${item.value} expirations`}
                  />
                  <p className="mt-1 text-xs text-center text-gray-500">{item.year}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Risk score trend</h3>
            <div className="relative h-32">
              <svg viewBox="0 0 160 100" className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  points={riskTrend
                    .map((point, index) => `${(index / (riskTrend.length - 1)) * 160},${100 - (point.value / 100) * 100}`)
                    .join(' ')}
                />
                {riskTrend.map((point, index) => (
                  <g key={point.month}>
                    <circle
                      cx={(index / (riskTrend.length - 1)) * 160}
                      cy={100 - (point.value / 100) * 100}
                      r="3"
                      fill="#2563EB"
                    />
                    <text x={(index / (riskTrend.length - 1)) * 160} y="98" textAnchor="middle" fontSize="8" fill="#6B7280">
                      {point.month}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="absolute top-0 right-0 text-xs text-gray-500">Avg score {riskTrend.at(-1)?.value}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Ingestion pipeline</h2>
                <p className="text-sm text-gray-500">Every contract step from upload to verification.</p>
              </div>
              <Link href="/app/contracts" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                View contracts
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pipeline.map((stage) => (
                <div key={stage.stage} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <p className="text-sm font-semibold text-gray-900">{stage.stage}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">{stage.count}</p>
                  <p className="mt-1 text-xs text-gray-500">{stage.status}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="qa" className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">QA queue</h2>
                <p className="text-sm text-gray-500">Contracts flagged for human verification.</p>
              </div>
              <Link href="/app/contracts#qa" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Manage tasks
              </Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {qaTasks.map((task) => (
                <li key={task.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{task.contract}</p>
                    <p className="text-sm text-gray-500">{task.field}</p>
                    <p className="text-xs text-yellow-600">{task.severity}</p>
                  </div>
                  <Link
                    href="/app/contracts#qa"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Review
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Compliance coverage</h2>
                <p className="text-sm text-gray-500">Clause inventory, missing language, remediation status.</p>
              </div>
              <Link href="/app/insights" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Open insights
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-gray-100 p-4 bg-green-50">
                <p className="text-xs text-gray-600">Coverage</p>
                <p className="text-2xl font-semibold text-gray-900">84%</p>
                <p className="text-xs text-gray-500">Contracts meeting schema</p>
              </div>
              <div className="rounded-lg border border-gray-100 p-4 bg-yellow-50">
                <p className="text-xs text-gray-600">Missing clauses</p>
                <p className="text-2xl font-semibold text-gray-900">7</p>
                <p className="text-xs text-gray-500">Legal remediation queue</p>
              </div>
              <div className="rounded-lg border border-gray-100 p-4 bg-blue-50">
                <p className="text-xs text-gray-600">Audit ready</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
                <p className="text-xs text-gray-500">Evidence packs generated</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Upcoming obligations</h2>
            <p className="text-sm text-gray-500 mb-4">Renewals, escalations, and compliance deadlines.</p>
            <ul className="space-y-3 text-sm text-gray-600">
              {obligations.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{item.type}</p>
                    <p>{item.property}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{item.due}</p>
                    <p className="text-xs text-gray-500">Owner: {item.owner}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/app/insights" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
              View calendar
            </Link>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="rounded-full bg-purple-100 p-2">
                <SparklesIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Ask Stayll</h2>
                <p className="text-sm text-gray-500">Conversational analytics on verified lease data.</p>
              </div>
            </div>
            <ul className="space-y-2">
              {assistantPrompts.map((prompt) => (
                <li key={prompt} className="text-sm text-gray-600">
                  • {prompt}
                </li>
              ))}
            </ul>
            <button
              onClick={() => alert('Ask Stayll is coming soon — connect to the conversational assistant in the next milestone.')}
              className="mt-4 inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500"
            >
              Launch assistant
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="rounded-full bg-gray-100 p-2">
                <UserGroupIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Team activity</h2>
                <p className="text-sm text-gray-500">Latest approvals and edits from analysts.</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Alex verified rent schedule for 125 Market Street</li>
              <li>• Priya flagged missing insurance clause in Sunset Plaza</li>
              <li>• Finance approved escalation sync for Riverside Offices</li>
            </ul>
            <Link href="/app/settings" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
              View audit log
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent contracts</h2>
            <p className="text-sm text-gray-500">Latest activity from Stayll ingestion pipeline.</p>
          </div>
          <Link href="/app/contracts" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400">
              <tr>
                <th className="px-4 py-3">Contract</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentContracts.map((contract) => (
                <tr key={contract.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link href={`/app/contracts?contract=${contract.id}`} className="hover:text-blue-600">
                      {contract.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{contract.property}</td>
                  <td className="px-4 py-3 text-gray-600">{contract.type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        contract.statusTone === 'green'
                          ? 'bg-green-100 text-green-700'
                          : contract.statusTone === 'yellow'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {contract.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{contract.updated}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/app/contracts?contract=${contract.id}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
} 