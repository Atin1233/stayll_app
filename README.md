# Stayll - AI Lease Analyst Platform

Stayll is an AI-powered lease and tenant intelligence platform that helps property managers, landlords, and investors understand their lease documents instantly.

## Features

- **AI Lease Analysis**: Upload any lease document and get instant analysis
- **Risk Flagging**: Automatically identify potential issues and risks
- **Tenant Management**: Track tenant status and payment history
- **Dashboard**: Clean, modern interface for managing your properties

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Set up environment variables (see `.env.template`)
4. Run the development server: `pnpm dev`

## Environment Variables

Copy `.env.template` to `.env.local` and fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

The app is automatically deployed to Vercel on every push to the main branch.

---

Built with ❤️ for property managers who deserve better tools.
