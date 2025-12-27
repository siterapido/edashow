#!/bin/bash

# Automated Sponsor Setup Script
# This script runs all necessary steps to set up the sponsor system

echo "🚀 Automated Sponsor Setup"
echo "=========================="
echo ""

# Check for Google API key
if [ -z "$GOOGLE_API_KEY" ] && [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ Error: GOOGLE_API_KEY or GEMINI_API_KEY not found in environment"
    echo ""
    echo "Please add one of these to your .env.local file:"
    echo "  GOOGLE_API_KEY=your_key_here"
    echo "  GEMINI_API_KEY=your_key_here"
    echo ""
    echo "Get your API key at: https://makersuite.google.com/app/apikey"
    exit 1
fi

echo "✅ Google API key found"
echo ""

# Step 1: Check if @google/generative-ai is installed
echo "📦 Step 1: Checking dependencies..."
if npm list @google/generative-ai > /dev/null 2>&1; then
    echo "✅ @google/generative-ai is installed"
else
    echo "⚠️  Installing @google/generative-ai..."
    npm install @google/generative-ai
fi
echo ""

# Step 2: Run AI logo analysis
echo "🤖 Step 2: Analyzing logos with AI..."
echo "This will take a few minutes (43 logos × ~2 seconds each)..."
echo ""
npx tsx scripts/analyze-sponsor-logos.ts
echo ""

if [ ! -f "scripts/sponsors_map.json" ]; then
    echo "❌ Error: sponsors_map.json was not generated"
    exit 1
fi

echo "✅ Logo analysis complete!"
echo ""

# Step 3: Import to database
echo "📤 Step 3: Uploading to database..."
echo ""
npx tsx scripts/import-sponsors.ts
echo ""

echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Visit http://localhost:3000/cms/sponsors to manage sponsors"
echo "2. Check http://localhost:3000 to see the sponsor carousel"
echo "3. Deploy to production when ready"
echo ""
