"use client"

import { useState, useEffect } from 'react'
import { SessionStorageService } from '@/lib/sessionStorage'
import { TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

export default function SessionDataManager() {
  const [clearing, setClearing] = useState(false)
  const [leaseCount, setLeaseCount] = useState(0)

  useEffect(() => {
    // Update lease count
    const updateCount = () => {
      const leases = SessionStorageService.getLeases()
      setLeaseCount(leases.length)
    }
    
    updateCount()
    
    // Listen for lease changes
    window.addEventListener('sessionLeaseAdded', updateCount)
    window.addEventListener('sessionLeaseUpdated', updateCount)
    
    return () => {
      window.removeEventListener('sessionLeaseAdded', updateCount)
      window.removeEventListener('sessionLeaseUpdated', updateCount)
    }
  }, [])

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all test data? This cannot be undone.')) {
      setClearing(true)
      SessionStorageService.clearAll()
      setTimeout(() => {
        setClearing(false)
        window.location.reload()
      }, 500)
    }
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-yellow-800 flex items-center gap-2">
            <ArrowPathIcon className="h-5 w-5" />
            Test Mode (Session Storage)
          </h3>
          <p className="text-xs text-yellow-700 mt-1">
            {leaseCount} lease{leaseCount !== 1 ? 's' : ''} in session storage. 
            Data will be cleared when you close the browser.
          </p>
        </div>
        <button
          onClick={handleClearData}
          disabled={clearing || leaseCount === 0}
          className="inline-flex items-center gap-2 px-3 py-2 border border-yellow-300 rounded-md text-sm font-medium text-yellow-700 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <TrashIcon className="h-4 w-4" />
          {clearing ? 'Clearing...' : 'Clear All Data'}
        </button>
      </div>
    </div>
  )
}
