# Dashboard PRD v8.0 Requirements Checklist

## Required Dashboard Features (Section 6.1 Workflow)

### ✅ Currently Implemented:
1. **Upload Interface** - Drag-and-drop batch PDFs
2. **Review Interface** - Side-by-side PDF viewer + extracted fields (LeaseFieldsDisplay component)
3. **Lease List** - Shows leases with status
4. **Field Display** - Shows extracted fields with clause linkage (source page/clause)

### ❌ Missing/Needs Enhancement:

1. **Portfolio Exposure Dashboard** (Section 6.1)
   - Total portfolio rent value
   - Number of leases
   - Monthly/annual exposure
   - Property breakdown

2. **Upcoming Renewals Tracking** (Section 6.1)
   - Renewal notice deadlines (90 days out)
   - Expiration dates
   - Renewal options
   - Alert system for approaching deadlines

3. **Escalation Alerts** (Section 6.1)
   - CPI escalations pending
   - Rent increase notifications
   - Escalation schedule visibility

4. **Rent Roll Generation** (Section 3.3)
   - ✅ API exists (`/api/v5/analytics/rent-roll`)
   - ❌ Not shown in dashboard UI
   - Need monthly/quarterly view

5. **Escalation Projection** (Section 3.3)
   - 5-year cashflow impact
   - CPI/% increase calculations
   - Not implemented in dashboard

6. **Exports** (Section 3.5)
   - ✅ CSV rent roll (API exists)
   - ❌ UI export button not connected
   - ❌ iCal compliance calendar export
   - ❌ PDF audit package

7. **Compliance Calendar** (Section 3.5)
   - Renewal dates
   - Expirations
   - Notice dates
   - ✅ Service exists (`ComplianceCalendarService`)
   - ❌ Not shown in dashboard
   - ❌ No iCal export UI

## Implementation Plan

### Phase 1: Dashboard Enhancements
1. Add portfolio exposure metrics card
2. Add upcoming renewals section
3. Add escalation alerts section
4. Connect to real data from APIs

### Phase 2: Export Functionality
1. Connect rent roll CSV export button
2. Add iCal compliance calendar export
3. Add PDF audit package export (future)

### Phase 3: Analytics Views
1. Add 5-year escalation projection view
2. Add rent roll table/graph view
3. Add portfolio analytics charts

