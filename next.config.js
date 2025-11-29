/** @type {import('next').NextConfig} */
const nextConfig = {
  // Supabase Edge Functions are excluded via tsconfig.json
  // They use Deno imports (jsr:) and should only be built by Supabase CLI
  // Files in supabase/ directory are excluded from TypeScript compilation
};

module.exports = nextConfig;
