# InkWell Supabase Email Configuration Guide

## 🎯 **SUPABASE DASHBOARD CONFIGURATION**

### **1. Site URL Configuration**
**Location:** Supabase Dashboard → Settings → General

**Update these settings:**
```
Site URL: https://inkwellwrite.com
Redirect URLs: 
- https://inkwellwrite.com/dashboard
- https://inkwellwrite.com/auth/callback
- https://inkwellwrite.com/reset-password
```

### **2. Email Provider Configuration**
**Location:** Supabase Dashboard → Settings → Auth → Email Templates

**SMTP Settings:**
```
Host: smtp.inkwellwrite.com (or your email provider)
Port: 587 (or 465 for SSL)
Username: noreply@inkwellwrite.com
Password: [Your SMTP password]
```

### **3. Email Template Customization**

#### **Confirm Signup Email Template**
**Subject:** `Welcome to InkWell - Confirm Your Account`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to InkWell</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); padding: 40px 30px; text-align: center; }
        .logo { width: 60px; height: 60px; background: white; border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
        .logo-text { color: white; font-size: 28px; font-weight: bold; margin: 0; }
        .content { padding: 40px 30px; }
        .title { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 16px; }
        .text { color: #6b7280; line-height: 1.6; margin-bottom: 24px; }
        .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer a { color: #8B5CF6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📚</div>
            <h1 class="logo-text">InkWell</h1>
        </div>
        <div class="content">
            <h2 class="title">Welcome to InkWell!</h2>
            <p class="text">Thank you for joining InkWell! We're excited to help you transform your ideas into professionally formatted books with AI-powered creativity tools.</p>
            <p class="text">To complete your registration and start creating amazing content, please confirm your email address by clicking the button below:</p>
            <a href="{{ .ConfirmationURL }}" class="button">Confirm Email Address</a>
            <p class="text">If you didn't create an InkWell account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2024 InkWell. All rights reserved.</p>
            <p>Questions? Contact us at <a href="mailto:support@inkwellwrite.com">support@inkwellwrite.com</a></p>
        </div>
    </div>
</body>
</html>
```

#### **Reset Password Email Template**
**Subject:** `Reset Your InkWell Password`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - InkWell</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); padding: 40px 30px; text-align: center; }
        .logo { width: 60px; height: 60px; background: white; border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
        .logo-text { color: white; font-size: 28px; font-weight: bold; margin: 0; }
        .content { padding: 40px 30px; }
        .title { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 16px; }
        .text { color: #6b7280; line-height: 1.6; margin-bottom: 24px; }
        .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer a { color: #8B5CF6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📚</div>
            <h1 class="logo-text">InkWell</h1>
        </div>
        <div class="content">
            <h2 class="title">Reset Your Password</h2>
            <p class="text">We received a request to reset your InkWell password. If you made this request, click the button below to create a new password:</p>
            <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
            <p class="text">This link will expire in 24 hours. If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2024 InkWell. All rights reserved.</p>
            <p>Questions? Contact us at <a href="mailto:support@inkwellwrite.com">support@inkwellwrite.com</a></p>
        </div>
    </div>
</body>
</html>
```

#### **Magic Link Email Template**
**Subject:** `Sign In to InkWell`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign In - InkWell</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); padding: 40px 30px; text-align: center; }
        .logo { width: 60px; height: 60px; background: white; border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
        .logo-text { color: white; font-size: 28px; font-weight: bold; margin: 0; }
        .content { padding: 40px 30px; }
        .title { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 16px; }
        .text { color: #6b7280; line-height: 1.6; margin-bottom: 24px; }
        .button { display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; color: #6b7280; font-size: 14px; }
        .footer a { color: #8B5CF6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">📚</div>
            <h1 class="logo-text">InkWell</h1>
        </div>
        <div class="content">
            <h2 class="title">Sign In to InkWell</h2>
            <p class="text">Click the button below to securely sign in to your InkWell account:</p>
            <a href="{{ .ConfirmationURL }}" class="button">Sign In to InkWell</a>
            <p class="text">This link will expire in 24 hours. If you didn't request this sign-in link, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2024 InkWell. All rights reserved.</p>
            <p>Questions? Contact us at <a href="mailto:support@inkwellwrite.com">support@inkwellwrite.com</a></p>
        </div>
    </div>
</body>
</html>
```

### **4. Email Provider Setup**

#### **Option A: Custom SMTP (Recommended)**
1. **Set up email hosting** for `inkwellwrite.com`
2. **Configure SMTP settings** in Supabase:
   ```
   Host: smtp.inkwellwrite.com
   Port: 587
   Username: noreply@inkwellwrite.com
   Password: [Your SMTP password]
   ```

#### **Option B: Use Supabase's Email Service**
- Keep using Supabase's built-in email service
- Update sender email to `noreply@inkwellwrite.com`
- Customize templates as shown above

### **5. DNS Configuration**

**Add these DNS records for your domain:**
```
Type: MX
Name: @
Value: mail.inkwellwrite.com (or your email provider)
Priority: 10

Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
```

### **6. Testing Email Configuration**

**Test these scenarios:**
1. **User Registration** - Verify confirmation email
2. **Password Reset** - Verify reset email
3. **OAuth Sign-in** - Verify redirect URLs
4. **Email Templates** - Check branding consistency

### **7. Production Checklist**

- [ ] Update Site URL in Supabase Dashboard
- [ ] Configure SMTP settings
- [ ] Customize email templates
- [ ] Test all email flows
- [ ] Update redirect URLs
- [ ] Verify DNS settings
- [ ] Test OAuth providers
- [ ] Monitor email delivery

### **8. Environment Variables**

**Your updated .env file now includes:**
```
REACT_APP_DOMAIN=inkwellwrite.com
REACT_APP_SITE_URL=https://inkwellwrite.com
REACT_APP_REDIRECT_URL=https://inkwellwrite.com/dashboard
REACT_APP_SYSTEM_EMAIL=noreply@inkwellwrite.com
REACT_APP_SUPPORT_EMAIL=support@inkwellwrite.com
REACT_APP_MAIN_EMAIL=hello@inkwellwrite.com
```

## 🚀 **NEXT STEPS**

1. **Access your Supabase Dashboard**
2. **Update Site URL and Redirect URLs**
3. **Configure SMTP settings**
4. **Customize email templates**
5. **Test the complete email flow**

Your InkWell authentication system is now configured for professional email delivery with your new domain! 