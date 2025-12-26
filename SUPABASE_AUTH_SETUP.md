# 🔐 Supabase Authentication Setup Guide

## Overview
This guide will help you set up Supabase authentication for the Panora Exports B2B platform with full user registration, login, verification, and profile management.

## 📋 Prerequisites
- Supabase account (free tier works fine)
- Node.js installed
- Project already running

## 🚀 Step-by-Step Setup

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Fill in:
   - **Project Name**: `panora-exports` (or your choice)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project" and wait ~2 minutes

### 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - Keep this secret!

### 3. Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `database/schema.sql` from this project
4. Paste into the SQL editor
5. Click "Run" or press `Ctrl+Enter`
6. You should see "Success. No rows returned" - this is correct!

### 4. Configure Environment Variables

#### **Client (.env file)**

Create `client/.env` file:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### **Server (.env file)**

Create `server/.env` file (or update existing):

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_KEY=your-service-role-key-here
SUPABASE_STORAGE_BUCKET=panora-documents

# Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# JWT (use your Supabase JWT secret)
JWT_SECRET=your-supabase-jwt-secret

# Other settings...
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5000
```

**Important**: Replace placeholders with your actual values!

### 5. Configure Supabase Auth Settings

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. **Site URL**: Set to `http://localhost:5000` (for development)
3. **Redirect URLs**: Add:
   - `http://localhost:5000/**`
   - Your production URL when ready
4. **Email Auth**: Enable if not already enabled
5. **Email Templates**: Customize if desired (optional)

### 6. Set Up Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket"
3. Name: `panora-documents`
4. Make it **Public**
5. Click "Create bucket"

The SQL schema already set up the storage policies, so you're good to go!

### 7. Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## ✅ Testing Authentication

### Test Registration

1. Navigate to `http://localhost:5000/auth/register`
2. Select "I'm a Buyer" or "I'm a Seller"
3. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Phone: +1234567890
   - Country: India
   - Password: TestPassword123
4. Click "Create Account"
5. Check your email for verification link (if email is configured)

### Test Login

1. Navigate to `http://localhost:5000/auth/login`
2. Enter credentials:
   - Email: test@example.com
   - Password: TestPassword123
3. Click "Sign In"
4. You should be redirected to homepage with your name showing in the nav

### Verify User in Database

1. In Supabase dashboard, go to **Table Editor**
2. Select `users` table
3. You should see your test user with:
   - Email, name, phone, country
   - Role (BUYER or SELLER)
   - verification_status: PENDING

## 🔧 Features Implemented

### ✅ Authentication
- [x] User registration with role selection (Buyer/Seller)
- [x] Email/password login
- [x] Logout functionality
- [x] Session persistence (stays logged in on refresh)
- [x] Protected routes (coming soon)

### ✅ User Profile
- [x] User profile stored in database
- [x] Role-based access (Buyer/Seller)
- [x] Verification status tracking
- [x] Company name for sellers

### ✅ Verification System
- [x] Document upload capability
- [x] Verification status (PENDING/VERIFIED/REJECTED)
- [x] Verification badge in navigation
- [x] Document storage in Supabase Storage

### ✅ UI Integration
- [x] Navigation shows user info when logged in
- [x] Logout button in navigation
- [x] Verification badge for verified users
- [x] Mobile-responsive user menu
- [x] Toast notifications for auth actions

## 📁 File Structure

```
client/src/
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   └── auth.ts              # Authentication service
├── contexts/
│   └── AuthContext.tsx      # Global auth state management
├── components/
│   └── Navigation.tsx       # Updated with auth UI
└── app/auth/
    ├── login/page.tsx       # Login page with Supabase
    └── register/page.tsx    # Registration with Supabase

database/
└── schema.sql               # Complete database schema

server/
└── src/supabase/
    ├── supabase.module.ts   # Supabase module
    └── supabase.service.ts  # File upload service
```

## 🔐 Security Features

1. **Row Level Security (RLS)**: Users can only access their own data
2. **Password Hashing**: Handled automatically by Supabase
3. **JWT Tokens**: Secure session management
4. **Email Verification**: Optional but recommended for production
5. **Storage Policies**: Users can only upload to their own folders

## 🎯 Next Steps

### Immediate
1. Test registration and login
2. Verify data appears in Supabase dashboard
3. Test logout functionality

### For Production
1. Set up custom email templates in Supabase
2. Configure production URLs
3. Enable email verification requirement
4. Set up password reset flow
5. Add 2FA (optional)

### Feature Enhancements
1. **Verification Workflow**:
   - Admin dashboard to approve/reject verifications
   - Automated GST/EIN verification via APIs
   - Email notifications on verification status

2. **User Dashboard**:
   - Profile editing
   - Document management
   - Order history
   - RFQ management

3. **Protected Routes**:
   - Redirect to login if not authenticated
   - Role-based page access
   - Seller-only and Buyer-only pages

## 🐛 Troubleshooting

### "Invalid API key" error
- Check that your `.env` files have the correct Supabase URL and keys
- Make sure you're using the **anon** key for client, not service_role

### "User already registered" error
- This is normal if you try to register the same email twice
- Use a different email or delete the user from Supabase dashboard

### User not appearing in navigation
- Check browser console for errors
- Verify AuthProvider is wrapping your app in App.tsx
- Check that Supabase credentials are correct

### Email verification not working
- For development, check Supabase **Authentication** → **Users** → Click user → "Send verification email"
- For production, configure SMTP in Supabase settings

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

## 🎉 Success!

If you can:
1. ✅ Register a new user
2. ✅ See the user in Supabase dashboard
3. ✅ Login with those credentials
4. ✅ See your name in the navigation
5. ✅ Logout successfully

**Congratulations! Your authentication system is working!** 🚀

---

Need help? Check the troubleshooting section or review the code in the files mentioned above.
