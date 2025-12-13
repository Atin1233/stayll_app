# Lease Data Extraction System

## Overview
Implemented automated lease data extraction following the Bootstrap Build Manual (Component 3: Deterministic Rule Engine).

## How It Works

### 1. Upload Flow
```
User uploads PDF
   ↓
Convert to base64
   ↓
Store in session storage
   ↓
Call extraction API
   ↓
Update lease with extracted data
   ↓
Display in UI
```

### 2. Extraction Process

**API Endpoint:** `/api/extract-lease`

**Technology:**
- `pdf-parse` - Extracts text from PDF
- Regex patterns - Finds specific fields using patterns

**Fields Extracted:**
- ✅ Property Address
- ✅ Tenant Name  
- ✅ Monthly Rent
- ✅ Lease Start Date
- ✅ Lease End Date
- ✅ Security Deposit
- ✅ Late Fee
- ✅ Confidence Score (%)

### 3. Extraction Patterns

Each field has multiple regex patterns to maximize success rate:

```javascript
property_address: [
  /(?:property|premises|located at|address)[\s:]+([^\n]{10,100})/i,
  /([0-9]+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave)...)/i,
]

monthly_rent: [
  /(?:monthly rent|base rent)[\s:$]+(\d{1,3}(?:,\d{3})*)/i,
  /\$(\d{1,3}(?:,\d{3})*)\\s*per month/i,
]
```

## Testing the Extraction

### Step 1: Upload a Lease
1. Go to `/app/contracts`
2. Upload a PDF lease document
3. Watch for blue progress bar: "Uploading and extracting data..."
4. Wait for green success message

### Step 2: View Extracted Data
1. The lease appears in the "Contracts" list
2. Look for:
   - Property address (if found)
   - Tenant name (if found)
   - Confidence score badge (e.g., "71% confidence")
3. Click the eye icon to view all extracted fields

### Step 3: Check the Console
Open browser DevTools console to see detailed extraction logs:

```
[Extract] Extracted text length: 5432
[Extract] Found property_address: 123 Main Street
[Extract] Found tenant_name: John Doe
[Extract] Found monthly_rent: 2,500.00
[Extract] Extraction complete: {fieldsFound: 5, totalFields: 7, confidence: 71}
[v5/leaseStorage] Extraction successful: {...}
[Upload] Confidence: 71%
```

## Current Capabilities

### ✅ Working
- PDF text extraction
- Basic field detection using regex
- Confidence scoring
- Automatic extraction on upload
- Display extracted data in UI
- Session storage integration

### 🚧 To Enhance (Per Bootstrap Manual)

**Component 2: OCR Layer (Google Document AI)**
- Better handling of scanned PDFs
- Table extraction
- Form field detection

**Component 4: LLM Fallback (GPT-4/Claude)**
- Use AI for fields not found by regex
- Handle complex clauses
- Natural language understanding

**Component 5: Reconciliation Engine**
- Validate extracted data
- Cross-check relationships (dates, amounts)
- Flag inconsistencies

**Component 6: Human QA UI**
- Retool interface for verification
- Edit capabilities
- Audit trail

## Improving Extraction Accuracy

### Adding More Patterns

Edit `/app/api/extract-lease/route.ts`:

```typescript
const EXTRACTION_PATTERNS = {
  your_field: [
    /pattern1/i,
    /pattern2/i,
    // Add more patterns
  ],
};
```

### Testing Patterns

1. Upload a test lease
2. Check console for what was extracted
3. Add patterns for missed fields
4. Test again

### Common Patterns

**Addresses:**
- `123 Main Street, City, State`
- `Property located at: [address]`

**Money:**
- `$1,234.56`
- `1234.56 per month`
- `Monthly rent: $1,234`

**Dates:**
- `12/31/2024`
- `December 31, 2024`
- `Commencing January 1, 2024`

## Example Output

### Before Extraction
```json
{
  "property_address": null,
  "tenant_name": null,
  "monthly_rent": null
}
```

### After Extraction
```json
{
  "property_address": "123 Main Street, City, State 12345",
  "tenant_name": "John Doe",
  "monthly_rent": "2,500.00",
  "lease_start": "01/01/2024",
  "lease_end": "12/31/2024",
  "security_deposit": "5,000.00",
  "confidence_score": 86
}
```

## Next Steps

### Phase 1: Enhance Patterns (2-4 hours)
- Test on 20 real leases
- Document failure cases
- Add patterns for each failure
- Aim for 80%+ confidence

### Phase 2: Add Google Document AI (4 hours)
- Set up Google Cloud account
- Enable Document AI API
- Integrate for table extraction
- Handle scanned documents

### Phase 3: Add LLM Fallback (3 hours)
- Set up OpenAI/Claude API
- Create prompt with 10-shot examples
- Use for fields regex can't find
- Combine results with confidence scores

### Phase 4: Add Reconciliation (6 hours)
- Implement validators
- Check data relationships
- Flag inconsistencies
- Auto-fix common issues

### Phase 5: Human QA (8 hours)
- Set up Retool workspace
- Build verification UI
- Add edit capabilities
- Implement approval workflow

## Debug Commands

### Check Extraction Results
```javascript
// In browser console:
SessionDebug.printAll()  // See all leases
const leases = SessionStorageService.getLeases()
console.log(leases[0])  // See extracted fields
```

### Test Extraction Manually
```javascript
// Create test form data
const formData = new FormData()
formData.append('fileData', 'data:application/pdf;base64,...')

// Call extraction
fetch('/api/extract-lease', {
  method: 'POST',
  body: formData
})
  .then(r => r.json())
  .then(console.log)
```

## Troubleshooting

### No Data Extracted
- Check console for extraction logs
- Verify PDF has readable text (not scanned image)
- Check regex patterns match your lease format
- Look at raw extracted text length

### Low Confidence Score
- Normal for complex leases
- Add more regex patterns
- Consider adding LLM fallback
- Review which fields are missing

### Wrong Data Extracted
- Check regex patterns
- Add more specific patterns
- Add validation rules
- Implement reconciliation checks

## Files Modified

- `/app/api/extract-lease/route.ts` - Extraction endpoint
- `/lib/v5/leaseStorage.ts` - Triggers extraction after upload
- `/lib/sessionStorage.ts` - Updated interface for extracted fields
- `/app/app/contracts/page.tsx` - Enhanced upload feedback
- `/components/dashboard/LeaseList.tsx` - Display extracted data

## Resources

- Bootstrap Build Manual: Component 3 (Deterministic Rule Engine)
- pdf-parse documentation: https://www.npmjs.com/package/pdf-parse
- Regex testing: https://regex101.com/
- Google Document AI: https://cloud.google.com/document-ai
- OpenAI API: https://platform.openai.com/docs
