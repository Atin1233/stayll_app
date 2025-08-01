"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline'

interface UploadDropzoneProps {
  onFileUpload: (file: File) => void
  loading?: boolean
}

export default function UploadDropzone({ onFileUpload, loading = false }: UploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0])
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  return (
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
          Only PDF files are supported
        </p>
      </div>
    </div>
  )
} 