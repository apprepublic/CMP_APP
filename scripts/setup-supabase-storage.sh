#!/bin/bash

# ============================================
# CMPapp Supabase Storage Setup Script
# ============================================
# This script helps you set up Supabase Storage
# ============================================

set -e

echo "🎵 CMPapp Supabase Storage Setup"
echo "================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found."
    echo ""
    echo "Please install it with:"
    echo "  npm install -g supabase"
    echo "  or"
    echo "  brew install supabase/tap/supabase"
    echo ""
    echo "Alternatively, you can run the SQL manually:"
    echo "1. Go to https://app.supabase.com"
    echo "2. Select your project"
    echo "3. Go to SQL Editor"
    echo "4. Copy and paste the contents of:"
    echo "   services/api/prisma/migrations/setup-storage.sql"
    echo "5. Click 'Run'"
    echo ""
    exit 1
fi

# Check if logged in
echo "🔐 Checking Supabase authentication..."
if ! supabase whoami &> /dev/null; then
    echo "❌ Not logged in to Supabase CLI"
    echo ""
    echo "Please login with:"
    echo "  supabase login"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI is installed and authenticated"
echo ""

# Get project ID
PROJECT_ID=${SUPABASE_PROJECT_ID:-""}

if [ -z "$PROJECT_ID" ]; then
    echo "📦 Enter your Supabase Project ID:"
    echo "   (Found in Project Settings > API > Project URL)"
    echo "   Example: abcdefghijklmnopqrst"
    read -p "Project ID: " PROJECT_ID
fi

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID is required"
    exit 1
fi

echo ""
echo "🎯 Setting up storage for project: $PROJECT_ID"
echo ""

# Link project
echo "🔗 Linking project..."
supabase link --project-ref "$PROJECT_ID" --no-db-password 2>/dev/null || true

# Run SQL script
SQL_FILE="services/api/prisma/migrations/setup-storage.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo "❌ SQL file not found: $SQL_FILE"
    exit 1
fi

echo "📄 Running SQL setup script..."
echo ""

# Execute SQL
supabase db execute --file "$SQL_FILE" --project-ref "$PROJECT_ID"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Storage setup completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Go to Storage in Supabase Dashboard"
    echo "   2. Verify buckets exist: music, task-attachments, profile-photos, cover-photos"
    echo "   3. Test file upload in your app"
    echo ""
    echo "🧪 Test the setup:"
    echo "   - Navigate to /tasks/post"
    echo "   - Select 'Stream Music' task type"
    echo "   - Upload an MP3 file"
    echo "   - Verify it appears in Storage bucket"
    echo ""
else
    echo ""
    echo "❌ Setup failed. Please check the error above."
    echo ""
    echo "Alternative: Run SQL manually in Supabase Dashboard"
    echo "1. Go to https://app.supabase.com"
    echo "2. Select your project"
    echo "3. Go to SQL Editor"
    echo "4. Copy and paste the SQL file contents"
    echo "5. Click 'Run'"
    exit 1
fi