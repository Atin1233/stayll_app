/**
 * STAYLL v5.0 - Batch Upload Component
 * Supports uploading up to 500 files with progress tracking
 */

"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface UploadFile {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
  progress: number
  error?: string
  lease_id?: string
}

interface BatchUploadProps {
  onBatchComplete?: (results: UploadFile[]) => void
  maxFiles?: number
}

export default function BatchUpload({ onBatchComplete, maxFiles = 500 }: BatchUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [batchId, setBatchId] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const currentCount = files.length
    const remainingSlots = maxFiles - currentCount
    
    if (acceptedFiles.length > remainingSlots) {
      alert(`Maximum ${maxFiles} files allowed. You can add ${remainingSlots} more files.`)
      acceptedFiles = acceptedFiles.slice(0, remainingSlots)
    }

    const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      status: 'pending',
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])
  }, [files, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: true,
    disabled: isProcessing || files.length >= maxFiles,
  })

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const clearAll = () => {
    if (confirm('Remove all files from the batch?')) {
      setFiles([])
      setBatchId(null)
    }
  }

  const startBatchUpload = async () => {
    if (files.length === 0) return

    setIsProcessing(true)
    const newBatchId = `batch-${Date.now()}`
    setBatchId(newBatchId)

    // Process files one at a time (or in small parallel batches)
    for (const fileItem of files) {
      if (fileItem.status === 'completed' || fileItem.status === 'failed') {
        continue // Skip already processed files
      }

      await uploadSingleFile(fileItem, newBatchId)
    }

    setIsProcessing(false)
    onBatchComplete?.(files)
  }

  const uploadSingleFile = async (fileItem: UploadFile, batchIdRef: string) => {
    try {
      // Update status to uploading
      updateFileStatus(fileItem.id, 'uploading', 10)

      // Convert file to base64
      const base64 = await fileToBase64(fileItem.file)
      updateFileStatus(fileItem.id, 'uploading', 30)

      // Upload file
      const uploadResponse = await fetch('/api/v5/leases/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_name: fileItem.file.name,
          file_size: fileItem.file.size,
          file_data: base64,
          batch_id: batchIdRef,
        }),
      })

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`)
      }

      const uploadData = await uploadResponse.json()
      updateFileStatus(fileItem.id, 'processing', 50, uploadData.lease?.id)

      // Extract data from file
      const extractResponse = await fetch('/api/extract-lease', {
        method: 'POST',
        body: createFormData(base64),
      })

      if (!extractResponse.ok) {
        throw new Error('Extraction failed')
      }

      updateFileStatus(fileItem.id, 'processing', 80)

      // Small delay to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mark as completed
      updateFileStatus(fileItem.id, 'completed', 100)
    } catch (error) {
      console.error(`Error processing file ${fileItem.file.name}:`, error)
      updateFileStatus(
        fileItem.id,
        'failed',
        0,
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      )
    }
  }

  const updateFileStatus = (
    id: string,
    status: UploadFile['status'],
    progress: number,
    lease_id?: string,
    error?: string
  ) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, status, progress, lease_id: lease_id || f.lease_id, error }
          : f
      )
    )
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const createFormData = (base64: string): FormData => {
    const formData = new FormData()
    formData.append('fileData', base64)
    return formData
  }

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'pending':
        return <span className="text-gray-400">⏳</span>
      case 'uploading':
      case 'processing':
        return (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )
      case 'completed':
        return <span className="text-green-500">✓</span>
      case 'failed':
        return <span className="text-red-500">✗</span>
    }
  }

  const completedCount = files.filter((f) => f.status === 'completed').length
  const failedCount = files.filter((f) => f.status === 'failed').length
  const pendingCount = files.filter((f) => f.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      {files.length < maxFiles && !isProcessing && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop files here...' : 'Drop PDF files here'}
            </div>
            <div className="text-sm text-gray-500">
              or click to select files (max {maxFiles} files, {files.length} added)
            </div>
          </div>
        </div>
      )}

      {/* Batch Summary */}
      {files.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Batch Upload ({files.length} files)
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-600">
                  ✓ Completed: <span className="font-medium text-green-600">{completedCount}</span>
                </span>
                <span className="text-gray-600">
                  ✗ Failed: <span className="font-medium text-red-600">{failedCount}</span>
                </span>
                <span className="text-gray-600">
                  ⏳ Pending: <span className="font-medium text-gray-900">{pendingCount}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isProcessing && pendingCount > 0 && (
                <button
                  onClick={startBatchUpload}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Start Upload ({pendingCount} files)
                </button>
              )}
              {!isProcessing && (
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* File List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="bg-white rounded-lg p-3 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">{getStatusIcon(fileItem.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {fileItem.file.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  {!isProcessing && fileItem.status === 'pending' && (
                    <button
                      onClick={() => removeFile(fileItem.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Progress Bar */}
                {(fileItem.status === 'uploading' || fileItem.status === 'processing') && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${fileItem.progress}%` }}
                    />
                  </div>
                )}

                {/* Error Message */}
                {fileItem.status === 'failed' && fileItem.error && (
                  <div className="text-xs text-red-600 mt-1">{fileItem.error}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processing Banner */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <div>
              <div className="text-sm font-medium text-blue-900">Processing batch upload...</div>
              <div className="text-xs text-blue-700">
                {completedCount} of {files.length} files completed
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
