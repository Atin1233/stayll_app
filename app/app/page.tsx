'use client'

import {
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  UserGroupIcon,
  ClockIcon,
  DocumentChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const metrics = [
  {
    name: 'Verified contracts',
    value: '18',
    change: '+3 this week',
    icon: ShieldCheckIcon,
    href: '/app/contracts',
  },
  {
    name: 'Fields awaiting QA',
    value: '12',
    change: '4 flagged for legal',
    icon: ExclamationTriangleIcon,
    href: '/app/contracts',
  },
  {
    name: 'Monthly rent exposure',
    value: '$1.2M',
    change: 'next 90 days',
    icon: ArrowTrendingUpIcon,
    href: '/app/insights',
  },
  {
    name: 'Compliance coverage',
    value: '84%',
    change: 'clause inventory complete',
    icon: ShieldCheckIcon,
    href: '/app/insights',
  },
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

export default function DashboardPage() {
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
    </div>
  )
} 