/**
 * STAYLL v5.0 - Lease Fields Display Component
 * Shows extracted fields with validation state
 */

"use client"

import { useState, useEffect } from 'react'
import type { LeaseField } from '@/types/v5.0'
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { SessionStorageService, type SessionLease } from '@/lib/sessionStorage'

interface LeaseFieldsDisplayProps {
  leaseId: string
}

// All expected lease fields
const ALL_EXPECTED_FIELDS = [
  { name: 'property_address', label: 'Property Address', key: 'property_address', critical: true },
  { name: 'tenant_name', label: 'Tenant Name', key: 'tenant_name', critical: true },
  { name: 'monthly_rent', label: 'Monthly Rent', key: 'monthly_rent', critical: true },
  { name: 'lease_start', label: 'Lease Start Date', key: 'lease_start', critical: true },
  { name: 'lease_end', label: 'Lease End Date', key: 'lease_end', critical: true },
  { name: 'security_deposit', label: 'Security Deposit', key: 'security_deposit', critical: false },
  { name: 'late_fee', label: 'Late Fee', key: 'late_fee', critical: false },
];

interface MissingField {
  name: string
  label: string
  critical: boolean
}

// Convert lease data to fields format on the client side
function convertLeaseToFields(lease: SessionLease): { 
  fields: LeaseField[], 
  missing: MissingField[] 
} {
  const fields: LeaseField[] = [];
  const missing: MissingField[] = [];
  
  ALL_EXPECTED_FIELDS.forEach((mapping) => {
    const value = (lease as any)[mapping.key];
    if (value) {
      fields.push({
        id: `field-${lease.id}-${mapping.name}`,
        lease_id: lease.id,
        field_name: mapping.name,
        value_text: String(value),
        value_normalized: mapping.name.includes('rent') || mapping.name.includes('deposit') || mapping.name.includes('fee')
          ? { numeric: parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0 }
          : mapping.name.includes('date') || mapping.name.includes('start') || mapping.name.includes('end')
          ? { date: value }
          : undefined,
        extraction_confidence: lease.confidence_score || 0,
        validation_state: 'auto_pass',
        validation_notes: undefined,
        source_clause_location: undefined,
        created_at: lease.created_at,
        updated_at: lease.updated_at
      });
    } else {
      missing.push({
        name: mapping.name,
        label: mapping.label,
        critical: mapping.critical
      });
    }
  });
  
  return { fields, missing };
}

// Generate confidence explanation
function getConfidenceExplanation(confidence: number, extractedCount: number, totalCount: number) {
  const missingCount = totalCount - extractedCount;
  const percentage = confidence;
  
  let quality = '';
  let icon = '';
  let color = '';
  
  if (percentage >= 80) {
    quality = 'Excellent';
    icon = '✅';
    color = 'text-green-600';
  } else if (percentage >= 60) {
    quality = 'Good';
    icon = '✓';
    color = 'text-blue-600';
  } else if (percentage >= 40) {
    quality = 'Fair';
    icon = '⚠️';
    color = 'text-yellow-600';
  } else {
    quality = 'Poor';
    icon = '⚠️';
    color = 'text-red-600';
  }
  
  return {
    quality,
    icon,
    color,
    message: `${icon} ${quality} extraction quality - ${extractedCount} of ${totalCount} fields extracted successfully.`,
    details: missingCount > 0 
      ? `${missingCount} field${missingCount !== 1 ? 's' : ''} could not be found in the PDF. This may be due to non-standard formatting, scanned images, or missing clauses.`
      : 'All expected fields were successfully extracted from the document.'
  };
}

export default function LeaseFieldsDisplay({ leaseId }: LeaseFieldsDisplayProps) {
  const [fields, setFields] = useState<LeaseField[]>([])
  const [missingFields, setMissingFields] = useState<MissingField[]>([])
  const [lease, setLease] = useState<SessionLease | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFields()
  }, [leaseId])

  const fetchFields = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Get lease data from session storage
      const leaseData = SessionStorageService.getLease(leaseId);
      console.log('[LeaseFieldsDisplay] Fetching fields for lease:', leaseId);
      console.log('[LeaseFieldsDisplay] Lease data from session:', leaseData);
      
      if (!leaseData) {
        setError('Lease not found in session storage');
        setLoading(false);
        return;
      }
      
      setLease(leaseData);
      
      // Convert lease data to fields format directly on the client
      const { fields: convertedFields, missing } = convertLeaseToFields(leaseData);
      console.log('[LeaseFieldsDisplay] Converted fields:', convertedFields);
      console.log('[LeaseFieldsDisplay] Missing fields:', missing);
      
      setFields(convertedFields);
      setMissingFields(missing);
    } catch (err) {
      console.error('[LeaseFieldsDisplay] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch fields')
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

  if (fields.length === 0 && missingFields.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
        <p className="text-gray-600">No data available. The extraction may still be processing.</p>
      </div>
    )
  }

  const confidence = lease?.confidence_score || 0;
  const totalExpected = ALL_EXPECTED_FIELDS.length;
  const extracted = fields.length;
  const confidenceInfo = getConfidenceExplanation(confidence, extracted, totalExpected);

  return (
    <div className="space-y-6">
      {/* Confidence Score Section */}
      {lease && (
        <div className={`border rounded-lg p-4 ${
          confidence >= 80 ? 'bg-green-50 border-green-200' :
          confidence >= 60 ? 'bg-blue-50 border-blue-200' :
          confidence >= 40 ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${confidenceInfo.color}`}>
                Extraction Confidence: {Math.round(confidence)}%
              </h3>
              <p className="text-sm text-gray-700 mt-1">{confidenceInfo.message}</p>
            </div>
            <div className={`text-3xl font-bold ${confidenceInfo.color}`}>
              {Math.round(confidence)}%
            </div>
          </div>
          <p className="text-sm text-gray-600 border-t border-current border-opacity-20 pt-3 mt-3">
            {confidenceInfo.details}
          </p>
        </div>
      )}

      {/* Missing Fields Alert */}
      {missingFields.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-900 mb-2">
                Missing Fields ({missingFields.length})
              </h4>
              <div className="space-y-2">
                {missingFields.map((field) => (
                  <div key={field.name} className="flex items-center justify-between">
                    <span className="text-sm text-yellow-800">
                      {field.label}
                      {field.critical && <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Critical</span>}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-yellow-700 mt-3">
                💡 These fields were not found in the PDF. You may need to add them manually or re-upload a clearer document.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Fields Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Successfully Extracted ({fields.length}/{totalExpected})
          </h3>
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
              {fields.length}
            </div>
            <div className="text-xs text-gray-600">Extracted</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {missingFields.length}
            </div>
            <div className="text-xs text-gray-600">Missing</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">
              {missingFields.filter(f => f.critical).length}
            </div>
            <div className="text-xs text-gray-600">Critical Missing</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {Math.round(confidence)}%
            </div>
            <div className="text-xs text-gray-600">Confidence</div>
          </div>
        </div>
      </div>
    </div>
  )
}

