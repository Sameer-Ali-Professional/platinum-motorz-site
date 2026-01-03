# Admin Dashboard Access Guide

## 🎯 Location

The admin dashboard is located at:
- **Local:** http://localhost:3000/admin
- **Production:** https://www.platinummotorz.co.uk/admin

## 🔐 Access Requirements

The admin dashboard **requires authentication**. If you're not logged in, you'll be redirected to `/auth/login`.

## 📍 How to Access

### Step 1: Start Dev Server (if not running)

```bash
pnpm dev
```

Wait for: `Ready on http://localhost:3000`

### Step 2: Navigate to Admin Dashboard

**Option A: Direct URL**
- Open: http://localhost:3000/admin

**Option B: From Homepage**
- Go to: http://localhost:3000
- Manually navigate to: http://localhost:3000/admin

### Step 3: Login

If you're not logged in, you'll be redirected to:
- http://localhost:3000/auth/login

**You'll need:**
- Email and password (Supabase auth account)

**Don't have an account?**
- Go to: http://localhost:3000/auth/sign-up
- Create an account
- You'll be redirected to `/admin` after signup

## 🎛️ Dashboard Features

The admin dashboard has **2 tabs**:

### Tab 1: Reviews
- Manage customer reviews
- Approve/reject reviews

### Tab 2: Inventory & Autotrader ⭐
- **"Sync with Autotrader" button** - This is what you need!
- View all cars in inventory
- Toggle availability (mark as sold)
- Delete cars

## 🚀 Using Autotrader Sync

1. Go to `/admin`
2. Click the **"Inventory & Autotrader"** tab
3. Click **"Sync with Autotrader"** button
4. Wait 2-5 minutes for processing
5. Check `/stock` page - cars will appear automatically!

## 🔍 Quick Links

- **Admin Dashboard:** http://localhost:3000/admin
- **Login Page:** http://localhost:3000/auth/login
- **Sign Up:** http://localhost:3000/auth/sign-up
- **Stock Page:** http://localhost:3000/stock

## ⚠️ Troubleshooting

**"Redirected to /auth/login"**
- You need to log in first
- Create an account if you don't have one

**"Cannot access /admin"**
- Make sure dev server is running (`pnpm dev`)
- Check that you're logged in

**"Sync button not working"**
- Make sure SQL scripts are run in Supabase
- Check browser console for errors
- Verify Supabase environment variables are set

