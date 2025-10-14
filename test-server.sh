#!/bin/bash
echo "Starting development server..."
npm run dev &
DEV_PID=$!
sleep 5
echo "Checking if server is running on port 8080..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Server is running successfully!"
else
    echo "❌ Server failed to start properly"
fi
kill $DEV_PID 2>/dev/null
wait $DEV_PID 2>/dev/null
echo "Server stopped."