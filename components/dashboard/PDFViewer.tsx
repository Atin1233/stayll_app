"use client"

import { useEffect, useState, useRef } from 'react'
import { SessionStorageService } from '@/lib/sessionStorage'

interface PDFViewerProps {
  leaseId: string
  fileName?: string
  highlightPage?: number
  highlightText?: string
  onPageChange?: (page: number) => void
}

export default function PDFViewer({ 
  leaseId, 
  fileName,
  highlightPage,
  highlightText,
  onPageChange 
}: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(highlightPage || 1)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    try {
      // Get lease from session storage
      const lease = SessionStorageService.getLease(leaseId)
      
      if (!lease) {
        setError('Lease not found')
        return
      }

      if (lease.file_data) {
        // Create blob URL from base64 data
        const url = SessionStorageService.base64ToBlob(lease.file_data, 'application/pdf')
        setPdfUrl(url)
      } else if (lease.file_url) {
        // Use existing URL
        setPdfUrl(lease.file_url)
      } else {
        setError('No PDF data available')
      }
    } catch (err) {
      console.error('Error loading PDF:', err)
      setError('Failed to load PDF')
    }

    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl && pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [leaseId])

  // Jump to highlighted page when it changes
  useEffect(() => {
    if (highlightPage) {
      setCurrentPage(highlightPage)
      jumpToPage(highlightPage)
    }
  }, [highlightPage])

  const jumpToPage = (page: number) => {
    if (iframeRef.current && pdfUrl) {
      // Update iframe src with page hash
      const url = `${pdfUrl}#page=${page}&view=FitH`
      iframeRef.current.src = url
      setCurrentPage(page)
      onPageChange?.(page)
    }
  }

  const handlePageChange = (newPage: number) => {
    const page = Math.max(1, newPage)
    jumpToPage(page)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-8">
        <div className="text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow">
      {/* PDF Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          {/* Previous Page */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-gray-200"
            title="Previous page"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Page Number Input */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 font-medium">Page</span>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value) || 1
                handlePageChange(page)
              }}
              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={1}
            />
          </div>

          {/* Next Page */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-1.5 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-200"
            title="Next page"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* File Name */}
        <div className="text-sm text-gray-700 font-medium">
          {fileName || 'Lease Document'}
        </div>

        {/* Open in New Tab */}
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Open in new tab →
        </a>
      </div>

      {/* Highlight Banner (if clause is highlighted) */}
      {highlightText && (
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            <span className="text-xs text-yellow-800">
              Showing source clause: &quot;{highlightText.substring(0, 50)}...&quot;
            </span>
          </div>
        </div>
      )}

      {/* PDF Viewer */}
      <div className="flex-1 overflow-hidden">
        <iframe
          ref={iframeRef}
          src={`${pdfUrl}#page=${currentPage}&view=FitH`}
          title={fileName || 'PDF Viewer'}
          className="w-full h-full border-0"
        />
      </div>

      {/* Quick Jump to Source (if highlight available) */}
      {highlightPage && currentPage !== highlightPage && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
          <button
            onClick={() => jumpToPage(highlightPage)}
            className="flex items-center space-x-2 text-sm text-blue-700 hover:text-blue-900 font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span>Jump to source clause (page {highlightPage})</span>
          </button>
        </div>
      )}
    </div>
  )
}
