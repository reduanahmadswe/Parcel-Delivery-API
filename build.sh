#!/bin/bash

# Build script for deployment platforms that don't install devDependencies
echo "🚀 Starting deployment build..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Clean dist directory (cross-platform compatible)
echo "🧹 Cleaning previous build..."
rm -rf dist/*

# Build TypeScript
echo "🔨 Building TypeScript..."
npx tsc

echo "✅ Build completed successfully!"
echo "📁 Built files are in the 'dist' directory"
