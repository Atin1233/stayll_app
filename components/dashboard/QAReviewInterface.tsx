/**
 * STAYLL v5.0 - QA Contractor Review Interface
 * Side-by-side review with approve/reject/edit workflow
 */

"use client"

import { useState, useEffect } from 'react'
import PDFViewer from './PDFViewer'

interface QATask {
  id: string
  lease_id: string
  field_id: string
  field_name: string
  field_label: string
  current_value?: string
  confidence: number
  validation_state: string
  source_page?: number
  source_snippet?: string
  reason_codes?: string[]
  tenant_name?: string
  property_address?: string
}

interface QAReviewInterfaceProps {
  orgId?: string
  onTaskComplete?: (taskId: string, action: 'approve' | 'reject' | 'edit', newValue?: string) => void
}

export default function QAReviewInterface({ orgId, onTaskComplete }: QAReviewInterfaceProps) {
  const [tasks, setTasks] = useState<QATask[]>([])
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editValue, setEditValue] = useState('')
  const [editReason, setEditReason] = useState('')
  const [taskTimer, setTaskTimer] = useState(0)
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadQATasks()
  }, [orgId])

  // Start timer when task changes
  useEffect(() => {
    setTaskTimer(0)
    const interval = setInterval(() => {
      setTaskTimer((prev) => prev + 1)
    }, 1000)
    setTimerInterval(interval)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [currentTaskIndex])

  const loadQATasks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/v5/qa/tasks${orgId ? `?org_id=${orgId}` : ''}`)
      
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Error loading QA tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const currentTask = tasks[currentTaskIndex]

  const handleApprove = async () => {
    if (!currentTask) return

    try {
      const response = await fetch(`/api/v5/qa/tasks/${currentTask.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          time_spent: taskTimer,
        }),
      })

      if (response.ok) {
        onTaskComplete?.(currentTask.id, 'approve')
        moveToNextTask()
      }
    } catch (error) {
      console.error('Error approving task:', error)
    }
  }

  const handleReject = async () => {
    if (!currentTask) return

    const reason = prompt('Why are you rejecting this field? (required)')
    if (!reason) return

    try {
      const response = await fetch(`/api/v5/qa/tasks/${currentTask.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          time_spent: taskTimer,
        }),
      })

      if (response.ok) {
        onTaskComplete?.(currentTask.id, 'reject')
        moveToNextTask()
      }
    } catch (error) {
      console.error('Error rejecting task:', error)
    }
  }

  const handleEdit = async () => {
    if (!currentTask || !editValue) return

    try {
      const response = await fetch(`/api/v5/qa/tasks/${currentTask.id}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_value: editValue,
          reason: editReason,
          time_spent: taskTimer,
        }),
      })

      if (response.ok) {
        onTaskComplete?.(currentTask.id, 'edit', editValue)
        setEditMode(false)
        setEditValue('')
        setEditReason('')
        moveToNextTask()
      }
    } catch (error) {
      console.error('Error editing task:', error)
    }
  }

  const moveToNextTask = () => {
    if (currentTaskIndex < tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1)
    } else {
      // No more tasks
      alert('All tasks completed!')
      loadQATasks() // Reload to check for new tasks
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading QA tasks...</p>
        </div>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No QA tasks available at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QA Review Queue</h1>
            <p className="text-sm text-gray-600">
              Task {currentTaskIndex + 1} of {tasks.length} • Time: {formatTime(taskTimer)}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Productivity: {((currentTaskIndex / (taskTimer / 60 || 1)) * 60).toFixed(1)} tasks/hr
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: PDF Viewer */}
        <div className="w-1/2 p-4">
          <PDFViewer
            leaseId={currentTask.lease_id}
            fileName={currentTask.tenant_name}
            highlightPage={currentTask.source_page}
            highlightText={currentTask.source_snippet}
          />
        </div>

        {/* Right: Field Review Panel */}
        <div className="w-1/2 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
            {/* Lease Info */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Lease</h3>
              <div className="text-sm text-gray-900 font-medium">{currentTask.tenant_name}</div>
              <div className="text-xs text-gray-500">{currentTask.property_address}</div>
            </div>

            {/* Field Info */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Field</h3>
              <div className="text-lg font-semibold text-gray-900">{currentTask.field_label}</div>
            </div>

            {/* Extracted Value */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
                Extracted Value
              </h3>
              {currentTask.current_value ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-gray-900 font-mono">{currentTask.current_value}</div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-red-700 italic">Not found in document</div>
                </div>
              )}
            </div>

            {/* Confidence & Reason Codes */}
            <div>
              <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
                Confidence: {currentTask.confidence}%
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentTask.reason_codes?.map((code, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded"
                  >
                    {code.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Source Clause */}
            {currentTask.source_snippet && (
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">
                  Source Clause (Page {currentTask.source_page})
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-gray-700 italic">
                    &quot;{currentTask.source_snippet}&quot;
                  </div>
                </div>
              </div>
            )}

            {/* Edit Mode */}
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Corrected Value
                  </label>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter correct value"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Edit (optional)
                  </label>
                  <textarea
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Why did you make this change?"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleEdit}
                    disabled={!editValue}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save Edit
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false)
                      setEditValue('')
                      setEditReason('')
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Action Buttons */
              <div className="space-y-3">
                <button
                  onClick={handleApprove}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  ✓ Approve (Correct)
                </button>
                <button
                  onClick={() => {
                    setEditMode(true)
                    setEditValue(currentTask.current_value || '')
                  }}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  ✎ Edit Value
                </button>
                <button
                  onClick={handleReject}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  ✗ Reject (Incorrect)
                </button>
              </div>
            )}

            {/* Keyboard Shortcuts */}
            <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
              <div className="font-medium mb-1">Keyboard Shortcuts:</div>
              <div className="space-y-1">
                <div>• Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">A</kbd> to Approve</div>
                <div>• Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">E</kbd> to Edit</div>
                <div>• Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">R</kbd> to Reject</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
