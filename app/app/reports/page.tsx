"use client"

import { useState } from 'react'
import { CloudArrowDownIcon, ClockIcon, DocumentChartBarIcon } from '@heroicons/react/24/outline'

const reportTemplates = [
  {
    id: 'rent-roll',
    name: 'Rent Roll',
    description: 'Rent exposure, deposits, and escalation schedules across the portfolio.',
  },
  {
    id: 'compliance',
    name: 'Compliance Coverage',
    description: 'Clause inventory, missing language, and remediation assignments.',
  },
  {
    id: 'risk',
    name: 'Risk Summary',
    description: 'Contract risk scores, flagged obligations, audit readiness checklist.',
  },
]

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(reportTemplates[0].id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 max-w-3xl">
          Generate investor-ready rent rolls, compliance coverage summaries, and risk dashboards. Configure
          parameters, export to PDF/CSV, or schedule recurring delivery.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Templates</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {reportTemplates.map((template) => {
              const isActive = selectedTemplate === template.id
              return (
                <li key={template.id}>
                  <button
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full text-left px-4 py-3 flex flex-col space-y-1 transition-colors ${
                      isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                      {template.name}
                    </span>
                    <span className="text-xs text-gray-500">{template.description}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </aside>

        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">Configure Report</h3>
              <p className="text-sm text-gray-500">
                Choose the slice of the portfolio to include, reporting cadence, and output format.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Properties / Portfolios</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900">
                  <option>All CRE assets</option>
                  <option>Retail portfolio</option>
                  <option>Office + Flex</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date Range</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900">
                  <option>Next 12 months</option>
                  <option>Year to date</option>
                  <option>Custom</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Risk Threshold</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900">
                  <option>Show high + medium</option>
                  <option>High risk only</option>
                  <option>All risk levels</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Output Format</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900">
                  <option>Interactive dashboard</option>
                  <option>PDF (auditor ready)</option>
                  <option>CSV (ERP import)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500">
                <DocumentChartBarIcon className="h-5 w-5 mr-2" />
                Generate Report
              </button>
              <button className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <CloudArrowDownIcon className="h-5 w-5 mr-2" />
                Export Latest
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Scheduled Reports</h3>
              <button className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
                <ClockIcon className="h-4 w-4 mr-1" />
                Add schedule
              </button>
            </div>

            <ul className="divide-y divide-gray-100 text-sm text-gray-600">
              <li className="py-2 flex items-center justify-between">
                <span>Monthly Rent Roll → Finance Team</span>
                <span className="text-gray-400">Next: Mar 1</span>
              </li>
              <li className="py-2 flex items-center justify-between">
                <span>Quarterly Compliance Brief → Legal Ops</span>
                <span className="text-gray-400">Next: Apr 5</span>
              </li>
              <li className="py-2 flex items-center justify-between">
                <span>Risk Snapshot → Executive Team</span>
                <span className="text-gray-400">Next: Friday 9am</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
