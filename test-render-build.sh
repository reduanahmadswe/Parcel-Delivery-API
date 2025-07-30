#!/bin/bash

# Render Build Test Script
echo "🔍 Testing Render build process locally..."
echo ""

echo "📦 Checking Node.js version:"
node --version
echo ""

echo "📦 Checking NPM version:"
npm --version
echo ""

echo "📋 Installing dependencies (production only):"
npm ci --production=false
echo ""

echo "🏗️ Running build command:"
npm run build:render
echo ""

echo "📁 Checking build output:"
ls -la dist/
echo ""

echo "✅ Build test complete!"
echo "📝 If this succeeds locally, Render should also succeed."
