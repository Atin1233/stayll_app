/**
 * Debug utilities for session storage
 * Use these in browser console for debugging
 */

import { SessionStorageService } from './sessionStorage'

export const SessionDebug = {
  /**
   * Print all leases in a readable format
   */
  printAll() {
    const leases = SessionStorageService.getLeases()
    console.log('=== Session Storage Leases ===')
    console.log(`Total leases: ${leases.length}`)
    leases.forEach((lease, index) => {
      console.log(`\n[${index + 1}] ${lease.id}`)
      console.log(`  Property: ${lease.property_address}`)
      console.log(`  Tenant: ${lease.tenant_name}`)
      console.log(`  File: ${lease.file_name} (${lease.file_size} bytes)`)
      console.log(`  Created: ${new Date(lease.created_at).toLocaleString()}`)
      console.log(`  Has file data: ${!!lease.file_data}`)
    })
  },

  /**
   * Get summary statistics
   */
  getStats() {
    const leases = SessionStorageService.getLeases()
    const totalSize = leases.reduce((sum, lease) => sum + (lease.file_size || 0), 0)
    const totalDataSize = leases.reduce((sum, lease) => sum + (lease.file_data?.length || 0), 0)
    
    return {
      totalLeases: leases.length,
      totalFileSize: totalSize,
      totalStorageSize: totalDataSize,
      averageFileSize: leases.length > 0 ? Math.round(totalSize / leases.length) : 0,
      oldestLease: leases.length > 0 ? new Date(leases[0].created_at) : null,
      newestLease: leases.length > 0 ? new Date(leases[leases.length - 1].created_at) : null
    }
  },

  /**
   * Print storage statistics
   */
  printStats() {
    const stats = this.getStats()
    console.log('=== Storage Statistics ===')
    console.log(`Total leases: ${stats.totalLeases}`)
    console.log(`Total file size: ${this.formatBytes(stats.totalFileSize)}`)
    console.log(`Total storage used: ${this.formatBytes(stats.totalStorageSize)}`)
    console.log(`Average file size: ${this.formatBytes(stats.averageFileSize)}`)
    if (stats.oldestLease) {
      console.log(`Oldest lease: ${stats.oldestLease.toLocaleString()}`)
    }
    if (stats.newestLease) {
      console.log(`Newest lease: ${stats.newestLease.toLocaleString()}`)
    }
    
    // Estimate remaining storage
    const sessionStorageLimit = 10 * 1024 * 1024 // 10MB estimate
    const remaining = sessionStorageLimit - stats.totalStorageSize
    console.log(`\nEstimated remaining storage: ${this.formatBytes(remaining)}`)
    console.log(`Storage usage: ${((stats.totalStorageSize / sessionStorageLimit) * 100).toFixed(2)}%`)
  },

  /**
   * Format bytes to human readable
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  /**
   * Get a specific lease by ID
   */
  getLease(id: string) {
    return SessionStorageService.getLease(id)
  },

  /**
   * Search leases
   */
  search(query: string) {
    const leases = SessionStorageService.getLeases()
    const results = leases.filter(lease => 
      lease.property_address.toLowerCase().includes(query.toLowerCase()) ||
      lease.tenant_name.toLowerCase().includes(query.toLowerCase()) ||
      lease.file_name.toLowerCase().includes(query.toLowerCase())
    )
    console.log(`Found ${results.length} matching leases:`)
    results.forEach(lease => {
      console.log(`  - ${lease.property_address} (${lease.tenant_name})`)
    })
    return results
  },

  /**
   * Export data as JSON (without file_data to save space)
   */
  exportMetadata() {
    const leases = SessionStorageService.getLeases()
    const metadata = leases.map(lease => ({
      id: lease.id,
      property_address: lease.property_address,
      tenant_name: lease.tenant_name,
      file_name: lease.file_name,
      file_size: lease.file_size,
      created_at: lease.created_at,
      updated_at: lease.updated_at
    }))
    console.log(JSON.stringify(metadata, null, 2))
    return metadata
  },

  /**
   * Clear all data
   */
  clearAll() {
    if (confirm('Clear all session storage data?')) {
      SessionStorageService.clearAll()
      console.log('✓ All data cleared')
    }
  },

  /**
   * Add test data
   */
  addTestData(count: number = 3) {
    console.log(`Adding ${count} test leases...`)
    for (let i = 1; i <= count; i++) {
      SessionStorageService.addLease({
        id: `test-${Date.now()}-${i}`,
        user_id: 'test-user',
        tenant_name: `Test Tenant ${i}`,
        property_address: `${i * 100} Test Street, City, State`,
        monthly_rent: `${1000 + i * 500}`,
        lease_start: '2024-01-01',
        lease_end: '2025-01-01',
        due_date: '1st',
        late_fee: '5%',
        security_deposit: `${1000 + i * 500}`,
        utilities: 'Tenant pays all',
        parking: `${i} space${i > 1 ? 's' : ''}`,
        pets: i % 2 === 0 ? 'Allowed' : 'Not allowed',
        smoking: 'No',
        file_url: `https://example.com/test-${i}.pdf`,
        file_name: `test-lease-${i}.pdf`,
        file_size: 1024 * i,
        confidence_score: 0.85 + (i * 0.05),
        analysis_data: {},
        portfolio_impact: {},
        compliance_assessment: {},
        strategic_recommendations: {},
        created_at: new Date(Date.now() - i * 60000).toISOString(),
        updated_at: new Date().toISOString()
      })
    }
    console.log(`✓ Added ${count} test leases`)
  }
}

// Make available in browser console during development
if (typeof window !== 'undefined') {
  (window as any).SessionDebug = SessionDebug
}

// Log available commands
console.log('Session Storage Debug Utilities loaded. Available commands:')
console.log('  SessionDebug.printAll()       - Print all leases')
console.log('  SessionDebug.printStats()     - Print storage statistics')
console.log('  SessionDebug.getLease(id)     - Get lease by ID')
console.log('  SessionDebug.search(query)    - Search leases')
console.log('  SessionDebug.exportMetadata() - Export lease metadata as JSON')
console.log('  SessionDebug.clearAll()       - Clear all data')
console.log('  SessionDebug.addTestData(n)   - Add n test leases')
