#!/bin/bash
# Railway Deployment Script

echo "🚀 Starting Railway Deployment..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login (will open browser)
echo "📱 Please login in the browser that opens..."
railway login

# Initialize project
echo ""
echo "📦 Initializing Railway project..."
railway init

# Deploy
echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment complete! Check your Railway dashboard for the URL."

