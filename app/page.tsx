import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to the application dashboard
  redirect('/app')
}

