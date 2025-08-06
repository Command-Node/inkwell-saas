#!/bin/bash

echo "🎯 InkWell Email Configuration Setup"
echo "=================================="
echo ""

# Check if environment variables are set
echo "📋 Checking Environment Variables..."
if grep -q "REACT_APP_DOMAIN=inkwellwrite.com" .env; then
    echo "✅ Domain configuration found"
else
    echo "❌ Domain configuration missing"
fi

if grep -q "REACT_APP_SITE_URL=https://inkwellwrite.com" .env; then
    echo "✅ Site URL configuration found"
else
    echo "❌ Site URL configuration missing"
fi

if grep -q "REACT_APP_SYSTEM_EMAIL=noreply@inkwellwrite.com" .env; then
    echo "✅ System email configuration found"
else
    echo "❌ System email configuration missing"
fi

echo ""
echo "🔧 Supabase Dashboard Configuration Required:"
echo "============================================"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/settings/general"
echo "2. Update Site URL to: https://inkwellwrite.com"
echo "3. Add these Redirect URLs:"
echo "   - https://inkwellwrite.com/dashboard"
echo "   - https://inkwellwrite.com/auth/callback"
echo "   - https://inkwellwrite.com/reset-password"
echo ""
echo "4. Go to: https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]/settings/auth/email-templates"
echo "5. Update email templates with InkWell branding (see SUPABASE_EMAIL_CONFIG.md)"
echo ""
echo "6. Configure SMTP settings:"
echo "   - Host: smtp.inkwellwrite.com"
echo "   - Port: 587"
echo "   - Username: noreply@inkwellwrite.com"
echo "   - Password: [Your SMTP password]"
echo ""
echo "📧 Email Templates Available:"
echo "============================="
echo "✅ Signup confirmation template"
echo "✅ Password reset template"
echo "✅ Magic link template"
echo ""
echo "🧪 Testing:"
echo "==========="
echo "1. Start your development server: npm start"
echo "2. Go to: http://localhost:3000"
echo "3. Test email functionality using the login/register forms"
echo "4. Check your email for InkWell branded templates"
echo ""
echo "📁 Files Created:"
echo "================="
echo "✅ SUPABASE_EMAIL_CONFIG.md - Complete configuration guide"
echo "✅ src/EmailTestComponent.tsx - Email testing component"
echo "✅ Updated .env with domain configuration"
echo "✅ Updated AuthContext with proper redirect URLs"
echo ""
echo "🚀 Next Steps:"
echo "=============="
echo "1. Configure your Supabase dashboard settings"
echo "2. Set up email hosting for inkwellwrite.com"
echo "3. Test email delivery"
echo "4. Deploy to production with new domain"
echo ""
echo "📞 Support:"
echo "==========="
echo "If you need help with email configuration, contact:"
echo "Email: support@inkwellwrite.com"
echo "Domain: https://inkwellwrite.com"
echo "" 