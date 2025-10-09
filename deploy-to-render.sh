#!/bin/bash

# 🚀 CanHiring Backend Deployment Script for Render
# This script helps you deploy your backend to Render

echo "🚀 CanHiring Backend Deployment to Render"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if files exist
echo "📋 Checking required files..."

required_files=("render.yaml" "server/package.json" "server/server.js" "server/env.render.example")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo ""
echo "📝 Next Steps:"
echo "=============="
echo ""
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to https://render.com and sign up"
echo ""
echo "3. Create a new Web Service:"
echo "   - Connect your GitHub repository"
echo "   - Select 'CanHiringMob/CanHiringMob'"
echo "   - Use these settings:"
echo "     • Name: canhiring-backend"
echo "     • Environment: Node"
echo "     • Build Command: cd server && npm install"
echo "     • Start Command: cd server && npm start"
echo "     • Plan: Free"
echo ""
echo "4. Set Environment Variables:"
echo "   • NODE_ENV=production"
echo "   • PORT=10000"
echo "   • JWT_SECRET=your-super-secret-jwt-key"
echo "   • JWT_EXPIRE=7d"
echo "   • MONGODB_URI=your-mongodb-connection-string"
echo ""
echo "5. Create Database (optional):"
echo "   - Create a new PostgreSQL or MongoDB service on Render"
echo "   - Or use MongoDB Atlas (recommended)"
echo ""
echo "6. Deploy and test:"
echo "   - Click 'Create Web Service'"
echo "   - Wait for deployment"
echo "   - Test: https://your-service-name.onrender.com/api/health"
echo ""
echo "📖 For detailed instructions, see: RENDER_DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Happy deploying!"
