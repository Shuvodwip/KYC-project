#!/bin/bash
# Test script for LLM Integration

echo "=========================================="
echo "🧪 LLM Integration Test Script"
echo "=========================================="
echo ""

# Start backend
echo "1. Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"
sleep 3

# Test form submission
echo ""
echo "2. Submitting Test Form..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/kyc/submit \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Customer",
    "email": "test@example.com",
    "phone": "+1-555-0000",
    "dateOfBirth": "1990-01-01",
    "nationality": "American",
    "address": "123 Main St",
    "city": "TestCity",
    "employmentStatus": "Employed",
    "sourceOfFunds": "Salary"
  }')

SUBMISSION_ID=$(echo $RESPONSE | jq -r '.data.id')
echo "✅ Form Submitted! ID: $SUBMISSION_ID"

# Wait for LLM to generate summary
echo ""
echo "3. Waiting for LLM Summary Generation (5 seconds)..."
sleep 5

# Check if summary was generated
echo ""
echo "4. Checking Generated Summary..."
SUMMARY_RESPONSE=$(curl -s http://localhost:5000/api/kyc/summary/$SUBMISSION_ID)
SUMMARY=$(echo $SUMMARY_RESPONSE | jq -r '.data.summary')
echo "📝 Summary: $SUMMARY"

echo ""
echo "=========================================="
echo "✅ Test Complete!"
echo "=========================================="

# Cleanup
kill $BACKEND_PID
