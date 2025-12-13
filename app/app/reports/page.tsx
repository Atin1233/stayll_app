"use client"

import { useState, useEffect } from 'react'
import { CloudArrowDownIcon, ClockIcon, DocumentChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { SessionStorageService, type SessionLease } from '@/lib/sessionStorage'

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
    id: 'contract-list',
    name: 'Contract List',
    description: 'Full list of contracts with key metadata and extraction details.',
  },
]

export default function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(reportTemplates[0].id)
  const [year, setYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [leases, setLeases] = useState<SessionLease[]>([])

  useEffect(() => {
    loadLeases()

    // Listen for lease updates
    const handleLeaseAdded = () => loadLeases()
    const handleLeaseUpdated = () => loadLeases()
    
    window.addEventListener('sessionLeaseAdded', handleLeaseAdded)
    window.addEventListener('sessionLeaseUpdated', handleLeaseUpdated)
    
    return () => {
      window.removeEventListener('sessionLeaseAdded', handleLeaseAdded)
      window.removeEventListener('sessionLeaseUpdated', handleLeaseUpdated)
    }
  }, [])

  const loadLeases = () => {
    const allLeases = SessionStorageService.getLeases()
    setLeases(allLeases)
  }

  const handleExportRentRoll = async () => {
    setLoading(true)
    setError('')
    
    try {
      if (leases.length === 0) {
        setError('No leases available to export. Upload contracts first.')
        return
      }

      // Generate CSV content
      const headers = ['Property Address', 'Tenant Name', 'Monthly Rent', 'Security Deposit', 'Lease Start', 'Lease End', 'Uploaded Date']
      const rows = leases.map(lease => [
        lease.property_address || 'N/A',
        lease.tenant_name || 'N/A',
        lease.monthly_rent || 'N/A',
        lease.security_deposit || 'N/A',
        lease.lease_start || 'N/A',
        lease.lease_end || 'N/A',
        new Date(lease.created_at).toLocaleDateString()
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rent-roll-${new Date().toISOString().split('T')[0]}.csv`
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
      if (leases.length === 0) {
        setError('No leases available to export. Upload contracts first.')
        return
      }

      // Generate iCal content
      const events = leases
        .filter(lease => lease.lease_start || lease.lease_end)
        .flatMap(lease => {
          const events = []
          const property = lease.property_address || 'Unknown Property'
          
          if (lease.lease_start) {
            events.push({
              summary: `Lease Start: ${property}`,
              description: `Tenant: ${lease.tenant_name || 'N/A'}`,
              date: lease.lease_start
            })
          }
          
          if (lease.lease_end) {
            events.push({
              summary: `Lease End: ${property}`,
              description: `Tenant: ${lease.tenant_name || 'N/A'}\\nAction: Review renewal options`,
              date: lease.lease_end
            })
          }
          
          return events
        })

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//STAYLL//Lease Calendar//EN',
        'CALSCALE:GREGORIAN',
        ...events.map((event, i) => [
          'BEGIN:VEVENT',
          `UID:${Date.now()}-${i}@stayll.app`,
          `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
          `DTSTART:${event.date.replace(/[-]/g, '')}`,
          `SUMMARY:${event.summary}`,
          `DESCRIPTION:${event.description}`,
          'END:VEVENT'
        ].join('\n')),
        'END:VCALENDAR'
      ].join('\n')

      // Download iCal
      const blob = new Blob([icsContent], { type: 'text/calendar' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lease-calendar-${new Date().toISOString().split('T')[0]}.ics`
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

  const handleExportContractList = async () => {
    setLoading(true)
    setError('')
    
    try {
      if (leases.length === 0) {
        setError('No contracts available to export. Upload contracts first.')
        return
      }

      // Generate CSV content
      const headers = ['ID', 'Property Address', 'Tenant Name', 'Monthly Rent', 'Lease Start', 'Lease End', 'Security Deposit', 'Late Fee', 'File Name', 'Confidence Score', 'Verification Status', 'Uploaded']
      const rows = leases.map(lease => [
        lease.id,
        lease.property_address || 'N/A',
        lease.tenant_name || 'N/A',
        lease.monthly_rent || 'N/A',
        lease.lease_start || 'N/A',
        lease.lease_end || 'N/A',
        lease.security_deposit || 'N/A',
        lease.late_fee || 'N/A',
        lease.file_name,
        lease.confidence_score ? `${Math.round(lease.confidence_score)}%` : 'N/A',
        lease.verification_status || 'unverified',
        new Date(lease.created_at).toLocaleString()
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `contracts-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export contract list')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = () => {
    if (selectedTemplate === 'rent-roll') {
      handleExportRentRoll()
    } else if (selectedTemplate === 'compliance') {
      handleExportComplianceCalendar()
    } else if (selectedTemplate === 'contract-list') {
      handleExportContractList()
    } else {
      alert('Report type not yet implemented!')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 max-w-3xl">
          Export your {leases.length} uploaded contract{leases.length !== 1 ? 's' : ''} as rent rolls, compliance calendars, or detailed lists. Download as CSV or iCal.
        </p>
      </header>

      {leases.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            Upload contracts to generate reports. Go to <a href="/app/contracts" className="font-semibold underline">Contracts</a> to get started.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
          <button 
            onClick={() => setError('')}
            className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
          >
            Dismiss
          </button>
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
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Portfolio Summary</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Contracts</span>
                <span className="font-semibold text-gray-900">{leases.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">With Rent Data</span>
                <span className="font-semibold text-gray-900">{leases.filter(l => l.monthly_rent).length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">With Lease Dates</span>
                <span className="font-semibold text-gray-900">{leases.filter(l => l.lease_start && l.lease_end).length}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Last Upload</span>
                <span className="font-semibold text-gray-900">
                  {leases.length > 0 
                    ? new Date(Math.max(...leases.map(l => new Date(l.created_at).getTime()))).toLocaleDateString()
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
