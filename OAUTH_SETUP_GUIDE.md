# InkWell OAuth Configuration Guide

## 🎯 **SUPABASE OAUTH SETUP**

### **1. Google OAuth Configuration**

**Step 1: Create Google OAuth App**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen:
   - App name: `InkWell`
   - User support email: `support@inkwellwrite.com`
   - Developer contact: `hello@inkwellwrite.com`

**Step 2: Configure OAuth Client**
```
Application type: Web application
Name: InkWell Web Client
Authorized JavaScript origins:
- https://inkwellwrite.com
- http://localhost:3000 (for development)

Authorized redirect URIs:
- https://inkwellwrite.com/auth/callback
- http://localhost:3000/auth/callback (for development)
```

**Step 3: Supabase Configuration**
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   ```
   Client ID: [Your Google Client ID]
   Client Secret: [Your Google Client Secret]
   ```

### **2. GitHub OAuth Configuration**

**Step 1: Create GitHub OAuth App**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Configure the application:
   ```
   Application name: InkWell
   Homepage URL: https://inkwellwrite.com
   Authorization callback URL: https://inkwellwrite.com/auth/callback
   ```

**Step 2: Supabase Configuration**
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable GitHub provider
3. Add your GitHub OAuth credentials:
   ```
   Client ID: [Your GitHub Client ID]
   Client Secret: [Your GitHub Client Secret]
   ```

### **3. Supabase Auth Settings**

**Update these settings in Supabase Dashboard:**

**Site URL:**
```
https://inkwellwrite.com
```

**Redirect URLs:**
```
https://inkwellwrite.com/dashboard
https://inkwellwrite.com/auth/callback
https://inkwellwrite.com/reset-password
http://localhost:3000/dashboard (for development)
http://localhost:3000/auth/callback (for development)
```

**Additional Redirect URLs:**
```
https://inkwellwrite.com/login
https://inkwellwrite.com/register
http://localhost:3000/login (for development)
http://localhost:3000/register (for development)
```

### **4. Database Schema Updates**

**Update your `users` table to include new fields:**

```sql
-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON users(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_users_onboarding_completed ON users(onboarding_completed);
```

**Create storage bucket for user files:**

```sql
-- Create storage bucket for user files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-files', 'user-files', false);

-- Set up Row Level Security for user files
CREATE POLICY "Users can access their own files" ON storage.objects
FOR ALL USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### **5. Environment Variables**

**Update your `.env` file:**

```bash
# OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GITHUB_CLIENT_ID=your_github_client_id

# Domain Configuration
REACT_APP_DOMAIN=inkwellwrite.com
REACT_APP_SITE_URL=https://inkwellwrite.com
REACT_APP_REDIRECT_URL=https://inkwellwrite.com/dashboard

# Email Configuration
REACT_APP_SYSTEM_EMAIL=noreply@inkwellwrite.com
REACT_APP_SUPPORT_EMAIL=support@inkwellwrite.com
REACT_APP_MAIN_EMAIL=hello@inkwellwrite.com
```

### **6. Testing OAuth Flow**

**Test the complete OAuth flow:**

1. **Start your development server:**
   ```bash
   npm start
   ```

2. **Test Google OAuth:**
   - Go to login page
   - Click "Sign in with Google"
   - Complete OAuth flow
   - Verify user profile creation
   - Check folder structure creation

3. **Test GitHub OAuth:**
   - Go to login page
   - Click "Sign in with GitHub"
   - Complete OAuth flow
   - Verify user profile creation
   - Check folder structure creation

### **7. User Creation Flow**

**When a user signs up via OAuth:**

1. **User clicks social login button**
2. **OAuth provider redirects to Supabase**
3. **Supabase creates auth user**
4. **AuthContext detects new user**
5. **UserService.createUserProfile() is called**
6. **User profile is created in database**
7. **User folder structure is created**
8. **Welcome project is initialized**
9. **User is redirected to dashboard**

### **8. Error Handling**

**Common OAuth errors and solutions:**

**"Invalid redirect URI"**
- Check redirect URLs in OAuth provider settings
- Verify Supabase redirect URLs match exactly

**"Client ID not found"**
- Verify OAuth credentials in Supabase
- Check environment variables

**"User creation failed"**
- Check database permissions
- Verify RLS policies
- Check storage bucket permissions

### **9. Production Checklist**

- [ ] Configure Google OAuth in Supabase
- [ ] Configure GitHub OAuth in Supabase
- [ ] Update redirect URLs for production
- [ ] Test OAuth flow in development
- [ ] Deploy to production
- [ ] Test OAuth flow in production
- [ ] Monitor user creation logs
- [ ] Verify folder structure creation

### **10. Security Considerations**

**OAuth Security Best Practices:**

1. **Use HTTPS in production**
2. **Validate redirect URIs**
3. **Implement CSRF protection**
4. **Use secure session management**
5. **Monitor OAuth usage**
6. **Implement rate limiting**
7. **Log OAuth events**

### **11. Troubleshooting**

**If OAuth isn't working:**

1. **Check browser console for errors**
2. **Verify OAuth provider settings**
3. **Check Supabase logs**
4. **Test with different browsers**
5. **Clear browser cache and cookies**
6. **Check network connectivity**

### **12. Monitoring**

**Monitor OAuth usage in Supabase Dashboard:**

1. **Authentication → Users** - View OAuth users
2. **Authentication → Logs** - Check OAuth events
3. **Database → Logs** - Monitor user creation
4. **Storage → Logs** - Monitor folder creation

## 🚀 **NEXT STEPS**

1. **Configure OAuth providers in Supabase**
2. **Update database schema**
3. **Test OAuth flow**
4. **Deploy to production**
5. **Monitor user creation**

Your InkWell OAuth system is now ready for production use! 