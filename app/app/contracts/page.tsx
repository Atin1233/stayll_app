"use client"

import { useEffect, useState } from 'react'
import { LeaseStorageService } from '@/lib/v5/leaseStorage'
import type { Lease } from '@/types/v5.0'
import UploadDropzone from '@/components/dashboard/UploadDropzone'
import LeaseList from '@/components/dashboard/LeaseList'
import LeaseFieldsDisplay from '@/components/dashboard/LeaseFieldsDisplay'
import SessionDataManager from '@/components/dashboard/SessionDataManager'
import PDFViewer from '@/components/dashboard/PDFViewer'
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
        
        // Force refresh the lease list
        setRefreshTrigger((prev) => prev + 1)

        setTimeout(() => setUploadSuccess(false), 5000)
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
    // Scroll to the contract details
    setTimeout(() => {
      const element = document.getElementById('contract-details')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const handleContractEdit = (lease: any) => {
    // For now, just select it for viewing
    // In the future, this could open an edit modal
    handleContractSelect(lease)
  }

  const handleViewPDF = () => {
    if (!selectedContract) return
    
    // Check if we have a file URL (Supabase mode)
    if (selectedContract.file_url) {
      window.open(selectedContract.file_url, '_blank')
      return
    }
    
    // Otherwise, use file_data (test mode)
    if ((selectedContract as any).file_data) {
      const blob = dataURLToBlob((selectedContract as any).file_data)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      // Clean up after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  }

  const dataURLToBlob = (dataURL: string): Blob => {
    const parts = dataURL.split(',')
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf'
    const bstr = atob(parts[1])
    const n = bstr.length
    const u8arr = new Uint8Array(n)
    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i)
    }
    return new Blob([u8arr], { type: mime })
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

      {/* Session Storage Manager */}
      <div className="mb-6">
        <SessionDataManager />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Contract</h2>

          {uploading && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-blue-800">Uploading and extracting data from contract...</p>
              <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          )}

          {uploadSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-800 font-medium">✓ Contract uploaded and analyzed!</p>
              <p className="text-green-700 text-sm mt-1">Data extracted successfully. Check the contract list to view details.</p>
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
        <div id="contract-details" className="mt-12 space-y-6">
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
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close contract details"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                      {selectedContract.confidence_score ? `${Math.round(selectedContract.confidence_score)}%` : 'Pending'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Uploaded</dt>
                    <dd className="text-gray-900">{new Date(selectedContract.created_at).toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">File Name</dt>
                    <dd className="text-gray-900">{selectedContract.file_name}</dd>
                  </div>
                </dl>
              </div>

              <div className="space-y-3">
                {(selectedContract.file_url || (selectedContract as any).file_data) && (
                  <button
                    onClick={handleViewPDF}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Source Document
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PDF Viewer */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Document</h3>
              <PDFViewer leaseId={selectedContract.id} fileName={selectedContract.file_name} />
            </div>

            {/* Extracted Fields */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Data</h3>
              <LeaseFieldsDisplay leaseId={selectedContract.id} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
