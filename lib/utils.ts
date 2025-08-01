// Utility function to get the correct site URL
export function getSiteUrl(): string {
  // Check for environment variable first (for production)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    console.log('Using NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Hardcoded production URL fallback
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // We're in production but no env var set, use the current domain
    console.log('Using current domain in production:', window.location.origin);
    return window.location.origin;
  }
  
  // Fallback to window.location.origin (for development)
  if (typeof window !== 'undefined') {
    console.log('Using window.location.origin:', window.location.origin);
    return window.location.origin;
  }
  
  // Final fallback
  console.log('Using fallback localhost');
  return 'http://localhost:3000';
}

// Get the correct redirect URL for authentication
export function getAuthRedirectUrl(path: string = '/auth/login'): string {
  const baseUrl = getSiteUrl();
  const fullUrl = `${baseUrl}${path}`;
  console.log('Auth redirect URL:', fullUrl);
  return fullUrl;
}

// Debug function to check environment
export function debugEnvironment() {
  console.log('Environment check:');
  console.log('- NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  if (typeof window !== 'undefined') {
    console.log('- window.location.origin:', window.location.origin);
    console.log('- window.location.href:', window.location.href);
    console.log('- window.location.hostname:', window.location.hostname);
  }
} 