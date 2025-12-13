import Sidebar from '@/components/dashboard/Sidebar'
import Navbar from '@/components/dashboard/Navbar'

// Import debug utilities for development
if (process.env.NODE_ENV === 'development') {
  import('@/lib/sessionStorageDebug')
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-slate-50 px-4 py-8 text-slate-800 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  )
} 