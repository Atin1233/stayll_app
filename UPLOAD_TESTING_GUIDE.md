# Lease Upload Testing Guide

## What I Fixed

### 1. PDF Extraction Error
- **Problem**: `pdf-parse` library wasn't loading correctly with ES6 imports
- **Solution**: Changed to use `require()` for the CommonJS module in the Node.js API route

### 2. Session Storage Events
- **Problem**: UI wasn't refreshing when leases were added
- **Solution**: Added event dispatching in `SessionStorageService.addLease()`

### 3. Fields Display
- **Problem**: Fields API returned empty results in test mode
- **Solution**: Updated fields API to read from session storage and convert lease data to field format

## How to Test

### Step 1: Check Browser Console
Open your browser's developer tools (F12) and go to the Console tab. This will show detailed logs of what's happening.

### Step 2: Upload a Lease
1. Go to `/app/contracts`
2. Upload a PDF lease document
3. Watch the console for these logs:
   - `[v5/leaseStorage] Storing lease in session storage`
   - `[Extract] Starting extraction...`
   - `[Extract] Extracted text length: XXX`
   - `[Extract] Found property_address: ...`
   - `[v5/leaseStorage] Extraction successful!`

### Step 3: Check the Lease List
After upload, the lease should appear in the list on the right side with:
- Property address
- Tenant name
- Confidence score (if extraction worked)

### Step 4: View Lease Details
Click on the uploaded lease to view its details. You should see:
- Extracted fields displayed
- No "Error: Failed to fetch fields" message

### Step 5: Check Server Logs
In your terminal where `pnpm dev` is running, you should see:
```
[Extract] Loading pdf-parse module...
[Extract] Module loaded, type: function
[Extract] Calling pdf-parse...
[Extract] Extracted text length: XXX
[Extract] Found monthly_rent: 1200
[Extract] Extraction complete: { fieldsFound: X, totalFields: 7, confidence: XX }
```

## Troubleshooting

### If extraction still fails:
Check the terminal for errors. If you see "Module not found: pdf-parse", run:
```bash
pnpm install pdf-parse
```

### If fields don't display:
1. Open browser console
2. Look for `[LeaseFieldsDisplay]` logs
3. Check if session storage has the lease data:
   ```javascript
   SessionDebug.printAll()
   ```

### If lease list doesn't update:
1. Manually refresh with the "Refresh" button
2. Check browser console for event listener errors
3. Verify session storage:
   ```javascript
   SessionDebug.printStats()
   ```

## Known Issues

### Insights & Reports Pages
These currently show static filler data and don't pull from uploaded leases. This is a separate issue from the upload functionality.

To make these work with real data, they would need to:
1. Fetch leases from session storage
2. Calculate real metrics from the lease data
3. Generate reports based on actual extracted fields

This is lower priority than getting the core upload/extraction working.
