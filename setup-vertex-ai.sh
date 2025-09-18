#!/bin/bash

# 🚀 STAYLL Vertex AI Setup Script
# This script sets up your environment variables for Vertex AI

echo "🎉 Setting up STAYLL with Google Vertex AI..."

# Create .env.local file
cat > .env.local << 'EOF'
# 🚀 STAYLL Google Vertex AI Configuration
# Generated automatically - DO NOT COMMIT TO VERSION CONTROL

# =============================================================================
# GOOGLE VERTEX AI CONFIGURATION
# =============================================================================

# Google Cloud Project Configuration
GOOGLE_CLOUD_PROJECT_ID=stayll-ai
GOOGLE_CLOUD_LOCATION=us-east4

# Vertex AI Model Configuration
VERTEX_AI_MODEL=gemini-1.0-pro

# Service Account Authentication (Local Development)
GOOGLE_APPLICATION_CREDENTIALS=./stayll-vertex-ai-key.json

# =============================================================================
# EXISTING CONFIGURATION (Add your existing values below)
# =============================================================================

# Add your existing environment variables here...
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app

# =============================================================================
# SETUP COMPLETE! 🎉
# =============================================================================
# 
# Your STAYLL application is now configured with Google Vertex AI!
# 
# Next steps:
# 1. Start your development server: npm run dev
# 2. Test the integration: node test-vertex-ai.js
# 3. Upload a lease document to see AI analysis in action
#
# For production deployment, you'll need to:
# 1. Add GOOGLE_CLOUD_CREDENTIALS with the full JSON content
# 2. Remove GOOGLE_APPLICATION_CREDENTIALS (file path not available in production)
#
# See VERTEX_AI_SETUP.md for complete documentation
EOF

echo "✅ Created .env.local with Vertex AI configuration"
echo "✅ Service account key downloaded: stayll-vertex-ai-key.json"
echo ""
echo "🚀 Next steps:"
echo "1. Start your development server:"
echo "   npm run dev"
echo ""
echo "2. Test the Vertex AI integration:"
echo "   node test-vertex-ai.js"
echo ""
echo "3. Open your browser and upload a lease document to test!"
echo ""
echo "🎉 Your STAYLL application is now powered by Google Vertex AI!"
