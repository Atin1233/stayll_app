# STAYLL MVP - EXTREMELY DETAILED INTERNAL APPLICATION DESCRIPTION

**Version:** Current MVP (Pre-Migration)  
**Date:** January 2025  
**Status:** Production MVP - Current Implementation

---

## TABLE OF CONTENTS

1. [Application Overview](#1-application-overview)
2. [Technology Stack & Architecture](#2-technology-stack--architecture)
3. [Authentication System](#3-authentication-system)
4. [Database Schema](#4-database-schema)
5. [File Storage System](#5-file-storage-system)
6. [Core Features - Lease Management](#6-core-features---lease-management)
7. [AI Analysis Engine](#7-ai-analysis-engine)
8. [User Interface Components](#8-user-interface-components)
9. [API Endpoints](#9-api-endpoints)
10. [Data Flow & Processing](#10-data-flow--processing)
11. [UI/UX Features](#11-uiux-features)
12. [Security & Access Control](#12-security--access-control)
13. [Error Handling & Edge Cases](#13-error-handling--edge-cases)
14. [Known Limitations & Technical Debt](#14-known-limitations--technical-debt)

---

## 1. APPLICATION OVERVIEW

### 1.1 Purpose
Stayll MVP is a web-based lease management platform that allows property managers and landlords to:
- Upload lease documents (PDF format)
- Automatically extract lease information using AI
- Store and manage lease documents securely
- Analyze lease terms, risks, and compliance
- View extracted data and AI-generated insights
- Manage tenant information
- Track lease-related communications

### 1.2 Application Type
- **Framework:** Next.js 15.1.6 (React 19.0.0)
- **Language:** TypeScript 5.7.3
- **Deployment:** Server-side rendered (SSR) with client-side interactivity
- **Architecture:** Full-stack application with API routes

### 1.3 Core Value Proposition
The MVP provides a foundation for commercial real estate lease document management with basic AI-powered extraction and analysis capabilities.

---

## 2. TECHNOLOGY STACK & ARCHITECTURE

### 2.1 Frontend Stack
- **Framework:** Next.js 15.1.6 with App Router
- **React:** Version 19.0.0
- **UI Library:** Tailwind CSS 4.0.3
- **Components:** 
  - @headlessui/react 2.2.0
  - @heroicons/react 2.2.0
- **File Upload:** react-dropzone 14.3.8
- **Animations:** AOS (Animate On Scroll) 3.0.0-beta.6

### 2.2 Backend Stack
- **Runtime:** Node.js (via Next.js API routes)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **File Storage:** Supabase Storage
- **AI Processing:** 
  - Google AI (planned/integration started)
  - Enhanced regex-based analysis (current implementation)
  - Fallback pattern matching

### 2.3 Development Tools
- **Package Manager:** pnpm
- **Type Checking:** TypeScript
- **Build Tool:** Next.js built-in
- **Version Control:** Git

### 2.4 Application Structure
```
/app                    # Next.js App Router
  /(auth)              # Authentication routes (signin, signup, reset-password)
  /(default)           # Public landing page
  /app                 # Protected application routes
    /leases            # Lease management page
    /tenants           # Tenant management page
    /messages          # Messages page (placeholder)
    /settings          # User settings page
  /api                 # API routes
    /upload-lease      # Lease upload endpoint
    /leases            # Lease CRUD operations
    /analyze-lease     # Lease analysis endpoint
    /stayll-analyze    # STAYLL AI analysis endpoint
    /test-*            # Test endpoints for development
/components            # React components
  /dashboard           # Dashboard-specific components
  /auth                # Authentication components
  /ui                  # Reusable UI components
/lib                   # Core business logic
  /leaseStorage.ts     # Lease storage service
  /leaseAnalysis.ts   # Basic lease analysis
  /stayllAI.ts         # STAYLL AI engine
  /aiModel.ts          # AI model integration
  /googleAI.ts         # Google AI integration
  /supabase.ts         # Supabase client
/types                 # TypeScript type definitions
```

---

## 3. AUTHENTICATION SYSTEM

### 3.1 Authentication Provider
- **Service:** Supabase Auth
- **Methods Supported:**
  - Email/Password authentication
  - Google OAuth (via Supabase)
  - Password reset functionality

### 3.2 Authentication Flow

#### 3.2.1 Sign Up Flow
1. User visits `/auth/register` or `/signup`
2. User enters email and password OR clicks "Sign Up with Google"
3. For Google OAuth:
   - User redirected to Google authentication
   - Callback handled at `/auth/callback`
   - User redirected to dashboard
4. For email/password:
   - Account created in Supabase
   - Email verification sent (if configured)
   - User redirected to dashboard

#### 3.2.2 Sign In Flow
1. User visits `/auth/login` or `/signin`
2. User enters credentials OR clicks "Sign In with Google"
3. Supabase authenticates user
4. Session cookie created
5. User redirected to `/app` (dashboard)

#### 3.2.3 Session Management
- **Session Storage:** HTTP-only cookies (via Supabase SSR helpers)
- **Session Duration:** Managed by Supabase (default: 1 week)
- **Refresh:** Automatic token refresh handled by Supabase
- **Logout:** Clears session cookie and Supabase session

### 3.3 Authentication Components

#### 3.3.1 GoogleSignIn Component
- **Location:** `components/auth/GoogleSignIn.tsx`
- **Functionality:**
  - Initiates OAuth flow with Supabase
  - Handles loading states
  - Redirects to callback URL
  - Error handling for failed authentication

#### 3.3.2 AuthGuard Component
- **Location:** `components/auth/AuthGuard.tsx`
- **Functionality:**
  - Protects routes requiring authentication
  - Redirects unauthenticated users to login
  - Shows loading state during auth check

#### 3.3.3 UserProfile Component
- **Location:** `components/auth/UserProfile.tsx`
- **Functionality:**
  - Displays current user information
  - Handles user profile display

### 3.4 Authentication Hooks
- **useUser Hook:** `lib/hooks/useUser.ts`
  - Provides current user data
  - Handles loading states
  - Manages authentication state

### 3.5 Authentication Pages
- `/auth/login` - Sign in page
- `/auth/register` - Sign up page
- `/auth/callback` - OAuth callback handler
- `/signin` - Alternative sign in route
- `/signup` - Alternative sign up route
- `/reset-password` - Password reset page

---

## 4. DATABASE SCHEMA

### 4.1 Database Provider
- **Service:** Supabase (PostgreSQL)
- **Connection:** Via Supabase client library
- **Row Level Security (RLS):** Enabled on all tables

### 4.2 Tables

#### 4.2.1 `leases` Table
**Purpose:** Stores lease document metadata and extracted data

**Schema:**
```sql
CREATE TABLE leases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Lease Information
  tenant_name TEXT,
  property_address TEXT,
  monthly_rent TEXT,
  lease_start DATE,
  lease_end DATE,
  due_date TEXT,
  late_fee TEXT,
  security_deposit TEXT,
  
  -- Additional Information
  utilities TEXT,
  parking TEXT,
  pets TEXT,
  smoking TEXT,
  
  -- File Information
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  
  -- Analysis Data
  confidence_score DECIMAL(5,2),
  analysis_data JSONB,              -- Full STAYLL analysis results
  portfolio_impact JSONB,           -- Portfolio analysis data
  compliance_assessment JSONB,       -- Compliance check results
  strategic_recommendations JSONB,  -- Strategic insights
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_leases_user_id` - On user_id for fast user queries
- `idx_leases_created_at` - On created_at for chronological sorting
- `idx_leases_confidence_score` - On confidence_score for filtering

**RLS Policies:**
- Users can SELECT only their own leases
- Users can INSERT leases with their user_id
- Users can UPDATE only their own leases
- Users can DELETE only their own leases

**Data Types:**
- `TEXT` fields: Store extracted lease information as strings
- `JSONB` fields: Store complex nested analysis data
- `DECIMAL(5,2)`: Confidence score (0.00-100.00)
- `DATE`: Date fields for lease start/end
- `TIMESTAMP WITH TIME ZONE`: Automatic timestamps

#### 4.2.2 `lease_analyses` Table
**Purpose:** Stores detailed analysis history for audit trail

**Schema:**
```sql
CREATE TABLE lease_analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lease_id UUID REFERENCES leases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  analysis_type TEXT NOT NULL,        -- 'STAYLL', 'basic', 'compliance', etc.
  analysis_data JSONB NOT NULL,       -- Full analysis results
  confidence_score DECIMAL(5,2),
  processing_time_ms INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_lease_analyses_lease_id` - For querying by lease
- `idx_lease_analyses_user_id` - For querying by user
- `idx_lease_analyses_created_at` - For chronological sorting

**RLS Policies:**
- Users can SELECT only their own analyses
- Users can INSERT analyses with their user_id

#### 4.2.3 `user_profiles` Table (Optional)
**Purpose:** Stores user preferences and extended profile information

**Schema:**
```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  company TEXT,
  role TEXT,
  portfolio_size INTEGER,
  preferences JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**RLS Policies:**
- Users can SELECT their own profile
- Users can UPDATE their own profile
- Users can INSERT their own profile

### 4.3 Database Relationships
- `leases.user_id` → `auth.users.id` (One-to-Many: User has many Leases)
- `lease_analyses.lease_id` → `leases.id` (One-to-Many: Lease has many Analyses)
- `lease_analyses.user_id` → `auth.users.id` (One-to-Many: User has many Analyses)

### 4.4 Database Operations
All database operations go through Supabase client with:
- Automatic RLS enforcement
- Type-safe queries via TypeScript
- Error handling for missing tables/permissions
- Transaction support (where applicable)

---

## 5. FILE STORAGE SYSTEM

### 5.1 Storage Provider
- **Service:** Supabase Storage
- **Bucket:** `leases`
- **Access:** Private (authenticated users only)

### 5.2 Storage Structure
```
leases/
  └── {user_id}/
      └── {timestamp}-{original_filename}
```

**Example:**
```
leases/
  └── 550e8400-e29b-41d4-a716-446655440000/
      └── 2025-01-15T10-30-45-123Z-lease-agreement.pdf
```

### 5.3 File Upload Process
1. **Client Side:**
   - User selects PDF file via dropzone
   - File validated (type, size)
   - FormData created with file + metadata

2. **API Route (`/api/upload-lease`):**
   - Receives FormData
   - Validates authentication
   - Validates file (PDF, <50MB)
   - Generates unique filename: `{userId}/{timestamp}-{originalName}`
   - Uploads to Supabase Storage bucket `leases`
   - Gets public URL for file
   - Creates database record in `leases` table
   - Links file_url to stored file

3. **Error Handling:**
   - If storage upload fails: Returns error, no DB record
   - If DB insert fails: Deletes uploaded file, returns error
   - If table doesn't exist: Returns helpful error message

### 5.4 File Access
- **Public URLs:** Generated via Supabase Storage `getPublicUrl()`
- **Access Control:** Handled by Supabase Storage policies
- **File Retrieval:** Direct URL access (no signed URLs in MVP)

### 5.5 File Deletion
When a lease is deleted:
1. Database record deleted from `leases` table
2. File deleted from Supabase Storage
3. Cascading deletes handle `lease_analyses` records

### 5.6 Storage Policies
- **Upload:** Users can upload to their own `{user_id}/` folder
- **Read:** Users can read files in their own folder
- **Delete:** Users can delete files in their own folder
- **List:** Users can list files in their own folder

---

## 6. CORE FEATURES - LEASE MANAGEMENT

### 6.1 Lease Upload Flow

#### 6.1.1 Upload Interface
**Component:** `components/dashboard/UploadDropzone.tsx`

**Features:**
- Drag-and-drop file upload
- Click to select file
- File type validation (PDF only)
- File size validation (50MB max)
- Optional property address input
- Optional tenant name input
- Visual feedback for drag state
- Loading state during upload
- Success/error message display

**User Experience:**
1. User navigates to `/app/leases`
2. Sees upload form on left side
3. Can optionally enter property address and tenant name
4. Drags PDF file or clicks to select
5. File automatically uploads when selected
6. Success message appears
7. Lease list refreshes automatically

#### 6.1.2 Upload Processing
**Service:** `lib/leaseStorage.ts` → `LeaseStorageService.uploadLease()`

**Process:**
1. Client creates FormData with:
   - `file`: PDF file
   - `propertyAddress`: Optional string
   - `tenantName`: Optional string
2. POST request to `/api/upload-lease`
3. Server validates:
   - Authentication (user must be logged in)
   - File exists and is PDF
   - File size < 50MB
4. Server generates filename: `{userId}/{timestamp}-{originalName}`
5. Server uploads to Supabase Storage
6. Server creates database record with:
   - File metadata (name, size, URL)
   - User-provided metadata (address, tenant name)
   - Timestamps
   - Empty analysis fields (to be populated later)
7. Server returns lease record to client
8. Client displays success message
9. Client refreshes lease list

### 6.2 Lease List Management

#### 6.2.1 Lease List Display
**Component:** `components/dashboard/LeaseList.tsx`

**Features:**
- Displays all user's leases
- Search functionality (property, tenant, filename)
- Lease count display
- Loading state
- Error state with retry
- Empty state message
- Individual lease cards with:
  - Property address
  - Tenant name
  - Upload date
  - File name
  - File size
  - Confidence score (if analyzed)
- Action buttons:
  - View lease details
  - Edit lease (placeholder)
  - Delete lease

#### 6.2.2 Lease Data Fetching
**Service:** `lib/leaseStorage.ts` → `LeaseStorageService.fetchLeases()`

**Process:**
1. Client calls `fetchLeases()` with optional filters
2. GET request to `/api/leases` with query parameters
3. Server queries database:
   - Filters by user_id (RLS enforced)
   - Optional filtering by property address or tenant name
   - Pagination support (limit/offset)
   - Ordered by created_at DESC (newest first)
4. Server returns leases array + count
5. Client displays leases in list
6. Client enables search filtering

#### 6.2.3 Lease Details View
**Location:** `app/app/leases/page.tsx` (selected lease section)

**Features:**
- Displays when lease is selected from list
- Shows comprehensive lease information:
  - Property Information:
    - Address
    - Tenant name
    - Monthly rent
    - Security deposit
  - Lease Terms:
    - Start date
    - End date
    - Due date
    - Late fee
  - File Information:
    - File name
    - Upload date
    - Confidence score
    - Link to view file
- Close button to dismiss details

### 6.3 Lease Deletion

#### 6.3.1 Deletion Process
**Service:** `lib/leaseStorage.ts` → `LeaseStorageService.deleteLease()`

**Process:**
1. User clicks delete button on lease card
2. Confirmation dialog appears
3. If confirmed:
   - DELETE request to `/api/leases` with leaseId
   - Server verifies lease belongs to user
   - Server deletes database record
   - Server deletes file from storage
   - Server returns success
4. Client removes lease from list
5. Client shows success message

**Error Handling:**
- If lease not found: 404 error
- If unauthorized: 403 error
- If storage delete fails: Logged but doesn't fail request
- If database delete fails: 500 error

### 6.4 Lease Editing
**Status:** Placeholder (not implemented)
- Edit button exists but only logs to console
- TODO: Implement edit functionality

---

## 7. AI ANALYSIS ENGINE

### 7.1 Analysis Architecture

The MVP includes multiple layers of analysis:

1. **Basic Regex Extraction** (`lib/leaseAnalysis.ts`)
2. **Enhanced Regex Analysis** (`lib/googleAI.ts`)
3. **STAYLL AI Engine** (`lib/stayllAI.ts`)
4. **AI Model Integration** (`lib/aiModel.ts`)

### 7.2 Basic Lease Analysis

#### 7.2.1 Text Extraction
**Function:** `extractTextFromPDF()` in `lib/leaseAnalysis.ts`

**Current Implementation:**
- **Mock Implementation:** Returns predefined mock lease text
- **Reason:** PDF parsing library not integrated
- **Mock Texts:** 3 different sample lease documents
- **Selection:** Based on file name length + file size (simulates variety)

**Future Implementation:**
- Would use PDF.js or similar library
- Would extract actual text from PDF binary
- Would handle OCR for scanned PDFs

#### 7.2.2 Data Extraction Patterns
**Function:** `extractLeaseData()` in `lib/leaseAnalysis.ts`

**Regex Patterns Used:**
- **Rent:** `/(?:rent|monthly rent|monthly payment|base rent|amount)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi`
- **Dates:** `/(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2}|\w+ \d{1,2},? \d{4}|\d{1,2}\/\d{1,2}\/\d{2})/gi`
- **Addresses:** `/(\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Place|Pl|Court|Ct|Way|Circle|Cir|Terrace|Ter|Highway|Hwy|Parkway|Pkwy)[,\s]*[A-Za-z\s,]+(?:[A-Z]{2}\s*\d{5}(?:-\d{4})?|\d{5}(?:-\d{4})?))/gi`
- **Names:** `/(?:tenant|lessee|resident|occupant|tenant name)[:\s]*([A-Z][a-z]+ [A-Z][a-z]+)/gi`
- **Late Fees:** `/(?:late fee|late charge|late payment)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi`
- **Security Deposit:** `/(?:security deposit|deposit|security)[:\s]*\$?([0-9,]+(?:\.[0-9]{2})?)/gi`
- **Due Dates:** `/(?:due|payment due|rent due)[:\s]*(\d{1,2}(?:st|nd|rd|th)?\s+(?:day|of each month|monthly))/gi`

**Extracted Fields:**
- `monthly_rent`: String with currency symbol
- `lease_start`: ISO date string
- `lease_end`: ISO date string
- `due_date`: String description
- `late_fee`: String with currency symbol
- `security_deposit`: String with currency symbol
- `property_address`: Full address string
- `tenant_name`: Full name string
- `utilities`: "Included", "Tenant pays", or "Not specified"
- `parking`: "Included", "Not included", or "Not specified"
- `pets`: "Not allowed", "Allowed", or "Not specified"
- `smoking`: "Not allowed", "Allowed", or "Not specified"

#### 7.2.3 Confidence Calculation
**Function:** `calculateConfidence()` in `lib/leaseAnalysis.ts`

**Scoring System:**
- Monthly rent found: +20 points
- Lease start date found: +15 points
- Lease end date found: +15 points
- Property address found: +20 points
- Tenant name found: +15 points
- Due date found: +10 points
- Late fee found: +5 points
- **Total possible:** 100 points
- **Returns:** Minimum of calculated score and 100

### 7.3 STAYLL AI Engine

#### 7.3.1 Comprehensive Analysis
**Function:** `analyzeLeaseWithSTAYLL()` in `lib/stayllAI.ts`

**Analysis Components:**

1. **Basic Data Extraction**
   - Uses enhanced regex patterns
   - Extracts: tenant name, property address, rent, term, deposit, fees, dates

2. **Clause Analysis**
   - Analyzes 8 clause types:
     - Rent terms
     - Lease term
     - CAM/OPEX
     - Security deposit
     - Tenant rights
     - Landlord duties
     - Penalties
     - Termination
     - Special provisions
   - For each clause:
     - Extracts data using patterns
     - Identifies risk factors
     - Calculates confidence
     - Generates recommendations
     - Compares to market (placeholder)

3. **Risk Analysis**
   - Calculates overall risk score (0-100)
   - Categorizes risk level: low, medium, high, critical
   - Identifies:
     - Missing clauses
     - Problematic clauses
     - Cash flow risks
     - Legal risks
     - Market risks
   - Generates recommendations

4. **Format Analysis**
   - Evaluates document quality (0-100 score)
   - Checks:
     - Data completeness (tenant, address, rent, term)
     - Document structure (sections, paragraphs)
     - Date presence
     - Signature/execution provisions
     - Legal language usage
     - Lease provision coverage
     - Compliance language
   - Identifies:
     - Critical issues
     - Formatting problems
     - Missing sections
     - Red flags
   - Generates recommendations

5. **Market Insights**
   - Compares rent to market (placeholder)
   - Provides market position assessment
   - Identifies trends (placeholder)
   - **Note:** Market data currently hardcoded/mocked

6. **Portfolio Impact**
   - Calculates:
     - Annual revenue
     - Total lease value
     - Monthly cash flow
     - ROI estimate
   - Assesses:
     - Risk exposure
     - Portfolio risk contribution
     - Diversification impact
   - Evaluates:
     - Market positioning
     - Competitive position
     - Growth potential

7. **Compliance Assessment**
   - Checks for required compliance language:
     - Fair Housing Act
     - Security deposit handling
     - Lead paint disclosure
     - Mold disclosure
     - Bed bug disclosure
     - Smoke detector requirements
     - Carbon monoxide detector
   - Calculates compliance score (0-100)
   - Lists compliance issues
   - Provides recommended actions

8. **Strategic Recommendations**
   - Immediate actions (0-30 days)
   - Strategic planning (30-90 days)
   - Long-term vision (90+ days)
   - Portfolio optimization strategies

9. **Action Items**
   - Immediate (0-7 days)
   - Upcoming (7-30 days)
   - Long-term (30+ days)

#### 7.3.2 Analysis Output Structure
**Interface:** `STAYLLAnalysis` in `lib/stayllAI.ts`

```typescript
{
  lease_summary: {
    property_address: string,
    tenant_name: string,
    lease_term: string,
    base_rent: string,
    total_value: string,
    legal_strength: "strong" | "weak" | "neutral"
  },
  clause_analysis: ClauseAnalysis[],
  risk_analysis: RiskAnalysis,
  action_items: {
    immediate: string[],
    upcoming: string[],
    long_term: string[]
  },
  market_insights: {
    your_rent: string,
    market_average: string,
    market_position: string,
    trends: string[]
  },
  format_analysis: FormatAnalysis,
  confidence_score: number,
  portfolio_impact: {
    revenue_impact: {...},
    risk_exposure: {...},
    market_positioning: {...}
  },
  compliance_assessment: {
    compliance_score: number,
    compliance_issues: string[],
    regulatory_requirements: string[],
    recommended_actions: string[]
  },
  strategic_recommendations: {
    immediate_actions: string[],
    strategic_planning: string[],
    long_term_vision: string[],
    portfolio_optimization: string[]
  }
}
```

### 7.4 AI Model Integration

#### 7.4.1 Google AI Integration
**File:** `lib/googleAI.ts`

**Current Status:**
- Integration started but not fully implemented
- Uses enhanced regex-based analysis as fallback
- Functions prepared for Google AI API calls
- Currently uses `performEnhancedAnalysis()` as fallback

**Planned Functionality:**
- `analyzeWithGoogleAI()` - Main entry point
- Task-specific functions:
  - `extractLeaseDataEnhanced()`
  - `classifyClausesEnhanced()`
  - `assessRiskEnhanced()`
  - `generateRecommendationsEnhanced()`
  - `comprehensiveAnalysisEnhanced()`

#### 7.4.2 AI Model Wrapper
**File:** `lib/aiModel.ts`

**Purpose:** Unified interface for AI analysis

**Functions:**
- `analyzeWithAI()` - Main entry point
- Routes to Google AI or fallback methods
- Handles errors gracefully
- Returns consistent response format

**Response Format:**
```typescript
{
  success: boolean,
  data: any,
  confidence?: number,
  model_used?: string,
  error?: string,
  tokens_used?: number
}
```

### 7.5 Analysis API Endpoints

#### 7.5.1 `/api/stayll-analyze`
**Purpose:** Standalone STAYLL analysis (no storage)

**Method:** POST

**Request:**
- FormData with:
  - `file`: PDF file
  - `propertyType`: "residential" | "commercial" (optional)

**Process:**
1. Validates file (PDF, exists)
2. Extracts text from PDF
3. Runs `analyzeLeaseWithSTAYLL()`
4. Returns complete analysis

**Response:**
```json
{
  "success": true,
  "analysis": { /* STAYLLAnalysis object */ },
  "fileInfo": {
    "name": string,
    "size": number,
    "type": string,
    "propertyType": string
  }
}
```

#### 7.5.2 `/api/analyze-lease`
**Purpose:** Analyze existing lease and save results

**Method:** POST

**Request:**
```json
{
  "leaseId": "uuid",
  "analysisData": { /* analysis results */ }
}
```

**Process:**
1. Validates user authentication
2. Verifies lease belongs to user
3. Updates lease record with:
   - `analysis_data`: Full analysis
   - `confidence_score`: Analysis confidence
   - Extracted fields (if available)
4. Creates `lease_analyses` record for history
5. Returns updated lease

**Response:**
```json
{
  "success": true,
  "lease": { /* LeaseRecord */ },
  "analysis": { /* analysis data */ },
  "message": "Lease analysis completed and saved"
}
```

### 7.6 Analysis Display

#### 7.6.1 STAYLLAnalysisDisplay Component
**Location:** `components/STAYLLAnalysisDisplay.tsx`

**Features:**
- Comprehensive analysis visualization
- Sections:
  - Executive Summary
  - Portfolio Impact Analysis
    - Revenue Impact
    - Risk Exposure
    - Market Positioning
  - Compliance Assessment
  - Strategic Recommendations
  - Risk Assessment
  - Action Items (immediate, upcoming, long-term)
  - Market Insights
  - Document Quality Assessment
  - Technical Analysis

**Visual Elements:**
- Color-coded risk levels
- Progress bars for scores
- Icons for different sections
- Responsive grid layouts
- Expandable/collapsible sections (via styling)

---

## 8. USER INTERFACE COMPONENTS

### 8.1 Layout Components

#### 8.1.1 Navbar
**Component:** `components/dashboard/Navbar.tsx`

**Features:**
- Application logo/branding
- Navigation links
- User profile access
- Logout functionality

#### 8.1.2 Sidebar
**Component:** `components/dashboard/Sidebar.tsx`

**Features:**
- Navigation menu
- Current page highlighting
- Responsive (collapsible on mobile)
- Links to:
  - Dashboard
  - Leases
  - Tenants
  - Messages
  - Settings

### 8.2 Dashboard Page

#### 8.2.1 Dashboard Overview
**Location:** `app/app/page.tsx`

**Features:**
- Welcome message with user name
- Quick stats cards:
  - Total Leases (currently hardcoded to 0)
  - Active Tenants (currently hardcoded to 0)
  - Unread Messages (currently hardcoded to 0)
  - Rent Due Soon (currently hardcoded to 0)
- Getting Started section with 3 steps:
  1. Upload your first lease
  2. Add tenant information
  3. Track rent payments

**Note:** Stats are placeholders - not connected to real data

### 8.3 Leases Page

#### 8.3.1 Page Layout
**Location:** `app/app/leases/page.tsx`

**Layout:**
- Two-column grid (on large screens)
- Left column: Upload section
- Right column: Lease list
- Bottom section: Selected lease details (when lease selected)

**Features:**
- Authentication check
- Loading state
- Error handling
- Upload success/error messages
- Lease selection
- Lease details display

### 8.4 Tenants Page

#### 8.4.1 Tenant Management
**Location:** `app/app/tenants/page.tsx`

**Current Status:** Mock data display

**Features:**
- Stats cards:
  - On Time payments
  - Late payments
  - Due Soon payments
- Tenant list with:
  - Tenant name
  - Status badge (on-time, late, due-soon)
  - Property address
  - Rent amount
  - Lease dates
  - Action buttons (View Lease, Contact)

**Note:** Uses hardcoded mock data, not connected to database

### 8.5 Messages Page

#### 8.5.1 Messaging Interface
**Location:** `app/app/messages/page.tsx`

**Current Status:** Placeholder with "Coming Soon" message

**Features:**
- "Coming Soon" banner explaining AI auto-reply functionality
- Mock messages list:
  - Message from
  - Subject
  - Message preview
  - Timestamp
  - Unread indicator
- Feature preview cards:
  - Auto-Reply
  - Smart Routing
  - Analytics

**Note:** No backend functionality - purely UI mockup

### 8.6 Settings Page

#### 8.6.1 User Settings
**Location:** `app/app/settings/page.tsx`

**Features:**
- Account Information:
  - Email display (read-only)
  - Account created date
- Change Password:
  - New password input
  - Confirm password input
  - Show/hide password toggle
  - Update button
  - Success/error messages
- API Keys:
  - Placeholder section
  - "Coming Soon" message
- Danger Zone:
  - Delete account button
  - Confirmation required
  - Warning message

**Functionality:**
- Password update via Supabase Auth
- Account deletion (requires admin API - may not work in MVP)
- All changes require authentication

### 8.7 Landing Page

#### 8.7.1 Public Homepage
**Location:** `app/(default)/page.tsx`

**Components:**
- PageIllustration
- Hero section
- Workflows section
- Features section
- Differentiation section
- Pricing section
- FAQ section
- CTA section

**Purpose:** Marketing/landing page for public visitors

### 8.8 Upload Components

#### 8.8.1 UploadDropzone
**Component:** `components/dashboard/UploadDropzone.tsx`

**Technology:** react-dropzone library

**Features:**
- Drag-and-drop zone
- Click to select file
- File type restriction (PDF only)
- Visual feedback:
  - Border color changes on drag
  - Loading state
  - Disabled state
- Optional form fields:
  - Property address input
  - Tenant name input
- Upload requirements display
- Success/error message display

**Validation:**
- Client-side: File type, visual feedback
- Server-side: File type, size, authentication

---

## 9. API ENDPOINTS

### 9.1 Authentication Endpoints

#### 9.1.1 `/auth/callback`
**Method:** GET

**Purpose:** OAuth callback handler

**Process:**
1. Receives OAuth callback from Supabase
2. Exchanges code for session
3. Redirects to dashboard

### 9.2 Lease Management Endpoints

#### 9.2.1 `/api/upload-lease`
**Method:** POST

**Request:** FormData
- `file`: PDF file (required)
- `propertyAddress`: string (optional)
- `tenantName`: string (optional)

**Response:**
```json
{
  "success": true,
  "lease": { /* LeaseRecord */ },
  "fileUrl": "string",
  "message": "Lease uploaded successfully"
}
```

**Errors:**
- 400: No file provided, invalid file type, file too large
- 401: Not authenticated
- 500: Upload failed, database error, storage error

#### 9.2.2 `/api/leases`
**Method:** GET

**Query Parameters:**
- `propertyAddress`: string (optional, partial match)
- `tenantName`: string (optional, partial match)
- `limit`: number (default: 50)
- `offset`: number (default: 0)

**Response:**
```json
{
  "success": true,
  "leases": [ /* LeaseRecord[] */ ],
  "count": number,
  "pagination": {
    "limit": number,
    "offset": number,
    "hasMore": boolean
  }
}
```

**Method:** DELETE

**Request Body:**
```json
{
  "leaseId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lease deleted successfully"
}
```

**Errors:**
- 400: Lease ID required
- 401: Not authenticated
- 404: Lease not found
- 500: Delete failed

### 9.3 Analysis Endpoints

#### 9.3.1 `/api/stayll-analyze`
**Method:** POST

**Request:** FormData
- `file`: PDF file (required)
- `propertyType`: "residential" | "commercial" (optional)

**Response:**
```json
{
  "success": true,
  "analysis": { /* STAYLLAnalysis */ },
  "fileInfo": {
    "name": string,
    "size": number,
    "type": string,
    "propertyType": string
  }
}
```

**Errors:**
- 400: No file, invalid file type, no text extracted
- 500: Analysis failed

#### 9.3.2 `/api/analyze-lease`
**Method:** POST

**Request Body:**
```json
{
  "leaseId": "uuid",
  "analysisData": { /* analysis results */ }
}
```

**Response:**
```json
{
  "success": true,
  "lease": { /* LeaseRecord */ },
  "analysis": { /* analysis data */ },
  "message": "Lease analysis completed and saved"
}
```

**Errors:**
- 400: Missing leaseId or analysisData
- 401: Not authenticated
- 404: Lease not found
- 500: Save failed

### 9.4 Test Endpoints

**Note:** These are for development/testing only

#### 9.4.1 `/api/test-upload`
- Mock upload endpoint for testing without Supabase

#### 9.4.2 `/api/test-leases`
- Mock leases endpoint for testing without Supabase

#### 9.4.3 `/api/test-db`
- Database connection test

#### 9.4.4 `/api/test-storage`
- Storage connection test

#### 9.4.5 `/api/test-pdf`
- PDF processing test

#### 9.4.6 `/api/hello`
- Simple health check endpoint

### 9.5 Utility Endpoints

#### 9.5.1 `/api/setup-storage`
- Storage bucket setup utility

#### 9.5.2 `/api/check-storage-policies`
- Storage policy verification

#### 9.5.3 `/api/diagnose-storage`
- Storage diagnostics

#### 9.5.4 `/api/leads`
- Lead capture endpoint (for marketing)

---

## 10. DATA FLOW & PROCESSING

### 10.1 Complete Lease Upload & Analysis Flow

#### 10.1.1 User Action
1. User navigates to `/app/leases`
2. User optionally enters property address and tenant name
3. User selects or drags PDF file
4. File uploads automatically

#### 10.1.2 Upload Processing
1. **Client:** `UploadDropzone` component calls `LeaseStorageService.uploadLease()`
2. **Client:** Creates FormData with file + metadata
3. **Network:** POST request to `/api/upload-lease`
4. **Server:** Validates authentication
5. **Server:** Validates file (type, size)
6. **Server:** Generates unique filename
7. **Server:** Uploads file to Supabase Storage
8. **Server:** Gets public URL
9. **Server:** Creates database record
10. **Server:** Returns lease record
11. **Client:** Shows success message
12. **Client:** Refreshes lease list

#### 10.1.3 Analysis Processing (Optional)
1. User clicks "Analyze" button (if implemented)
2. **Client:** Calls analysis endpoint
3. **Server:** Fetches lease file from storage
4. **Server:** Extracts text from PDF
5. **Server:** Runs basic extraction
6. **Server:** Runs STAYLL AI analysis
7. **Server:** Updates lease record with analysis
8. **Server:** Creates analysis history record
9. **Client:** Displays analysis results

### 10.2 Data Retrieval Flow

#### 10.2.1 Lease List Loading
1. User navigates to `/app/leases`
2. **Client:** `LeaseList` component mounts
3. **Client:** Calls `LeaseStorageService.fetchLeases()`
4. **Network:** GET request to `/api/leases`
5. **Server:** Queries Supabase with user_id filter (RLS enforced)
6. **Server:** Returns leases array
7. **Client:** Displays leases in list
8. **Client:** Enables search filtering

#### 10.2.2 Lease Details Loading
1. User clicks "View" on lease card
2. **Client:** Sets selected lease in state
3. **Client:** Displays lease details panel
4. **Client:** Shows all extracted fields
5. **Client:** Shows file information
6. **Client:** Shows analysis data (if available)

### 10.3 Authentication Flow

#### 10.3.1 Login Flow
1. User visits `/auth/login`
2. User enters credentials OR clicks Google sign-in
3. **Client:** Submits form or initiates OAuth
4. **Network:** Request to Supabase Auth
5. **Server:** Validates credentials
6. **Server:** Creates session
7. **Server:** Sets HTTP-only cookie
8. **Client:** Redirects to `/app`

#### 10.3.2 Session Validation
1. User navigates to protected route
2. **Client:** `AuthGuard` component checks authentication
3. **Client:** Calls `useUser()` hook
4. **Client:** Hook queries Supabase for user
5. **Supabase:** Validates session cookie
6. **Client:** Receives user data or null
7. **Client:** Redirects to login if not authenticated
8. **Client:** Renders protected content if authenticated

---

## 11. UI/UX FEATURES

### 11.1 Responsive Design
- **Mobile:** Single column layout
- **Tablet:** Two column layout
- **Desktop:** Multi-column layout with sidebar
- **Breakpoints:** Tailwind CSS default breakpoints

### 11.2 Loading States
- **Spinner:** Used during data fetching
- **Skeleton:** Not implemented (uses spinner)
- **Button Loading:** Disabled state + "Loading..." text
- **Upload Loading:** Disabled dropzone + "Uploading..." message

### 11.3 Error Handling
- **Error Messages:** Displayed in red alert boxes
- **Retry Buttons:** Provided for failed operations
- **Validation Errors:** Shown inline with form fields
- **API Errors:** Displayed as user-friendly messages

### 11.4 Success Feedback
- **Success Messages:** Green alert boxes
- **Auto-dismiss:** Success messages disappear after 3 seconds
- **Visual Confirmation:** Icons and color coding

### 11.5 Empty States
- **No Leases:** "No leases uploaded yet" message
- **No Search Results:** "No leases match your search" message
- **Empty Lists:** Centered text with helpful message

### 11.6 Search & Filtering
- **Search Bar:** Real-time filtering
- **Search Fields:** Property address, tenant name, filename
- **Case Insensitive:** All searches case-insensitive
- **Live Updates:** Results update as user types

### 11.7 Navigation
- **Sidebar Navigation:** Persistent on app pages
- **Breadcrumbs:** Not implemented
- **Back Button:** Browser back button
- **Active State:** Current page highlighted in sidebar

### 11.8 Accessibility
- **Semantic HTML:** Proper heading hierarchy
- **ARIA Labels:** Some icons have titles
- **Keyboard Navigation:** Standard HTML form elements
- **Color Contrast:** Tailwind defaults (should be verified)

---

## 12. SECURITY & ACCESS CONTROL

### 12.1 Authentication Security
- **Session Management:** HTTP-only cookies (via Supabase)
- **Token Storage:** Server-side only (no localStorage)
- **Password Hashing:** Handled by Supabase
- **OAuth Security:** Handled by Supabase + Google

### 12.2 Row Level Security (RLS)
- **Enabled:** On all custom tables
- **Policies:**
  - Users can only see their own data
  - Users can only create records with their user_id
  - Users can only update their own records
  - Users can only delete their own records
- **Enforcement:** Automatic by Supabase

### 12.3 API Security
- **Authentication Required:** All lease endpoints check auth
- **User Verification:** Server verifies user owns resource
- **Input Validation:** File type, size, format validation
- **SQL Injection:** Prevented by Supabase parameterized queries
- **XSS Protection:** React automatically escapes content

### 12.4 File Storage Security
- **Private Storage:** Files stored in private bucket
- **Access Control:** Storage policies restrict access
- **User Isolation:** Files stored in user-specific folders
- **Public URLs:** Generated but access controlled by policies

### 12.5 Data Privacy
- **User Data:** Only accessible by authenticated user
- **No Cross-User Access:** RLS prevents data leakage
- **File Deletion:** Cascading deletes remove all related data
- **Account Deletion:** User can delete account (if implemented)

---

## 13. ERROR HANDLING & EDGE CASES

### 13.1 Upload Errors
- **No File:** Error message, no upload attempted
- **Invalid File Type:** Error message, file rejected
- **File Too Large:** Error message, file rejected
- **Storage Failure:** Error message, database record not created
- **Database Failure:** Error message, uploaded file deleted
- **Network Failure:** Error message, retry option

### 13.2 Authentication Errors
- **Invalid Credentials:** Error message on login form
- **Expired Session:** Redirect to login
- **OAuth Failure:** Error message, retry option
- **Account Not Found:** Error message

### 13.3 Database Errors
- **Table Not Found:** Helpful error with setup instructions
- **Connection Failure:** Error message, retry option
- **RLS Violation:** 403 error (should not occur in normal flow)
- **Constraint Violation:** Error message with details

### 13.4 Analysis Errors
- **PDF Extraction Failure:** Falls back to mock data
- **No Text Extracted:** Error message, analysis skipped
- **AI Analysis Failure:** Falls back to basic extraction
- **Analysis Timeout:** Error message (if implemented)

### 13.5 Edge Cases Handled
- **Empty File:** Rejected before upload
- **Very Large Files:** Size limit enforced
- **Special Characters in Filenames:** Handled by URL encoding
- **Concurrent Uploads:** Handled by unique filenames
- **Missing Optional Fields:** Gracefully handled (defaults to "Not specified")
- **Invalid Dates:** Stored as strings, validated on display

---

## 14. KNOWN LIMITATIONS & TECHNICAL DEBT

### 14.1 PDF Processing
- **Current:** Mock text extraction (3 predefined leases)
- **Missing:** Real PDF parsing library integration
- **Impact:** Cannot analyze actual uploaded PDFs
- **Workaround:** Uses mock data based on filename

### 14.2 AI Integration
- **Current:** Enhanced regex-based analysis
- **Missing:** Full Google AI/Vertex AI integration
- **Impact:** Analysis is pattern-based, not true AI
- **Workaround:** Comprehensive regex patterns provide good results

### 14.3 Market Data
- **Current:** Hardcoded market data
- **Missing:** Real market data API integration
- **Impact:** Market comparisons are generic
- **Workaround:** Placeholder values shown

### 14.4 Tenant Management
- **Current:** Mock data display only
- **Missing:** Database table for tenants
- **Missing:** CRUD operations for tenants
- **Impact:** Cannot actually manage tenants
- **Workaround:** Static UI mockup

### 14.5 Messaging System
- **Current:** UI mockup only
- **Missing:** Database table for messages
- **Missing:** Message sending/receiving
- **Missing:** AI auto-reply functionality
- **Impact:** No messaging functionality
- **Workaround:** "Coming Soon" placeholder

### 14.6 Dashboard Statistics
- **Current:** Hardcoded zeros
- **Missing:** Real-time data aggregation
- **Impact:** Stats don't reflect actual data
- **Workaround:** Placeholder values

### 14.7 Lease Editing
- **Current:** Button exists but doesn't work
- **Missing:** Edit form/modal
- **Missing:** Update API endpoint
- **Impact:** Cannot edit lease information
- **Workaround:** Delete and re-upload

### 14.8 Analysis History
- **Current:** Table exists but not fully utilized
- **Missing:** Analysis history UI
- **Missing:** Comparison between analyses
- **Impact:** Cannot view analysis history
- **Workaround:** Data stored but not displayed

### 14.9 Search Functionality
- **Current:** Client-side filtering only
- **Missing:** Server-side search
- **Missing:** Full-text search
- **Impact:** Search limited to loaded leases
- **Workaround:** Loads all leases, filters client-side

### 14.10 Pagination
- **Current:** API supports pagination
- **Missing:** UI pagination controls
- **Impact:** All leases loaded at once
- **Workaround:** Limit may cause issues with many leases

### 14.11 File Size Limits
- **Current:** 50MB hard limit
- **Missing:** Configurable limits
- **Missing:** Compression for large files
- **Impact:** Large PDFs may fail to upload

### 14.12 Error Recovery
- **Current:** Basic error messages
- **Missing:** Automatic retry logic
- **Missing:** Offline support
- **Impact:** User must manually retry failed operations

### 14.13 Performance
- **Current:** No caching
- **Missing:** Client-side caching
- **Missing:** CDN for static assets
- **Impact:** Slower load times for repeat visits

### 14.14 Testing
- **Current:** Test endpoints exist
- **Missing:** Unit tests
- **Missing:** Integration tests
- **Missing:** E2E tests
- **Impact:** Manual testing required

### 14.15 Documentation
- **Current:** Code comments
- **Missing:** API documentation
- **Missing:** User guide
- **Missing:** Developer documentation
- **Impact:** Harder for new developers to onboard

---

## SUMMARY

The Stayll MVP is a functional foundation for lease document management with:

**Working Features:**
- User authentication (email/password + Google OAuth)
- Secure file upload and storage
- Database storage with RLS
- Basic lease information extraction
- Comprehensive STAYLL AI analysis (regex-based)
- Lease list management
- Search functionality
- Settings management

**Limitations:**
- Mock PDF text extraction
- No real AI integration (uses enhanced regex)
- Mock tenant data
- Placeholder messaging system
- No lease editing
- Hardcoded dashboard stats

**Architecture:**
- Modern Next.js 15 with App Router
- TypeScript for type safety
- Supabase for backend (database + storage + auth)
- Tailwind CSS for styling
- Component-based React architecture

**Security:**
- Row-level security enforced
- Authenticated API endpoints
- Private file storage
- User data isolation

The MVP provides a solid foundation that can be extended with real PDF parsing, actual AI integration, and additional features as needed.

---

**Document Version:** 1.0  
**Last Updated:** January 2025  
**Status:** Complete MVP Description

