/**
 * STAYLL v5.0 - Lease Fields Display Component
 * Shows extracted fields with validation state
 */

"use client"

import { useState, useEffect } from 'react'
import type { LeaseField } from '@/types/v5.0'
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline'

interface LeaseFieldsDisplayProps {
  leaseId: string
}

export default function LeaseFieldsDisplay({ leaseId }: LeaseFieldsDisplayProps) {
  const [fields, setFields] = useState<LeaseField[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFields()
  }, [leaseId])

  const fetchFields = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/v5/leases/${leaseId}/fields`)
      const result = await response.json()

      if (result.success) {
        setFields(result.fields || [])
      } else {
        setError(result.error || 'Failed to fetch fields')
      }
    } catch (err) {
      setError('Failed to fetch fields')
    } finally {
      setLoading(false)
    }
  }

  const getValidationStateIcon = (state: string) => {
    switch (state) {
      case 'auto_pass':
      case 'human_pass':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'flagged':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'rule_fail':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'human_edit':
        return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />
    }
  }

  const getValidationStateColor = (state: string) => {
    switch (state) {
      case 'auto_pass':
      case 'human_pass':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'flagged':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'rule_fail':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'human_edit':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const formatFieldValue = (field: LeaseField): string => {
    if (field.value_normalized?.numeric !== undefined) {
      return `$${field.value_normalized.numeric.toLocaleString()}`
    }
    if (field.value_normalized?.date) {
      return new Date(field.value_normalized.date).toLocaleDateString()
    }
    return field.value_text || 'N/A'
  }

  const formatFieldName = (name: string): string => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    )
  }

  if (fields.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
        <p className="text-gray-600">No fields extracted yet. Upload a lease to begin extraction.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Extracted Fields</h3>
        <span className="text-sm text-gray-500">{fields.length} fields</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div
            key={field.id}
            className={`border rounded-lg p-4 ${getValidationStateColor(field.validation_state)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getValidationStateIcon(field.validation_state)}
                <h4 className="font-medium">{formatFieldName(field.field_name)}</h4>
              </div>
              {field.extraction_confidence && (
                <span className="text-xs font-medium">
                  {Math.round(field.extraction_confidence)}%
                </span>
              )}
            </div>
            
            <div className="mt-2">
              <p className="text-lg font-semibold">{formatFieldValue(field)}</p>
              {field.validation_notes && (
                <p className="text-xs mt-1 opacity-75">{field.validation_notes}</p>
              )}
            </div>

            {field.source_clause_location && (
              <div className="mt-2 pt-2 border-t border-current opacity-50">
                <p className="text-xs">
                  Source: Page {field.source_clause_location.page}
                  {field.source_clause_location.clause_id && (
                    <> • Clause {field.source_clause_location.clause_id}</>
                  )}
                </p>
              </div>
            )}

            <div className="mt-2">
              <span className="text-xs px-2 py-1 rounded bg-current opacity-20">
                {field.validation_state.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {fields.filter(f => f.validation_state === 'auto_pass' || f.validation_state === 'human_pass').length}
          </div>
          <div className="text-xs text-gray-600">Verified</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {fields.filter(f => f.validation_state === 'flagged').length}
          </div>
          <div className="text-xs text-gray-600">Flagged</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">
            {fields.filter(f => f.validation_state === 'rule_fail').length}
          </div>
          <div className="text-xs text-gray-600">Failed</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-600">
            {Math.round(fields.reduce((sum, f) => sum + (f.extraction_confidence || 0), 0) / fields.length)}%
          </div>
          <div className="text-xs text-gray-600">Avg Confidence</div>
        </div>
      </div>
    </div>
  )
}

