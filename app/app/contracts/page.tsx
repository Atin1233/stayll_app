"use client"

import { useState } from 'react'
import { LeaseStorageService } from '@/lib/v5/leaseStorage'
import type { Lease } from '@/types/v5.0'
import UploadDropzone from '@/components/dashboard/UploadDropzone'
import LeaseList from '@/components/dashboard/LeaseList'
import LeaseFieldsDisplay from '@/components/dashboard/LeaseFieldsDisplay'

export default function ContractsPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedContract, setSelectedContract] = useState<Lease | null>(null)

  const handleFileUpload = async (file: File, propertyAddress: string, tenantName: string) => {
    setUploading(true)
    setUploadError('')
    setUploadSuccess(false)

    try {
      const result = await LeaseStorageService.uploadLease({
        file,
        property_address: propertyAddress,
        tenant_name: tenantName,
      })

      if (result.success) {
        setUploadSuccess(true)
        setRefreshTrigger((prev) => prev + 1)

        if (result.extraction?.success) {
          console.log(
            `Extracted ${result.extraction.fields_extracted} fields with ${result.extraction.confidence}% confidence`,
          )
        }

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

  const handleContractSelect = (lease: any) => {
    setSelectedContract(lease as Lease)
  }

  const handleContractEdit = (lease: any) => {
    console.log('Edit contract:', lease)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contract Workspace</h1>
        <p className="mt-2 text-gray-600">
          Upload, classify, and validate commercial contracts. Every field links back to its source clause for
          full auditability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Contract</h2>

          {uploadSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800">✅ Contract uploaded successfully!</p>
            </div>
          )}

          {uploadError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">❌ {uploadError}</p>
            </div>
          )}

          <UploadDropzone onFileUpload={handleFileUpload} loading={uploading} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contracts</h2>
          <LeaseList
            onLeaseSelect={handleContractSelect}
            onLeaseEdit={handleContractEdit}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>

      {selectedContract && (
        <div className="mt-12 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Contract Overview</h3>
                <p className="text-sm text-gray-500">
                  {selectedContract.property_address || 'Property not specified'} • {selectedContract.tenant_name || 'Tenant not specified'}
                </p>
              </div>
              <button
                onClick={() => setSelectedContract(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-gray-500">Verification Status</dt>
                    <dd className="text-gray-900 capitalize">{selectedContract.verification_status}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Analysis Confidence</dt>
                    <dd className="text-gray-900">
                      {selectedContract.confidence_score ? `${selectedContract.confidence_score}%` : 'Pending'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Uploaded</dt>
                    <dd className="text-gray-900">{new Date(selectedContract.created_at).toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>

              <div>
                {selectedContract.file_url && (
                  <a
                    href={selectedContract.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Source Document
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <LeaseFieldsDisplay leaseId={selectedContract.id} />
          </div>
        </div>
      )}
    </div>
  )
}
