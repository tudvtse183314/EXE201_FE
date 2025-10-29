#!/bin/bash
# Script kiểm tra pattern gây spam request trong PetVibe Frontend

echo "🔍 Checking for spam request patterns in PetVibe Frontend..."
echo "============================================================"
echo ""

echo "📋 1. useEffect patterns (cần kiểm tra deps):"
echo "--------------------------------------------"
grep -RIn "useEffect(" src --include="*.jsx" --include="*.js" | head -30

echo ""
echo "📋 2. setInterval/setTimeout patterns (cần cleanup):"
echo "----------------------------------------------------"
grep -RIn "setInterval|setTimeout|useInterval" src --include="*.jsx" --include="*.js" | grep -v "node_modules"

echo ""
echo "📋 3. React Query/SWR patterns (refetch options):"
echo "-------------------------------------------------"
grep -RIn "refetchInterval|refetchOnWindowFocus|retry|useSWR|SWRConfig" src --include="*.jsx" --include="*.js" || echo "✅ Not found"

echo ""
echo "📋 4. Axios interceptors:"
echo "------------------------"
grep -RIn "interceptors.request|interceptors.response" src --include="*.jsx" --include="*.js"

echo ""
echo "📋 5. Service Worker registration:"
echo "-----------------------------------"
grep -RIn "serviceWorker|register(" src --include="*.jsx" --include="*.js" || echo "✅ Not found"

echo ""
echo "📋 6. HMR patterns:"
echo "------------------"
grep -RIn "module.hot|hot-update" src --include="*.jsx" --include="*.js" || echo "✅ Not found (HMR is Webpack built-in)"

echo ""
echo "✅ Scan completed!"

