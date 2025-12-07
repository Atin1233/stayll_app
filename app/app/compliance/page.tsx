"use client"

import { useEffect, useState } from 'react'
import { CalendarIcon, BellAlertIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import type { Lease } from '@/types/v5.0'
import { LeaseStorageService } from '@/lib/v5/leaseStorage'

interface ComplianceEvent {
  id: string
  type: 'renewal' | 'expiration' | 'notice_deadline' | 'escalation' | 'option_exercise'
  title: string
  date: string
  daysUntil: number
  leaseId: string
  propertyAddress?: string
  tenantName?: string
  priority: 'high' | 'medium' | 'low'
  actionRequired: string
}

export default function CompliancePage() {
  const [events, setEvents] = useState<ComplianceEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [timeframe, setTimeframe] = useState<'30' | '90' | '180' | '365'>('90')

  useEffect(() => {
    loadComplianceEvents()
  }, [timeframe])

  const loadComplianceEvents = async () => {
    try {
      const result = await LeaseStorageService.fetchLeases()
      if (result.success && result.leases) {
        const complianceEvents = generateComplianceEvents(result.leases)
        setEvents(complianceEvents)
      }
    } catch (error) {
      console.error('Failed to load compliance events:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateComplianceEvents = (leases: Lease[]): ComplianceEvent[] => {
    const events: ComplianceEvent[] = []
    const now = new Date()
    const timeframeEnd = new Date(now.getTime() + parseInt(timeframe) * 24 * 60 * 60 * 1000)

    leases.forEach(lease => {
      // Lease expiration events
      if (lease.lease_end) {
        const endDate = new Date(lease.lease_end)
        const daysUntil = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (endDate >= now && endDate <= timeframeEnd) {
          // Notice deadline (typically 90 days before expiration)
          const noticeDeadline = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000)
          const daysUntilNotice = Math.ceil((noticeDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

          if (noticeDeadline >= now && noticeDeadline <= timeframeEnd) {
            events.push({
              id: `${lease.id}-notice`,
              type: 'notice_deadline',
              title: 'Renewal Notice Deadline',
              date: noticeDeadline.toISOString().split('T')[0],
              daysUntil: daysUntilNotice,
              leaseId: lease.id,
              propertyAddress: lease.property_address,
              tenantName: lease.tenant_name,
              priority: daysUntilNotice <= 30 ? 'high' : daysUntilNotice <= 60 ? 'medium' : 'low',
              actionRequired: 'Send renewal notice to tenant',
            })
          }

          // Lease expiration
          events.push({
            id: `${lease.id}-expiration`,
            type: 'expiration',
            title: 'Lease Expiration',
            date: lease.lease_end,
            daysUntil,
            leaseId: lease.id,
            propertyAddress: lease.property_address,
            tenantName: lease.tenant_name,
            priority: daysUntil <= 60 ? 'high' : daysUntil <= 120 ? 'medium' : 'low',
            actionRequired: 'Prepare for lease renewal or new tenant',
          })
        }
      }

      // Escalation events (mock data - would come from extracted escalation clauses)
      if (lease.analysis_data?.escalations && Array.isArray(lease.analysis_data.escalations)) {
        lease.analysis_data.escalations.forEach((escalation: any, index: number) => {
          if (escalation.effective_date) {
            const escalationDate = new Date(escalation.effective_date)
            const daysUntil = Math.ceil((escalationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

            if (escalationDate >= now && escalationDate <= timeframeEnd) {
              events.push({
                id: `${lease.id}-escalation-${index}`,
                type: 'escalation',
                title: `Rent Escalation: ${escalation.type || 'Unknown'}`,
                date: escalation.effective_date,
                daysUntil,
                leaseId: lease.id,
                propertyAddress: lease.property_address,
                tenantName: lease.tenant_name,
                priority: daysUntil <= 30 ? 'high' : daysUntil <= 60 ? 'medium' : 'low',
                actionRequired: `Apply ${escalation.value || 'N/A'} escalation to rent`,
              })
            }
          }
        })
      }
    })

    // Sort by date
    return events.sort((a, b) => a.daysUntil - b.daysUntil)
  }

  const getFilteredEvents = () => {
    if (filter === 'all') return events
    return events.filter(e => e.priority === filter)
  }

  const filteredEvents = getFilteredEvents()

  const stats = {
    total: events.length,
    high: events.filter(e => e.priority === 'high').length,
    medium: events.filter(e => e.priority === 'medium').length,
    low: events.filter(e => e.priority === 'low').length,
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'notice_deadline':
        return <BellAlertIcon className="h-5 w-5" />
      case 'expiration':
        return <CalendarIcon className="h-5 w-5" />
      case 'escalation':
        return <ClockIcon className="h-5 w-5" />
      default:
        return <CheckCircleIcon className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-700'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700'
      default:
        return 'bg-green-50 border-green-200 text-green-700'
    }
  }

  const handleExportCalendar = async () => {
    try {
      const response = await fetch('/api/v5/compliance/calendar?format=ics')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'compliance-calendar.ics'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to export calendar:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Calendar</h1>
          <p className="mt-2 text-gray-600">
            Track renewal notice deadlines, lease expirations, and escalation dates. Export to your calendar app.
          </p>
        </div>
        <button
          onClick={handleExportCalendar}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <CalendarIcon className="h-5 w-5" />
          Export iCal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">High Priority</p>
              <p className="mt-2 text-2xl font-bold text-red-600">{stats.high}</p>
            </div>
            <BellAlertIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Medium Priority</p>
              <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.medium}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Low Priority</p>
              <p className="mt-2 text-2xl font-bold text-green-600">{stats.low}</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-1 inline-flex gap-1">
          <button
            onClick={() => setTimeframe('30')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              timeframe === '30' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setTimeframe('90')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              timeframe === '90' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            90 Days
          </button>
          <button
            onClick={() => setTimeframe('180')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              timeframe === '180' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            180 Days
          </button>
          <button
            onClick={() => setTimeframe('365')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              timeframe === '365' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            12 Months
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-1 inline-flex gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'all' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'high' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            High
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'medium' ? 'bg-yellow-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'low' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Low
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
          <p className="text-sm text-gray-500">Sorted by date (soonest first)</p>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="px-6 py-12 text-center text-gray-500">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-600">No events in the selected timeframe</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getPriorityColor(event.priority)}`}>
                    {getEventIcon(event.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-gray-900">{event.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(event.priority)}`}>
                        {event.daysUntil} days
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-600">
                      {event.propertyAddress || event.tenantName || 'Unknown Property'}
                    </p>

                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span>Due: {new Date(event.date).toLocaleDateString()}</span>
                      <span className="text-gray-400">•</span>
                      <span className="capitalize">{event.type.replace('_', ' ')}</span>
                    </div>

                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <span className="font-medium">Action Required:</span> {event.actionRequired}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

