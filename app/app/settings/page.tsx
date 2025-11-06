"use client"

import { useState } from 'react'
import {
  UserGroupIcon,
  KeyIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ServerStackIcon,
  AdjustmentsVerticalIcon,
} from '@heroicons/react/24/outline'

const sampleUsers = [
  { id: 1, name: 'Alex Morgan', role: 'Analyst', scope: 'Contracts' },
  { id: 2, name: 'Priya Shah', role: 'Reviewer', scope: 'Legal QA' },
  { id: 3, name: 'Jordan Lee', role: 'Finance', scope: 'Rent roll exports' },
]

const auditTimeline = [
  { id: 1, action: 'FIELD_APPROVED', actor: 'Priya Shah', detail: 'Escalation schedule – Riverside Offices', time: '2 hours ago' },
  { id: 2, action: 'EXPORT_GENERATED', actor: 'Automation', detail: 'Monthly rent roll CSV sent to Finance', time: 'Yesterday' },
  { id: 3, action: 'FIELD_EDITED', actor: 'Alex Morgan', detail: 'Renewal notice updated to 90 days', time: 'Tue 11:15 AM' },
]

export default function SettingsPage() {
  const [showApiKeys, setShowApiKeys] = useState(false)

  const handlePlaceholder = (message: string) => {
    alert(message)
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Control & Configuration</h1>
        <p className="text-gray-600 max-w-3xl">
          Manage users, roles, data schemas, and security policies. Every change is tracked in the immutable audit
          log to preserve financial-grade accuracy.
        </p>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-blue-100 p-2">
                <UserGroupIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Organization & Roles</h2>
                <p className="text-sm text-gray-500">Define access for analysts, legal, finance, and auditors.</p>
              </div>
            </div>
            <button
              onClick={() => handlePlaceholder('User management is coming soon — configure roles in the next build.')} 
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage users
            </button>
          </div>
          <div className="px-6 py-4">
            <table className="w-full text-sm text-left text-gray-600">
              <thead>
                <tr className="text-xs uppercase text-gray-400 border-b border-gray-100">
                  <th className="py-2">Name</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Scope</th>
                  <th className="py-2 text-right">Permissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sampleUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="py-2 font-medium text-gray-900">{user.name}</td>
                    <td className="py-2 text-gray-600">{user.role}</td>
                    <td className="py-2 text-gray-500">{user.scope}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => handlePlaceholder('Role toggles coming soon — tailor view/edit/export access.')} 
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Configure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-indigo-100 p-2">
                <KeyIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">API Keys & Integrations</h2>
                <p className="text-sm text-gray-500">Issue scoped keys for ERP/BI exports with rotating secrets.</p>
              </div>
            </div>
            <button
              onClick={() => setShowApiKeys(!showApiKeys)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              {showApiKeys ? 'Hide keys' : 'Generate key'}
            </button>
          </div>
          <div className="px-6 py-4 space-y-3">
            {showApiKeys ? (
              <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
                API key management is coming soon. Keys will include audit trails, expiry, and scoped permissions
                (read:leases, write:exports, trigger:webhooks).
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                No active integration keys. Generate a key to connect Stayll with ERP systems like Yardi, MRI, or
                QuickBooks.
              </p>
            )}
            <button
              onClick={() => handlePlaceholder('Integration webhooks will be available after QA workflow is complete.')} 
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage webhooks
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-emerald-100 p-2">
                <ShieldCheckIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Security & Compliance</h2>
                <p className="text-sm text-gray-500">KMS encryption, SOC2 posture, and data residency settings.</p>
              </div>
            </div>
            <button
              onClick={() => handlePlaceholder('Security controls will include MFA, SSO (SAML/OIDC), and data residency options.')} 
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Configure
            </button>
          </div>
          <div className="px-6 py-4 text-sm text-gray-600 space-y-2">
            <p>• Field-level encryption via KMS (AES-256) — enabled.</p>
            <p>• SOC2 Type II roadmap — controls captured for audit pack.</p>
            <p>• Data residency defaults to US-East; private deployment available.</p>
            <p>• SSO (SAML/OIDC) integration scheduled post pilot.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-yellow-100 p-2">
                <DocumentTextIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Template & Schema Builder</h2>
                <p className="text-sm text-gray-500">Define required fields per contract type with version control.</p>
              </div>
            </div>
            <button
              onClick={() => handlePlaceholder('Schema builder UI coming soon — map required fields and validation rules.')} 
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Edit schema
            </button>
          </div>
          <div className="px-6 py-4 text-sm text-gray-600 space-y-2">
            <p>• Current schema: CRE Lease v1.3</p>
            <p>• Mandatory fields: base_rent, lease_term, escalation_schedule, insurance_clause</p>
            <p>• Validation rules: escalation &gt;= 2%, renewal_notice ≥ 90 days</p>
            <p>• Next update: Add CAM reconciliation requirements</p>
          </div>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-gray-100 p-2">
              <ServerStackIcon className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Audit log</h2>
              <p className="text-sm text-gray-500">Immutable record of uploads, edits, exports, and API calls.</p>
            </div>
          </div>
          <button
            onClick={() => handlePlaceholder('Audit log export will be available in CSV/PDF format.')} 
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Export log
          </button>
        </div>
        <ul className="divide-y divide-gray-100 text-sm text-gray-600">
          {auditTimeline.map((event) => (
            <li key={event.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-semibold">{event.action}</p>
                <p>{event.detail}</p>
                <p className="text-xs text-gray-400">{event.time}</p>
              </div>
              <span className="text-xs text-gray-500">{event.actor}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="rounded-full bg-purple-100 p-2">
            <AdjustmentsVerticalIcon className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Operational policies</h2>
            <p className="text-sm text-gray-500">SLA thresholds and escalation procedures for accuracy guarantees.</p>
          </div>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <li className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="font-semibold text-gray-900">Processing SLA</p>
            <p className="mt-1 text-sm">95% of contracts processed in under 3 minutes (excluding QA).</p>
          </li>
          <li className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="font-semibold text-gray-900">Accuracy guarantee</p>
            <p className="mt-1 text-sm">Scaling halts if verified accuracy falls below 95% over 500-sample audit.</p>
          </li>
          <li className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="font-semibold text-gray-900">QA turnaround</p>
            <p className="mt-1 text-sm">Flagged contracts must clear human review within 48 hours.</p>
          </li>
          <li className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="font-semibold text-gray-900">Escalation policy</p>
            <p className="mt-1 text-sm">SLA breach triggers automatic audit report + notifications to customer success.</p>
          </li>
        </ul>
      </section>

      <section className="bg-white border border-dashed border-gray-300 rounded-xl shadow-sm p-6 text-sm text-gray-600">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Billing</h2>
        <p>Enterprise billing is handled through the Stripe portal. Contact Stayll support to enable subscription billing and invoice automation.</p>
      </section>
    </div>
  )
} 