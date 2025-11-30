"use client"

import { useEffect, useState } from 'react'
import { LeaseStorageService } from '@/lib/v5/leaseStorage'
import type { Lease } from '@/types/v5.0'
import UploadDropzone from '@/components/dashboard/UploadDropzone'
import LeaseList from '@/components/dashboard/LeaseList'
import LeaseFieldsDisplay from '@/components/dashboard/LeaseFieldsDisplay'
import type { QATask } from '@/types/v5.0'

export default function ContractsPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedContract, setSelectedContract] = useState<Lease | null>(null)
  const [qaTasks, setQaTasks] = useState<QATask[]>([])
  const [qaError, setQaError] = useState('')

  const handleFileUpload = async (file: File, propertyAddress: string, tenantName: string) => {
    setUploading(true)
    setUploadError('')
    setUploadSuccess(false)

    try {
      const result = await LeaseStorageService.uploadLease({
        file,
        property_address: propertyAddress || undefined, // Make optional
        tenant_name: tenantName || undefined, // Make optional
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

  useEffect(() => {
    const loadQaTasks = async () => {
      try {
        setQaError('')
        const response = await fetch('/api/v5/qa/tasks?limit=5')
        const result = await response.json()
        if (result.success) {
          setQaTasks(result.tasks || [])
        } else {
          setQaError(result.error || 'Unable to load QA tasks')
        }
      } catch (error) {
        setQaError('Unable to load QA tasks')
      }
    }

    loadQaTasks()
  }, [refreshTrigger])

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
              <p className="text-green-800">Contract uploaded successfully!</p>
            </div>
          )}

          {uploadError && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{uploadError}</p>
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

      <section id="qa" className="mt-12 bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">QA queue</h2>
            <p className="text-sm text-gray-500">
              Fields awaiting human verification after automated checks.
            </p>
          </div>
          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Refresh
          </button>
        </div>

        {qaError ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{qaError}</div>
        ) : qaTasks.length === 0 ? (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            No QA tasks at the moment. Upload contracts or refresh as new tasks arrive.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {qaTasks.map((task) => (
              <li key={task.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{task.field_name}</p>
                  <p className="text-sm text-gray-500">Contract ID: {task.lease_id}</p>
                  <p className="text-xs text-yellow-600">Confidence {Math.round(task.confidence)}% • {task.validation_state}</p>
                </div>
                <a
                  href={`/app/contracts?contract=${task.lease_id}`}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Open
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

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
                Close
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
