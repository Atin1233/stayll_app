"use client"

import { useState, useEffect } from 'react'
import { LeaseStorageService, LeaseRecord } from '@/lib/leaseStorage'
import { TrashIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline'

interface LeaseListProps {
  onLeaseSelect?: (lease: LeaseRecord) => void
  onLeaseEdit?: (lease: LeaseRecord) => void
  refreshTrigger?: number
}

export default function LeaseList({ onLeaseSelect, onLeaseEdit, refreshTrigger }: LeaseListProps) {
  const [leases, setLeases] = useState<LeaseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const fetchLeases = async () => {
    setLoading(true)
    setError('')
    
    const result = await LeaseStorageService.fetchLeases()
    
    if (result.success && result.leases) {
      setLeases(result.leases)
    } else {
      setError(result.error || 'Failed to fetch leases')
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchLeases()
  }, [refreshTrigger])

  const handleDelete = async (leaseId: string) => {
    if (!confirm('Are you sure you want to delete this lease? This action cannot be undone.')) {
      return
    }

    const result = await LeaseStorageService.deleteLease(leaseId)
    
    if (result.success) {
      setLeases(leases.filter(lease => lease.id !== leaseId))
    } else {
      alert(`Failed to delete lease: ${result.error}`)
    }
  }

  const filteredLeases = leases.filter(lease => 
    lease.property_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lease.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lease.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
        <button 
          onClick={fetchLeases}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by property address, tenant name, or filename..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Lease Count */}
      <div className="text-sm text-gray-600">
        {filteredLeases.length} lease{filteredLeases.length !== 1 ? 's' : ''} found
      </div>

      {/* Leases List */}
      {filteredLeases.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No leases match your search.' : 'No leases uploaded yet.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeases.map((lease) => (
            <div
              key={lease.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {lease.property_address || 'No address specified'}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        Tenant: {lease.tenant_name || 'Not specified'}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                        <span>Uploaded: {formatDate(lease.created_at)}</span>
                        <span>File: {lease.file_name}</span>
                        <span>Size: {formatFileSize(lease.file_size)}</span>
                        {lease.confidence_score > 0 && (
                          <span className="text-green-600">
                            Analysis: {lease.confidence_score}% confidence
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  {onLeaseSelect && (
                    <button
                      onClick={() => onLeaseSelect(lease)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View lease"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  )}
                  {onLeaseEdit && (
                    <button
                      onClick={() => onLeaseEdit(lease)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Edit lease"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(lease.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete lease"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 