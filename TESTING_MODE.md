# Testing Mode - Session-Based Storage

The application is now configured to run in **Test Mode** using browser session storage instead of Supabase. This allows you to test all features without needing a configured database or storage bucket.

## What is Test Mode?

Test Mode uses your browser's `sessionStorage` to temporarily store all lease data during your testing session. This means:

- ✅ **No Supabase required** - No database or storage bucket needed
- ✅ **Full functionality** - Upload, view, edit, delete leases work exactly as they would in production
- ✅ **Real file handling** - PDFs are converted to base64 and stored in the browser
- ✅ **Session persistence** - Data persists as long as the browser tab is open
- ⚠️ **Temporary storage** - Data is cleared when you close the browser tab
- ⚠️ **Browser limits** - sessionStorage has ~5-10MB limit (enough for testing)

## How to Use Test Mode

### 1. Upload Leases

Navigate to `/app/leases` and use the upload form:

1. (Optional) Enter property address and tenant name
2. Drag and drop a PDF file or click to select
3. The file will be uploaded and stored in session storage
4. You'll see the lease appear in the list immediately

### 2. View Leases

All uploaded leases appear in the "Your Leases" section:

- Click the **eye icon** to view lease details
- View extracted fields and metadata
- See file information and upload date

### 3. Manage Data

The yellow **"Test Mode"** banner at the top shows:

- Number of leases in session storage
- Button to clear all test data
- Reminder that data is temporary

### 4. Test the Full Workflow

You can test the complete lease management workflow:

```
Upload → View → Edit → Delete
```

All operations work against session storage, so you can verify:
- Upload validation (file type, size limits)
- List/search functionality
- CRUD operations
- UI/UX flow

## Architecture

### Files Modified for Test Mode

1. **`lib/sessionStorage.ts`** - Core session storage service
   - Manages lease data in browser sessionStorage
   - Handles file data as base64 strings
   - Provides CRUD operations

2. **`lib/leaseStorage.ts`** - Updated to use session storage
   - Redirects uploads to `/api/test-upload`
   - Reads/writes from sessionStorage
   - All operations work locally

3. **`lib/v5/leaseStorage.ts`** - V5 version also uses session storage
   - Consistent behavior with standard version
   - Compatible with V5 type system

4. **`app/api/test-upload/route.ts`** - Test upload endpoint
   - Converts PDF to base64
   - Returns lease data with embedded file
   - No actual storage required

5. **`components/dashboard/SessionDataManager.tsx`** - Test mode banner
   - Shows test mode status
   - Displays lease count
   - Provides "Clear All Data" button

6. **`components/dashboard/PDFViewer.tsx`** - PDF viewer component
   - Converts base64 back to blob URL
   - Displays PDFs in iframe
   - Works with session-stored files

## Switching Back to Production

When you're ready to use Supabase:

1. Configure your Supabase environment variables:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Update `lib/leaseStorage.ts` and `lib/v5/leaseStorage.ts`:
   - Change test endpoint back to production endpoints
   - Remove session storage overrides
   - Restore Supabase logic

3. The session storage code can remain as a fallback:
   ```typescript
   const endpoint = supabase ? '/api/upload-lease' : '/api/test-upload';
   ```

## Limitations

### Storage Limits
- **sessionStorage** typically allows 5-10MB per domain
- Each PDF is base64 encoded (increases size by ~33%)
- Recommended: Test with 5-10 small PDFs (< 1MB each)

### Data Persistence
- Data cleared when tab/browser closes
- Not shared between tabs
- Cannot be backed up or exported (yet)

### Features Not Available in Test Mode
- Real PDF OCR/extraction (returns mock data)
- External API integrations
- Multi-user/organization features
- Audit logging
- Email notifications

## Testing Checklist

Use this checklist to verify everything works:

- [ ] Upload a PDF lease document
- [ ] View the uploaded lease in the list
- [ ] Click to view lease details
- [ ] Search for a lease by property address
- [ ] Search for a lease by tenant name
- [ ] Edit lease information
- [ ] Delete a lease
- [ ] Upload multiple leases
- [ ] View PDF using the PDF viewer component
- [ ] Clear all test data using the banner button
- [ ] Verify data persists during the session
- [ ] Verify data clears when closing the browser tab

## Troubleshooting

### Upload fails with "No file provided"
- Ensure the file is a valid PDF
- Check file size is under 50MB

### Leases don't appear in the list
- Check browser console for errors
- Verify sessionStorage is enabled in your browser
- Try clearing all data and uploading again

### PDF viewer shows blank page
- Ensure the PDF uploaded successfully
- Check browser console for base64 conversion errors
- Try a different PDF file

### sessionStorage quota exceeded
- Clear test data using the banner button
- Upload smaller PDF files
- Test with fewer documents

## Next Steps

Once you've verified the UI/UX works in Test Mode:

1. ✅ Implement OCR/extraction logic
2. ✅ Set up Supabase database and storage
3. ✅ Configure environment variables
4. ✅ Switch endpoints back to production
5. ✅ Test with real Supabase integration

## Questions?

If you encounter issues with Test Mode:

1. Check the browser console for errors
2. Verify sessionStorage is working: `sessionStorage.getItem('stayll_session_leases')`
3. Review the files listed in "Architecture" section
4. Clear all test data and try again
