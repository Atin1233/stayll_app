// Utility function to get the correct site URL
export function getSiteUrl(): string {
  // Check for environment variable first (for production)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Fallback to window.location.origin (for development)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Final fallback
  return 'http://localhost:3000';
}

// Get the correct redirect URL for authentication
export function getAuthRedirectUrl(path: string = '/auth/login'): string {
  const baseUrl = getSiteUrl();
  return `${baseUrl}${path}`;
} 