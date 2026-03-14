#!/usr/bin/env bash
# =============================================
# verify.sh — Donk AI smoke-test script
#
# Runs type-check, lint, tests, and build.
# Use this before committing or deploying.
#
# Usage:
#   chmod +x scripts/verify.sh
#   ./scripts/verify.sh
# =============================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

passed=0
failed=0

run_step() {
  local label="$1"
  shift
  printf "${YELLOW}▸ ${label}...${NC}\n"
  if "$@" > /dev/null 2>&1; then
    printf "  ${GREEN}✓ ${label}${NC}\n"
    ((passed++))
  else
    printf "  ${RED}✗ ${label}${NC}\n"
    ((failed++))
  fi
}

echo ""
echo "═══════════════════════════════════════"
echo "  Donk AI — Verification Suite"
echo "═══════════════════════════════════════"
echo ""

run_step "TypeScript type-check" npx tsc --noEmit
run_step "ESLint" npx next lint
run_step "Unit tests" npx vitest run
run_step "Production build" npx next build

echo ""
echo "═══════════════════════════════════════"
printf "  Results: ${GREEN}${passed} passed${NC}"
if [ "$failed" -gt 0 ]; then
  printf ", ${RED}${failed} failed${NC}"
fi
echo ""
echo "═══════════════════════════════════════"
echo ""

exit $failed
