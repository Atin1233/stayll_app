# 🚀 Google Vertex AI Setup Guide for STAYLL

This guide will walk you through setting up Google Vertex AI for advanced lease analysis in your STAYLL application.

## 📋 Prerequisites

- Google Cloud Platform account
- A Google Cloud Project
- Billing enabled on your GCP project
- Node.js and npm/pnpm installed

## 🔧 Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `stayll-ai-project` (or your preferred name)
4. Click "Create"

## 🔑 Step 2: Enable Required APIs

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search and enable these APIs:
   - **Vertex AI API**
   - **AI Platform API**
   - **Cloud Resource Manager API**

```bash
# Or use gcloud CLI (if installed)
gcloud services enable aiplatform.googleapis.com
gcloud services enable ml.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
```

## 💳 Step 3: Set Up Billing

1. Go to "Billing" in the Google Cloud Console
2. Link a payment method to your project
3. Note: Vertex AI has generous free tiers for development

## 🔐 Step 4: Create Service Account

1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. Fill in:
   - **Name**: `stayll-vertex-ai`
   - **Description**: `Service account for STAYLL Vertex AI integration`
4. Click "Create and Continue"
5. Grant these roles:
   - **Vertex AI User**
   - **AI Platform Developer**
   - **Storage Object Viewer** (if using cloud storage)
6. Click "Done"

## 📄 Step 5: Generate Service Account Key

1. Click on your service account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Download the key file
6. **IMPORTANT**: Store this file securely and never commit it to version control

## ⚙️ Step 6: Configure Environment Variables

### Option A: Local Development (using file path)

1. Copy your downloaded service account key to your project root
2. Add to `.env.local`:

```bash
# Google Cloud Project Configuration
GOOGLE_CLOUD_PROJECT_ID=your_project_id_here
GOOGLE_CLOUD_LOCATION=us-central1

# Vertex AI Model Configuration
VERTEX_AI_MODEL=gemini-1.5-flash

# Service Account Authentication
GOOGLE_APPLICATION_CREDENTIALS=./path/to/your/service-account-key.json
```

### Option B: Deployment (using JSON string)

For production deployment (Vercel, etc.), add the entire JSON content:

```bash
# Google Cloud Project Configuration
GOOGLE_CLOUD_PROJECT_ID=your_project_id_here
GOOGLE_CLOUD_LOCATION=us-central1

# Vertex AI Model Configuration
VERTEX_AI_MODEL=gemini-1.5-flash

# Service Account Authentication (JSON string)
GOOGLE_CLOUD_CREDENTIALS={"type":"service_account","project_id":"your_project_id","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

## 🧪 Step 7: Test Your Setup

Create a test file to verify your configuration:

```typescript
// test-vertex-ai.ts
import { analyzeWithVertexAI } from './lib/vertexAI';

async function testVertexAI() {
  const testLease = `
    LEASE AGREEMENT
    
    Tenant: John Doe
    Property: 123 Main St, Anytown, CA 12345
    Monthly Rent: $2,500
    Lease Term: 12 months
    Start Date: 01/01/2024
    End Date: 12/31/2024
    Security Deposit: $2,500
    Late Fee: $75
  `;

  try {
    const result = await analyzeWithVertexAI({
      text: testLease,
      task: 'extract_lease_data'
    });
    
    console.log('✅ Vertex AI Test Successful!');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Vertex AI Test Failed:', error);
  }
}

testVertexAI();
```

## 💰 Step 8: Understanding Costs

### Vertex AI Pricing (as of 2024)

- **Gemini 1.5 Flash**: 
  - Input: $0.075 per 1M tokens
  - Output: $0.30 per 1M tokens
- **Free Tier**: $300 credit for new users
- **Typical lease analysis**: ~$0.01-0.05 per document

### Cost Optimization Tips

1. Use `gemini-1.5-flash` for faster, cheaper analysis
2. Implement caching for repeated analyses
3. Set up billing alerts in Google Cloud Console
4. Use shorter prompts when possible

## 🚀 Step 9: Deploy to Production

### For Vercel Deployment:

1. Add environment variables in Vercel dashboard:
   - `GOOGLE_CLOUD_PROJECT_ID`
   - `GOOGLE_CLOUD_LOCATION`
   - `VERTEX_AI_MODEL`
   - `GOOGLE_CLOUD_CREDENTIALS` (full JSON string)

2. Deploy your application

### For Other Platforms:

Ensure your environment variables are properly set in your deployment platform.

## 🔍 Step 10: Monitor Usage

1. Go to Google Cloud Console → "Vertex AI" → "Usage"
2. Monitor your API calls and costs
3. Set up billing alerts for cost control

## 🛠️ Troubleshooting

### Common Issues:

1. **"Project not found"**
   - Verify `GOOGLE_CLOUD_PROJECT_ID` is correct
   - Ensure project exists and billing is enabled

2. **"Authentication failed"**
   - Check service account key is valid
   - Verify `GOOGLE_APPLICATION_CREDENTIALS` path
   - For deployment, ensure `GOOGLE_CLOUD_CREDENTIALS` is properly formatted

3. **"API not enabled"**
   - Enable Vertex AI API in Google Cloud Console
   - Wait a few minutes for API to propagate

4. **"Quota exceeded"**
   - Check your quota limits in Google Cloud Console
   - Consider upgrading your quota if needed

### Debug Commands:

```bash
# Test authentication
gcloud auth application-default print-access-token

# Check project
gcloud config get-value project

# List enabled APIs
gcloud services list --enabled
```

## 📚 Additional Resources

- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Gemini API Reference](https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference/gemini)
- [Google Cloud Pricing Calculator](https://cloud.google.com/products/calculator)
- [Service Account Best Practices](https://cloud.google.com/iam/docs/service-accounts)

## 🎉 You're Ready!

Once you've completed these steps, your STAYLL application will be powered by Google Vertex AI's advanced language models for comprehensive lease analysis!

### Next Steps:

1. Test the integration with sample lease documents
2. Monitor your usage and costs
3. Fine-tune prompts for your specific use cases
4. Consider implementing caching for better performance

---

**Need help?** Check the troubleshooting section above or refer to the Google Cloud documentation.
