"use client"

import { useEffect, useState } from 'react'
import { CheckCircleIcon, XCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import type { QATask, Lease } from '@/types/v5.0'
import { LeaseStorageService } from '@/lib/v5/leaseStorage'
import LeaseFieldsDisplay from '@/components/dashboard/LeaseFieldsDisplay'

export default function VerificationPage() {
  const [qaTasks, setQaTasks] = useState<QATask[]>([])
  const [selectedTask, setSelectedTask] = useState<QATask | null>(null)
  const [selectedLease, setSelectedLease] = useState<Lease | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  useEffect(() => {
    loadQATasks()
  }, [])

  const loadQATasks = async () => {
    try {
      const response = await fetch('/api/v5/qa/tasks')
      const result = await response.json()
      if (result.success) {
        setQaTasks(result.tasks || [])
      }
    } catch (error) {
      console.error('Failed to load QA tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLeaseDetails = async (leaseId: string) => {
    try {
      const result = await LeaseStorageService.fetchLeases()
      if (result.success && result.leases) {
        const lease = result.leases.find(l => l.id === leaseId)
        if (lease) {
          setSelectedLease(lease)
        }
      }
    } catch (error) {
      console.error('Failed to load lease details:', error)
    }
  }

  const handleTaskSelect = async (task: QATask) => {
    setSelectedTask(task)
    await loadLeaseDetails(task.lease_id)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-50 border-green-200'
    if (confidence >= 70) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getPriorityTasks = () => {
    if (filter === 'all') return qaTasks
    if (filter === 'high') return qaTasks.filter(t => t.confidence < 70)
    if (filter === 'medium') return qaTasks.filter(t => t.confidence >= 70 && t.confidence < 90)
    return qaTasks.filter(t => t.confidence >= 90)
  }

  const filteredTasks = getPriorityTasks()

  const stats = {
    total: qaTasks.length,
    highPriority: qaTasks.filter(t => t.confidence < 70).length,
    mediumPriority: qaTasks.filter(t => t.confidence >= 70 && t.confidence < 90).length,
    lowPriority: qaTasks.filter(t => t.confidence >= 90).length,
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Verification & QA</h1>
        <p className="mt-2 text-gray-600">
          Review extracted fields, approve high-confidence data, and manually verify flagged values. Every edit is tracked in the audit trail.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ClockIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="mt-2 text-2xl font-bold text-red-600">{stats.highPriority}</p>
              <p className="text-xs text-gray-500">&lt; 70% confidence</p>
            </div>
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Medium Priority</p>
              <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.mediumPriority}</p>
              <p className="text-xs text-gray-500">70-90% confidence</p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Priority</p>
              <p className="mt-2 text-2xl font-bold text-green-600">{stats.lowPriority}</p>
              <p className="text-xs text-gray-500">&gt; 90% confidence</p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-1 inline-flex gap-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Tasks ({stats.total})
        </button>
        <button
          onClick={() => setFilter('high')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'high' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          High Priority ({stats.highPriority})
        </button>
        <button
          onClick={() => setFilter('medium')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'medium' ? 'bg-yellow-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Medium ({stats.mediumPriority})
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            filter === 'low' ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Low ({stats.lowPriority})
        </button>
      </div>

      {/* QA Tasks List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task List */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">QA Queue</h2>
            <p className="text-sm text-gray-500">Fields requiring human review</p>
          </div>

          <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="px-6 py-8 text-center text-gray-500">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">No tasks in this category</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskSelect(task)}
                  className={`px-6 py-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedTask?.id === task.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{task.field_name}</p>
                      <p className="text-xs text-gray-500 mt-1">Lease ID: {task.lease_id.substring(0, 8)}...</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs font-medium ${getConfidenceColor(task.confidence)}`}>
                          {Math.round(task.confidence)}% confidence
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-xs text-gray-600 capitalize">{task.validation_state}</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getConfidenceBgColor(task.confidence)}`}>
                      {task.confidence < 70 ? 'High' : task.confidence < 90 ? 'Medium' : 'Low'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Task Details */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
            <p className="text-sm text-gray-500">Review and verify extracted data</p>
          </div>

          <div className="px-6 py-4">
            {!selectedTask ? (
              <div className="text-center py-12">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">Select a task to review details</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Field Name</h3>
                  <p className="mt-1 text-base font-semibold text-gray-900">{selectedTask.field_name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Extracted Value</h3>
                  <div className={`mt-1 p-3 rounded border ${getConfidenceBgColor(selectedTask.confidence)}`}>
                    <p className="text-base text-gray-900">{selectedTask.extracted_value || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Confidence Score</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          selectedTask.confidence >= 90
                            ? 'bg-green-600'
                            : selectedTask.confidence >= 70
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}
                        style={{ width: `${selectedTask.confidence}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getConfidenceColor(selectedTask.confidence)}`}>
                      {Math.round(selectedTask.confidence)}%
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700">Validation State</h3>
                  <p className="mt-1 text-base text-gray-900 capitalize">{selectedTask.validation_state}</p>
                </div>

                {selectedTask.reason && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Flagging Reason</h3>
                    <p className="mt-1 text-sm text-gray-600">{selectedTask.reason}</p>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => alert('Approve functionality coming soon')}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => alert('Reject functionality coming soon')}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    Reject
                  </button>
                </div>

                {selectedLease && (
                  <div className="pt-4 border-t border-gray-200">
                    <a
                      href={selectedLease.file_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View Source Document →
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Lease Fields */}
      {selectedLease && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Extracted Fields</h2>
          <LeaseFieldsDisplay leaseId={selectedLease.id} />
        </div>
      )}
    </div>
  )
}

