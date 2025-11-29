'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Switch } from '@headlessui/react'
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CloudArrowUpIcon,
  UserGroupIcon,
  ClockIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  LockClosedIcon,
  BoltIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline'

const metrics = [
  {
    name: 'Active leases',
    value: '82',
    change: 'Portfolio total',
    icon: BuildingOffice2Icon,
    href: '/app/contracts?filter=active',
  },
  {
    name: 'Upcoming renewals',
    value: '9',
    change: 'Within 90 days',
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
] as const

const analyticsSelections = ['Last 6M', 'Last 12M', 'Custom'] as const

const rentDistribution = [
  { label: 'Retail', value: 45 },
  { label: 'Office', value: 32 },
  { label: 'Industrial', value: 18 },
  { label: 'Other', value: 5 },
] as const

const riskTrend = [
  { month: 'Jul', value: 78 },
  { month: 'Aug', value: 80 },
  { month: 'Sep', value: 83 },
  { month: 'Oct', value: 85 },
  { month: 'Nov', value: 87 },
  { month: 'Dec', value: 89 },
] as const

const pipeline = [
  { stage: 'Ingestion', count: 4, status: 'Uploaded last 24h' },
  { stage: 'Extraction', count: 2, status: 'Processing with Stayll AI' },
  { stage: 'Validation', count: 5, status: 'Deterministic rules applied' },
  { stage: 'QA review', count: 3, status: 'Waiting for analyst approval' },
] as const

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
] as const

const obligations = [
  { id: 'obl-1', type: 'Rent escalation', property: 'Sunset Plaza', due: 'Mar 31', owner: 'Finance' },
  { id: 'obl-2', type: 'Renewal notice', property: '125 Market Street', due: 'Apr 15', owner: 'Legal' },
  { id: 'obl-3', type: 'Deposit audit', property: 'Riverside Offices', due: 'Apr 30', owner: 'Finance' },
] as const

const assistantPrompts = [
  'Summarize leases expiring before 2026',
  'Highlight tenants with missing escalation clauses',
  'Project rent due next quarter',
] as const

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
] as const

const governanceControls = [
  {
    title: 'Role coverage',
    detail: 'Analyst, reviewer, auditor mapped across 5 org units',
    value: '100% mapped',
    tone: 'positive' as const,
    icon: ShieldCheckIcon,
  },
  {
    title: 'MFA enforcement',
    detail: 'Admins & org owners using hardware keys',
    value: 'Active',
    tone: 'positive' as const,
    icon: LockClosedIcon,
  },
  {
    title: 'API keys lifecycle',
    detail: '2 active service keys, 0 stale tokens',
    value: 'Rotate in 25 days',
    tone: 'warning' as const,
    icon: BoltIcon,
  },
] as const

const infrastructureSignals = [
  { name: 'Processing SLA', value: '2m 04s', delta: '-11% vs last week', tone: 'positive' as const },
  { name: 'Extraction accuracy', value: '97.3%', delta: '+0.6% verified', tone: 'positive' as const },
  { name: 'AI retries', value: '3', delta: '2 awaiting human QA', tone: 'warning' as const },
] as const

const complianceSignals = [
  { label: 'Insurance coverage clauses', status: 'Verified', tone: 'positive' as const },
  { label: 'Escalation tables', status: 'Pending review', tone: 'warning' as const },
  { label: 'Deposit obligations', status: 'On track', tone: 'positive' as const },
] as const

type Tone = 'positive' | 'warning' | 'critical' | 'neutral'

const toneClasses: Record<Tone, string> = {
  positive: 'border border-emerald-100 bg-emerald-50 text-emerald-700',
  warning: 'border border-amber-100 bg-amber-50 text-amber-700',
  critical: 'border border-rose-100 bg-rose-50 text-rose-700',
  neutral: 'border border-slate-200 bg-slate-100 text-slate-600',
}

const cardVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
}

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

function StatusBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  )
}

function ToggleRow({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string
  description: string
  enabled: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={classNames(
          enabled ? 'bg-blue-600' : 'bg-slate-200',
          'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-4' : 'translate-x-0',
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out',
          )}
        />
      </Switch>
    </div>
  )
}

function getSeverityTone(severity: string): Tone {
  if (severity.toLowerCase().includes('high')) return 'critical'
  if (severity.toLowerCase().includes('verify')) return 'warning'
  return 'neutral'
}

export default function DashboardPage() {
  const [analyticsRange, setAnalyticsRange] = useState<typeof analyticsSelections[number]>('Last 6M')
  const [autoEscalations, setAutoEscalations] = useState(true)
  const [auditHold, setAuditHold] = useState(false)

  const riskDelta = useMemo(() => {
    const first = riskTrend[0]?.value ?? 0
    const last = riskTrend[riskTrend.length - 1]?.value ?? 0
    return last - first
  }, [])

  return (
    <div className="mx-auto max-w-[1420px] space-y-12 text-slate-800">
      <section className="grid grid-cols-12 gap-6">
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.35 }}
          whileHover={{ y: -4 }}
          className="col-span-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm xl:col-span-7"
        >
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Executive overview
              </span>
              <h1 className="text-[22px] font-semibold text-slate-900 sm:text-[24px]">Stayll Intelligence Center</h1>
              <p className="max-w-xl text-sm leading-6 text-slate-600">
                Financial-grade contract operations at a glance. Monitor ingestion health, QA accuracy, compliance
                coverage, and obligations across the portfolio.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
            {analyticsSelections.map((option) => (
              <button
                key={option}
                onClick={() => setAnalyticsRange(option)}
                    className={classNames(
                      'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                  analyticsRange === option
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-blue-600',
                    )}
              >
                {option}
              </button>
            ))}
          </div>
              <div className="flex gap-2">
                <Link
                  href="/app/contracts"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-500"
                >
                  <CloudArrowUpIcon className="h-4 w-4" />
                  Upload
                </Link>
                <Link
                  href="/app/contracts#qa"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600"
                >
                  <ExclamationTriangleIcon className="h-4 w-4 text-amber-500" />
                  QA queue
                </Link>
                </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-12 gap-6">
            <div className="col-span-12 space-y-6 lg:col-span-7">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {metrics.map((metric) => (
                  <Link
                    key={metric.name}
                    href={metric.href}
                    className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-blue-200 hover:bg-white"
                  >
                    <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-slate-500">
                      <span>{metric.name}</span>
                      <span className="rounded-full bg-white p-1 shadow-sm text-blue-600">
                        <metric.icon className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-3 text-[22px] font-semibold text-slate-900">{metric.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{metric.change}</p>
                  </Link>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {infrastructureSignals.map((signal) => (
                  <div key={signal.name} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{signal.name}</p>
                    <div className="mt-2 flex items-baseline justify-between">
                      <p className="text-lg font-semibold text-slate-900">{signal.value}</p>
                      <StatusBadge tone={signal.tone}>{signal.delta}</StatusBadge>
                    </div>
                </div>
              ))}
            </div>
          </div>

            <div className="col-span-12 space-y-4 lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5 shadow-inner">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Risk trajectory</p>
                    <p className="text-xs text-slate-500">Model confidence vs manual QA</p>
                  </div>
                  <StatusBadge tone={riskDelta >= 0 ? 'positive' : 'critical'}>
                    {riskDelta >= 0 ? `+${riskDelta} pts` : `${riskDelta} pts`}
                  </StatusBadge>
                </div>
                <div className="relative mt-4 h-40">
                  <svg viewBox="0 0 160 100" className="h-full w-full">
                    <defs>
                      <linearGradient id="riskLine" x1="0%" x2="100%" y1="0%" y2="0%">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>
                <polyline
                  fill="none"
                      stroke="url(#riskLine)"
                      strokeWidth="2.5"
                  points={riskTrend
                        .map(
                          (point, index) =>
                            `${(index / (riskTrend.length - 1)) * 160},${100 - (point.value / 100) * 90 - 5}`,
                        )
                    .join(' ')}
                />
                {riskTrend.map((point, index) => (
                  <g key={point.month}>
                    <circle
                      cx={(index / (riskTrend.length - 1)) * 160}
                          cy={100 - (point.value / 100) * 90 - 5}
                      r="3"
                      fill="#2563EB"
                          stroke="white"
                          strokeWidth="1"
                    />
                        <text
                          x={(index / (riskTrend.length - 1)) * 160}
                          y={96}
                          textAnchor="middle"
                          fontSize="8"
                          fill="#64748B"
                        >
                      {point.month}
                    </text>
                  </g>
                ))}
              </svg>
        </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Portfolio mix</p>
                    <p className="text-xs text-slate-500">Rent distribution by asset type</p>
            </div>
                  <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="mt-4 space-y-3">
                  {rentDistribution.map((slice) => (
                    <div key={slice.label}>
                      <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                        <span>{slice.label}</span>
                        <span>{slice.value}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${slice.value}%` }} />
                      </div>
                </div>
              ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="col-span-12 grid gap-6 xl:col-span-5">
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.35, delay: 0.05 }}
            whileHover={{ y: -4 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Quality monitor</p>
                <p className="text-xs text-slate-500">Contracts flagged for human verification</p>
              </div>
              <StatusBadge tone="warning">{qaTasks.length} open</StatusBadge>
            </div>
            <ul className="mt-4 divide-y divide-slate-100">
              {qaTasks.map((task) => (
                <li key={task.id} className="flex items-start justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{task.contract}</p>
                    <p className="text-xs text-slate-500">{task.field}</p>
                  </div>
                  <StatusBadge tone={getSeverityTone(task.severity)}>{task.severity}</StatusBadge>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-end">
              <Link href="/app/contracts#qa" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Manage queue →
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.35, delay: 0.12 }}
            whileHover={{ y: -4 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Upcoming obligations</p>
                <p className="text-xs text-slate-500">Renewals, escalations, compliance deadlines</p>
              </div>
              <ClockIcon className="h-5 w-5 text-blue-500" />
            </div>
            <ul className="mt-4 space-y-3">
              {obligations.map((obl) => (
                <li key={obl.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{obl.type}</p>
                    <p className="text-xs text-slate-500">{obl.property}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{obl.due}</p>
                    <p className="text-xs text-slate-500">Owner: {obl.owner}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-end">
              <Link href="/app/insights" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View calendar →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="space-y-8 border-t border-slate-200 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Data infrastructure
            </span>
            <h2 className="text-[18px] font-semibold text-slate-900">Workflow & governance</h2>
          </div>
          <Link href="/app/insights" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            Open insights →
            </Link>
          </div>

        <div className="grid grid-cols-12 gap-6">
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.35, delay: 0.05 }}
            whileHover={{ y: -4 }}
            className="col-span-12 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Ingestion pipeline</p>
                  <StatusBadge tone="neutral">
                    {pipeline.reduce((acc, stage) => acc + stage.count, 0)} in-flight
                  </StatusBadge>
                </div>
                <div className="mt-4 space-y-4">
                  {pipeline.map((stage, index) => (
                    <div key={stage.stage} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-900 shadow-sm">
                        {stage.count}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {stage.stage}
                        </p>
                        <p className="text-xs text-slate-500">{stage.status}</p>
                      </div>
                      {index < pipeline.length - 1 && (
                        <div className="hidden flex-1 border-t border-dashed border-slate-200 sm:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">Compliance coverage</p>
                  <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {complianceSignals.map((signal) => (
                    <div key={signal.label} className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
                      <p className="text-xs font-medium text-slate-500">{signal.label}</p>
                      <div className="mt-2">
                        <StatusBadge tone={signal.tone}>{signal.status}</StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Ask Stayll</p>
                  <p className="text-xs text-slate-500">Conversational analytics on verified lease data</p>
                </div>
                <SparklesIcon className="h-5 w-5 text-purple-500" />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {assistantPrompts.map((prompt) => (
                  <div
                    key={prompt}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs text-slate-600 shadow-sm"
                  >
                    {prompt}
                  </div>
              ))}
              </div>
            <button
                onClick={() =>
                  alert(
                    'Ask Stayll is coming soon — connect to the conversational assistant in the next milestone.',
                  )
                }
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
            >
              Launch assistant
            </button>
          </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.35, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="col-span-12 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4"
          >
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Governance</p>
                <UserGroupIcon className="h-5 w-5 text-blue-500" />
              </div>
              <div className="mt-4 space-y-5">
                {governanceControls.map((control) => (
                  <div key={control.title} className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-blue-600">
                        <control.icon className="h-5 w-5" />
                      </span>
              <div>
                        <p className="text-sm font-semibold text-slate-900">{control.title}</p>
                        <p className="text-xs text-slate-500">{control.detail}</p>
                      </div>
                    </div>
                    <StatusBadge tone={control.tone}>{control.value}</StatusBadge>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Controls</p>
              <div className="mt-3 space-y-4">
                <ToggleRow
                  label="Auto escalate overdue renewals"
                  description="Send alerts to org admins 14 days before breach."
                  enabled={autoEscalations}
                  onChange={setAutoEscalations}
                />
                <ToggleRow
                  label="Audit hold mode"
                  description="Freeze edits while quarterly audit is in review."
                  enabled={auditHold}
                  onChange={setAuditHold}
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Team activity</p>
              <ul className="mt-3 space-y-2 text-xs text-slate-600">
              <li>• Alex verified rent schedule for 125 Market Street</li>
              <li>• Priya flagged missing insurance clause in Sunset Plaza</li>
              <li>• Finance approved escalation sync for Riverside Offices</li>
            </ul>
              <Link
                href="/app/settings"
                className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View audit log →
            </Link>
          </div>
          </motion.div>
        </div>
      </section>

      <motion.section
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.35, delay: 0.05 }}
        whileHover={{ y: -4 }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Recent contracts</p>
            <p className="text-xs text-slate-500">Latest activity from the Stayll ingestion pipeline</p>
          </div>
          <Link href="/app/contracts" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Contract</th>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Last updated</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] leading-5">
              {recentContracts.map((contract) => {
                const tone: Tone =
                  contract.statusTone === 'green'
                    ? 'positive'
                    : contract.statusTone === 'yellow'
                    ? 'warning'
                    : 'critical'

                return (
                  <tr key={contract.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                    <Link href={`/app/contracts?contract=${contract.id}`} className="hover:text-blue-600">
                      {contract.name}
                    </Link>
                  </td>
                    <td className="px-4 py-3 text-slate-600">{contract.property}</td>
                    <td className="px-4 py-3 text-slate-600">{contract.type}</td>
                  <td className="px-4 py-3">
                      <StatusBadge tone={tone}>{contract.status}</StatusBadge>
                  </td>
                    <td className="px-4 py-3 text-slate-500">{contract.updated}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/app/contracts?contract=${contract.id}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  )
} 
