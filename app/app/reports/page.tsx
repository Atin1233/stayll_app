"use client"

import { useState } from 'react'
import { CloudArrowDownIcon, ClockIcon, DocumentChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline'

const reportTemplates = [
  {
    id: 'rent-roll',
    name: 'Rent Roll',
    description: 'Rent exposure, deposits, and escalation schedules across the portfolio.',
  },
  {
    id: 'compliance',
    name: 'Compliance Calendar',
    description: 'Renewals, expirations, and notice dates for calendar integration.',
  },
  {
    id: 'risk',
    name: 'Risk Summary',
    description: 'Contract risk scores, flagged obligations, audit readiness checklist.',
  },
]

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(reportTemplates[0].id)
  const [year, setYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleExportRentRoll = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/v5/analytics/rent-roll?year=${year}&format=csv`)
      
      if (!response.ok) {
        throw new Error('Failed to generate rent roll')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rent-roll-${year}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export rent roll')
    } finally {
      setLoading(false)
    }
  }

  const handleExportComplianceCalendar = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/v5/compliance/calendar?format=ics`)
      
      if (!response.ok) {
        throw new Error('Failed to generate compliance calendar')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `compliance-calendar-${new Date().getFullYear()}.ics`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export compliance calendar')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = () => {
    if (selectedTemplate === 'rent-roll') {
      handleExportRentRoll()
    } else if (selectedTemplate === 'compliance') {
      handleExportComplianceCalendar()
    } else {
      alert('Risk Summary report coming soon!')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 max-w-3xl">
          Generate investor-ready rent rolls, compliance calendars, and risk dashboards. Export to CSV, iCal, or PDF.
        </p>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

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

            {selectedTemplate === 'rent-roll' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const y = new Date().getFullYear() + i
                      return (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      )
                    })}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Output Format</label>
                  <select
                    defaultValue="csv"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                  >
                    <option value="csv">CSV (ERP import)</option>
                    <option value="json" disabled>JSON (API)</option>
                  </select>
                </div>
              </div>
            )}

            {selectedTemplate === 'compliance' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Output Format</label>
                <select
                  defaultValue="ics"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm text-gray-900"
                >
                  <option value="ics">iCal (Calendar integration)</option>
                  <option value="csv">CSV</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Export renewals, expirations, and notice dates for calendar integration
                </p>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-4">
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : selectedTemplate === 'compliance' ? (
                  <>
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Export Calendar
                  </>
                ) : (
                  <>
                    <DocumentChartBarIcon className="h-5 w-5 mr-2" />
                    Generate Report
                  </>
                )}
              </button>
              {selectedTemplate === 'rent-roll' && (
                <button
                  onClick={handleExportRentRoll}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-2 rounded-md border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CloudArrowDownIcon className="h-5 w-5 mr-2" />
                  Export Latest CSV
                </button>
              )}
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
                <span className="text-gray-400">Next: {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </li>
              <li className="py-2 flex items-center justify-between">
                <span>Quarterly Compliance Brief → Legal Ops</span>
                <span className="text-gray-400">Next: {new Date(new Date().setMonth(new Date().getMonth() + 3)).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
