"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'

interface UploadDropzoneProps {
  onFileUpload: (file: File, propertyAddress: string, tenantName: string) => void
  loading?: boolean
}

export default function UploadDropzone({ onFileUpload, loading = false }: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [propertyAddress, setPropertyAddress] = useState('')
  const [tenantName, setTenantName] = useState('')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0], propertyAddress, tenantName)
    }
  }, [onFileUpload, propertyAddress, tenantName])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  return (
    <div className="space-y-6">
      {/* Property and Tenant Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="propertyAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Property Address
          </label>
          <input
            type="text"
            id="propertyAddress"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            placeholder="123 Main St, City, State"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700 mb-2">
            Tenant Name
          </label>
          <input
            type="text"
            id="tenantName"
            value={tenantName}
            onChange={(e) => setTenantName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>
      </div>

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-lg font-medium text-gray-900">
            {loading ? 'Uploading...' : 'Upload lease document'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Drag and drop a PDF file here, or click to select
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Only PDF files are supported (max 50MB)
          </p>
        </div>
      </div>

      {/* Upload Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Upload Requirements:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• PDF format only</li>
          <li>• Maximum file size: 50MB</li>
          <li>• Property address and tenant name are optional but recommended</li>
          <li>• Your lease data will be securely stored and accessible anytime</li>
        </ul>
      </div>
    </div>
  )
} 