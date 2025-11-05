#!/bin/bash

echo "🧪 Starting FPS Calculator Test Suite..."
echo "=========================================="

# Start the Python HTTP server in background
echo "🚀 Starting local web server..."
cd "$(dirname "$0")"
python3 -m http.server 8000 &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Run Playwright tests
echo "▶️  Running Playwright tests..."
npx playwright test

# Capture test exit code
TEST_EXIT_CODE=$?

# Kill the server
echo "🛑 Stopping web server..."
kill $SERVER_PID

# Show results
echo ""
echo "=========================================="
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ All tests passed!"
else
    echo "❌ Some tests failed. Exit code: $TEST_EXIT_CODE"
fi
echo "=========================================="

# Open report
echo "📊 Opening test report..."
npx playwright show-report

exit $TEST_EXIT_CODE