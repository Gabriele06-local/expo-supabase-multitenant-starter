#!/usr/bin/env bash
set -euo pipefail

echo "=== Expo + Supabase Multi-Tenant Starter — Setup ==="
echo ""

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required. Install from https://nodejs.org"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required. Install from https://docker.com"; exit 1; }
command -v supabase >/dev/null 2>&1 || { echo "❌ Supabase CLI is required. Install with: npm install -g supabase"; exit 1; }

echo "✅ Prerequisites satisfied"
echo ""

# Environment setup
if [ ! -f .env.local ]; then
  echo "Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "⚠️  Edit .env.local with your Supabase project credentials"
  echo ""
fi

# Install dependencies
echo "Installing dependencies..."
npm install
echo ""

# Start Supabase
echo "Starting Supabase local stack..."
supabase start
echo ""

# Run migrations
echo "Applying migrations..."
npm run db:migrate
echo ""

# Seed data
echo "Seeding demo data..."
npm run db:seed
echo ""

# Generate types
echo "Generating TypeScript types..."
npm run db:types
echo ""

echo "=== Setup complete! ==="
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with your Supabase credentials"
echo "  2. Run: npm run dev:mobile    (Expo app)"
echo "  3. Run: npm run dev:web       (Next.js app, optional)"
echo ""
echo "Demo accounts (created by seed):"
echo "  Owner: owner@acme.com / password123"
echo "  Admin: admin@acme.com / password123"
echo "  Staff: staff@acme.com / password123"
echo "  Customer: customer@acme.com / password123"
