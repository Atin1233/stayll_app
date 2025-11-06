"use client"

import { useState } from 'react'
import { LeaseStorageService, LeaseRecord } from '@/lib/leaseStorage'
import UploadDropzone from '@/components/dashboard/UploadDropzone'
import LeaseList from '@/components/dashboard/LeaseList'

export default function LeasesPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedLease, setSelectedLease] = useState<LeaseRecord | null>(null)

  const handleFileUpload = async (file: File, propertyAddress: string, tenantName: string) => {
    setUploading(true)
    setUploadError('')
    setUploadSuccess(false)

    try {
      const result = await LeaseStorageService.uploadLease({
        file,
        propertyAddress,
        tenantName
      })

      if (result.success) {
        setUploadSuccess(true)
        setRefreshTrigger(prev => prev + 1)
        // Reset form after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000)
      } else {
        setUploadError(result.error || 'Upload failed')
      }
    } catch (error) {
      setUploadError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleLeaseSelect = (lease: LeaseRecord) => {
    setSelectedLease(lease)
  }

  const handleLeaseEdit = (lease: LeaseRecord) => {
    // TODO: Implement edit functionality
    console.log('Edit lease:', lease)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lease Management</h1>
        <p className="mt-2 text-gray-600">
          Upload and manage your lease documents. All files are securely stored and accessible anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Lease</h2>
          
          {uploadSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800">✅ Lease uploaded successfully!</p>
            </div>
          )}
          
          {uploadError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">❌ {uploadError}</p>
            </div>
          )}

          <UploadDropzone
            onFileUpload={handleFileUpload}
            loading={uploading}
          />
          </div>

        {/* Leases List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Leases</h2>
          <LeaseList
            onLeaseSelect={handleLeaseSelect}
            onLeaseEdit={handleLeaseEdit}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>

      {/* Selected Lease Details */}
      {selectedLease && (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Lease Details</h3>
              <button
              onClick={() => setSelectedLease(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
              </button>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Property Information</h4>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Address:</dt>
                  <dd className="text-gray-900">{selectedLease.property_address || 'Not specified'}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Tenant:</dt>
                  <dd className="text-gray-900">{selectedLease.tenant_name || 'Not specified'}</dd>
                </div>
                      <div>
                  <dt className="text-gray-500">Monthly Rent:</dt>
                  <dd className="text-gray-900">{selectedLease.monthly_rent || 'Not specified'}</dd>
                      </div>
                <div>
                  <dt className="text-gray-500">Security Deposit:</dt>
                  <dd className="text-gray-900">{selectedLease.security_deposit || 'Not specified'}</dd>
                </div>
              </dl>
                  </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Lease Terms</h4>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Start Date:</dt>
                  <dd className="text-gray-900">{selectedLease.lease_start || 'Not specified'}</dd>
                    </div>
                <div>
                  <dt className="text-gray-500">End Date:</dt>
                  <dd className="text-gray-900">{selectedLease.lease_end || 'Not specified'}</dd>
                  </div>
                <div>
                  <dt className="text-gray-500">Due Date:</dt>
                  <dd className="text-gray-900">{selectedLease.due_date || 'Not specified'}</dd>
                  </div>
                <div>
                  <dt className="text-gray-500">Late Fee:</dt>
                  <dd className="text-gray-900">{selectedLease.late_fee || 'Not specified'}</dd>
                    </div>
              </dl>
            </div>
              </div>
              
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">File Information</h4>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>File: {selectedLease.file_name}</p>
                <p>Uploaded: {new Date(selectedLease.created_at).toLocaleDateString()}</p>
                {selectedLease.confidence_score > 0 && (
                  <p className="text-green-600">Analysis Confidence: {selectedLease.confidence_score}%</p>
                )}
              </div>
              <a
                href={selectedLease.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                View File
              </a>
            </div>
          </div>
          </div>
        )}
    </div>
  )
} 