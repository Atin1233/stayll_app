import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Sidebar from '@/components/dashboard/Sidebar'
import Navbar from '@/components/dashboard/Navbar'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()

  // Check if Supabase environment variables are set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // If Supabase is not configured, show a setup message
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Setup Required
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Supabase environment variables are not configured. Please set up your Supabase project and add the required environment variables.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
} 