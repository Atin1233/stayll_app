/**
 * STAYLL v5.0 - Enhanced Lease Field Display with Clause Linkage
 * Shows fields with clickable source clause links
 */

"use client"

import { useState } from 'react'

interface FieldWithSource {
  name: string
  label: string
  value?: string
  confidence?: number
  source_page?: number
  source_snippet?: string
  needs_qa?: boolean
  reason_codes?: string[]
  priority?: 'critical' | 'high' | 'medium' | 'low'
}

interface FieldClauseLinkageProps {
  fields: FieldWithSource[]
  onClauseClick?: (fieldName: string, page: number, snippet: string) => void
}

export default function FieldClauseLinkage({ fields, onClauseClick }: FieldClauseLinkageProps) {
  const [expandedField, setExpandedField] = useState<string | null>(null)

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800 border-green-300'
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-red-100 text-red-800 border-red-300'
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return '✓'
    if (confidence >= 70) return '⚠'
    return '✗'
  }

  const getPriorityBadge = (priority?: string) => {
    if (priority === 'critical') {
      return <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">Critical</span>
    }
    if (priority === 'high') {
      return <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">High</span>
    }
    return null
  }

  const handleClauseClick = (field: FieldWithSource) => {
    if (field.source_page && field.source_snippet && onClauseClick) {
      onClauseClick(field.name, field.source_page, field.source_snippet)
    }
  }

  const toggleExpand = (fieldName: string) => {
    setExpandedField(expandedField === fieldName ? null : fieldName)
  }

  return (
    <div className="space-y-3">
      {fields.map((field) => (
        <div
          key={field.name}
          className={`border rounded-lg overflow-hidden transition-all ${
            field.needs_qa ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'
          }`}
        >
          {/* Field Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900">{field.label}</span>
                {getPriorityBadge(field.priority)}
                {field.needs_qa && (
                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded font-medium">
                    Needs QA
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {/* Confidence Badge */}
                {field.confidence !== undefined && (
                  <span
                    className={`text-xs px-2 py-1 rounded border font-medium ${getConfidenceColor(
                      field.confidence
                    )}`}
                  >
                    {getConfidenceIcon(field.confidence)} {field.confidence}%
                  </span>
                )}
                {/* Expand Button */}
                <button
                  onClick={() => toggleExpand(field.name)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className={`w-5 h-5 transform transition-transform ${
                      expandedField === field.name ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Field Value */}
          <div className="px-4 py-3">
            {field.value ? (
              <div className="text-gray-900 font-mono text-sm">{field.value}</div>
            ) : (
              <div className="text-gray-400 italic">Not found in document</div>
            )}
          </div>

          {/* Expanded Details */}
          {expandedField === field.name && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 space-y-3">
              {/* Reason Codes */}
              {field.reason_codes && field.reason_codes.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">Confidence Factors:</div>
                  <div className="flex flex-wrap gap-1">
                    {field.reason_codes.map((code, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded"
                      >
                        {code.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Source Clause Link */}
              {field.source_page && field.source_snippet && (
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-2">Source Clause:</div>
                  <div className="bg-white border border-gray-200 rounded p-3">
                    <div className="text-xs text-gray-600 mb-2">
                      Page {field.source_page}
                    </div>
                    <div className="text-sm text-gray-700 italic border-l-2 border-blue-500 pl-3 mb-3">
                      &quot;{field.source_snippet}&quot;
                    </div>
                    <button
                      onClick={() => handleClauseClick(field)}
                      className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      <span>View in PDF</span>
                    </button>
                  </div>
                </div>
              )}

              {/* No Source Available */}
              {!field.source_page && (
                <div className="text-xs text-gray-500 italic">
                  No source clause location available
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
