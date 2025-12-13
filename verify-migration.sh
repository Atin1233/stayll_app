#!/bin/bash

# Supabase Migration Verification Script
# Checks that all old Supabase references have been removed

echo "🔍 Supabase Migration Verification Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Old and new project IDs
OLD_PROJECT="aytforkoygjgyxwwlpby"
NEW_PROJECT="ktmgqbgrntgkzencxqhs"

echo "Old Project: $OLD_PROJECT"
echo "New Project: $NEW_PROJECT"
echo ""

# Check 1: Search for old project references (exclude cleanup docs)
echo "📋 Check 1: Searching for old project references..."
OLD_REFS=$(grep -r "$OLD_PROJECT" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git \
  --exclude="*.log" \
  --exclude="OLD_SUPABASE_CLEANUP.md" \
  --exclude="verify-migration.sh" \
  . 2>/dev/null | wc -l)

if [ "$OLD_REFS" -eq 0 ]; then
  echo -e "${GREEN}✅ PASS: No old project references found${NC}"
else
  echo -e "${RED}❌ FAIL: Found $OLD_REFS references to old project${NC}"
  echo "   Run: grep -r '$OLD_PROJECT' --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git ."
fi
echo ""

# Check 2: Verify .env.local exists and contains new project
echo "📋 Check 2: Verifying .env.local configuration..."
if [ -f ".env.local" ]; then
  if grep -q "$NEW_PROJECT" .env.local; then
    echo -e "${GREEN}✅ PASS: .env.local contains new project URL${NC}"
  else
    echo -e "${RED}❌ FAIL: .env.local does not contain new project URL${NC}"
  fi
else
  echo -e "${RED}❌ FAIL: .env.local not found${NC}"
fi
echo ""

# Check 3: Verify no hardcoded keys in TypeScript/JavaScript files
echo "📋 Check 3: Checking for hardcoded Supabase keys in code..."
HARDCODED_KEYS=$(grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJ" \
  --include="*.ts" \
  --include="*.tsx" \
  --include="*.js" \
  --include="*.jsx" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  . 2>/dev/null | \
  grep -v "ANON_KEY" | \
  grep -v "SERVICE_ROLE" | \
  wc -l)

if [ "$HARDCODED_KEYS" -eq 0 ]; then
  echo -e "${GREEN}✅ PASS: No hardcoded JWT keys in code files${NC}"
else
  echo -e "${YELLOW}⚠️  WARNING: Found $HARDCODED_KEYS potential hardcoded keys${NC}"
  echo "   Review these files manually"
fi
echo ""

# Check 4: Verify lib/supabase.ts uses environment variables
echo "📋 Check 4: Verifying lib/supabase.ts uses env vars..."
if [ -f "lib/supabase.ts" ]; then
  if grep -q "process.env.NEXT_PUBLIC_SUPABASE_URL" lib/supabase.ts; then
    echo -e "${GREEN}✅ PASS: lib/supabase.ts uses environment variables${NC}"
  else
    echo -e "${RED}❌ FAIL: lib/supabase.ts may have hardcoded values${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  WARNING: lib/supabase.ts not found${NC}"
fi
echo ""

# Check 5: Verify temp files updated
echo "📋 Check 5: Checking supabase/.temp/ files..."
if [ -f "supabase/.temp/project-ref" ]; then
  TEMP_PROJECT=$(cat supabase/.temp/project-ref)
  if [ "$TEMP_PROJECT" == "$NEW_PROJECT" ]; then
    echo -e "${GREEN}✅ PASS: supabase/.temp/project-ref updated${NC}"
  else
    echo -e "${RED}❌ FAIL: supabase/.temp/project-ref still has old project${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  INFO: supabase/.temp/project-ref not found (may not exist yet)${NC}"
fi
echo ""

# Check 6: Count references to new project
echo "📋 Check 6: Verifying new project references..."
NEW_REFS=$(grep -r "$NEW_PROJECT" \
  --exclude-dir=node_modules \
  --exclude-dir=.next \
  --exclude-dir=.git \
  --exclude="*.log" \
  . 2>/dev/null | wc -l)

if [ "$NEW_REFS" -gt 0 ]; then
  echo -e "${GREEN}✅ PASS: Found $NEW_REFS references to new project${NC}"
else
  echo -e "${RED}❌ FAIL: No references to new project found${NC}"
fi
echo ""

# Check 7: Verify migration documentation exists
echo "📋 Check 7: Checking migration documentation..."
DOCS_FOUND=0
[ -f "MIGRATION_README.md" ] && ((DOCS_FOUND++))
[ -f "COMPLETE_MIGRATION.sql" ] && ((DOCS_FOUND++))
[ -f "QUICK_START.md" ] && ((DOCS_FOUND++))

if [ "$DOCS_FOUND" -eq 3 ]; then
  echo -e "${GREEN}✅ PASS: All migration documentation found${NC}"
else
  echo -e "${YELLOW}⚠️  WARNING: Some migration docs missing (found $DOCS_FOUND/3)${NC}"
fi
echo ""

# Final summary
echo "=========================================="
echo "🎯 SUMMARY"
echo "=========================================="

TOTAL_CHECKS=7
PASSED=0

[ "$OLD_REFS" -eq 0 ] && ((PASSED++))
[ -f ".env.local" ] && grep -q "$NEW_PROJECT" .env.local && ((PASSED++))
[ "$HARDCODED_KEYS" -eq 0 ] && ((PASSED++))
[ -f "lib/supabase.ts" ] && grep -q "process.env" lib/supabase.ts && ((PASSED++))
[ -f "supabase/.temp/project-ref" ] && [ "$(cat supabase/.temp/project-ref)" == "$NEW_PROJECT" ] && ((PASSED++))
[ "$NEW_REFS" -gt 0 ] && ((PASSED++))
[ "$DOCS_FOUND" -eq 3 ] && ((PASSED++))

echo "Checks Passed: $PASSED/$TOTAL_CHECKS"
echo ""

if [ "$PASSED" -eq "$TOTAL_CHECKS" ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
  echo ""
  echo "Your migration is clean and ready to proceed."
  echo "Next step: Run COMPLETE_MIGRATION.sql in Supabase SQL Editor"
else
  echo -e "${YELLOW}⚠️  Some checks need attention${NC}"
  echo ""
  echo "Review the failed checks above before proceeding."
fi

echo ""
echo "For more details, see: OLD_SUPABASE_CLEANUP.md"
