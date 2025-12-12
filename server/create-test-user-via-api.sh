#!/bin/bash

# Script to create test user via API
# Make sure your server is running first!

API_URL="${API_URL:-https://canhiringmob.onrender.com}"

echo "🔗 Creating test user via API..."
echo "📡 API URL: $API_URL"

curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Reviewer",
    "email": "reviewer@canhiring.com",
    "password": "Test@1234",
    "role": "user"
  }'

echo ""
echo ""
echo "✅ Test user creation request sent!"
echo "📧 Email: reviewer@canhiring.com"
echo "🔑 Password: Test@1234"

