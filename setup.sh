#!/bin/bash

echo "🚀 Setting up InkFlow - Voice-to-Book SaaS Platform"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Frontend: npm run dev (runs on http://localhost:3000)"
echo "2. Backend: cd backend && npm run dev (runs on http://localhost:5000)"
echo ""
echo "Or run both simultaneously:"
echo "Terminal 1: npm run dev"
echo "Terminal 2: cd backend && npm run dev"
echo ""
echo "Happy coding! 🚀" 