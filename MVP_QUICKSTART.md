# 🚀 Panora Exports - MVP Quick Start with Supabase

## ✨ Simplified MVP Architecture

**Stack:**
- ✅ **Database**: Supabase PostgreSQL (Free tier: 500MB)
- ✅ **File Storage**: Supabase Storage (Free tier: 1GB)
- ✅ **Backend**: NestJS + Prisma
- ✅ **Frontend**: Next.js + Tailwind
- ✅ **Auth**: JWT (custom implementation)

**Cost**: $0/month (using free tiers) 🎉

---

## 📋 Setup Steps

### 1️⃣ Create Supabase Project (Free)

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click **"New Project"**
4. Fill in:
   - **Name**: panora-exports
   - **Database Password**: (Save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
5. Wait 2-3 minutes for project creation

### 2️⃣ Get Supabase Credentials

Once your project is ready:

**A. Database URL**
- Go to **Settings** → **Database**
- Scroll to **Connection string** → **URI**
- Copy the connection string (looks like):
  ```
  postgresql://postgres:[YOUR-PASSWORD]@db.abc123xyz.supabase.co:5432/postgres
  ```

**B. API Keys**
- Go to **Settings** → **API**
- Copy:
  - **Project URL**: `https://abc123xyz.supabase.co`
  - **anon/public key**: `eyJhbGc...` (starts with eyJ)
  - **service_role key**: `eyJhbGc...` (different, longer)

### 3️⃣ Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **"New bucket"**
3. Name: `panora-documents`
4. **Public bucket**: ✅ Yes (so files are publicly accessible)
5. Click **Create bucket**

---

## 🛠️ Backend Setup

### Step 1: Install Dependencies

```bash
cd server
npm install
```

This will install:
- NestJS framework
- Prisma ORM
- Supabase client
- JWT & Passport
- And more...

### Step 2: Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Open .env and update these values:
```

Edit `server/.env`:

```env
# Replace [YOUR-PASSWORD] and [YOUR-PROJECT-REF] with your actual values
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres"

SUPABASE_URL="https://[YOUR_PROJECT_REF].supabase.co"
SUPABASE_ANON_KEY="your_anon_key_here"
SUPABASE_SERVICE_KEY="your_service_role_key_here"
SUPABASE_STORAGE_BUCKET="panora-documents"

# Generate a secure random string for JWT (minimum 32 characters)
JWT_SECRET="use-a-really-long-random-string-here-minimum-32-chars"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# For MVP: GST API is optional (use mock data)
GST_API_ENABLED="false"

# For MVP: Email is optional (console logging)
EMAIL_ENABLED="false"

PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Step 3: Generate Prisma Client & Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to Supabase database
npx prisma db push

# Optional: Open Prisma Studio to view database
npx prisma studio
```

✅ Your database is now set up with all tables!

### Step 4: Start Backend

```bash
npm run start:dev
```

You should see:
```
🚀 Panora Exports API is running on: http://localhost:3001
📚 API Documentation: http://localhost:3001/api/docs
```

---

## 🎨 Frontend Setup

The frontend is already configured in the `client` directory:

```bash
cd client
npm install  # If not already installed
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🧪 Testing the Setup

### 1. Check API is Running

Open browser: `http://localhost:3001/api/docs`

You should see Swagger API documentation.

### 2. Test File Upload

Create a test in Postman or use curl:

```bash
curl -X POST http://localhost:3001/api/test-upload \
  -F "file=@/path/to/image.jpg"
```

File should upload to Supabase Storage!

### 3. View Files in Supabase

- Go to Supabase Dashboard → **Storage** → `panora-documents`
- You should see your uploaded files

---

## 📊 Database Tables Created

Run this to see all tables:
```bash
npx prisma studio
```

Or in Supabase:
- Go to **Table Editor**
- You'll see:
  - users
  - buyer_verifications
  - seller_profiles
  - product_categories
  - products
  - rfqs
  - rfq_quotes
  - orders
  - documents
  - refresh_tokens
  - activity_logs

---

## 🎯 MVP Features Implemented

### ✅ Infrastructure
- [x] Supabase PostgreSQL database
- [x] Supabase file storage
- [x] Prisma ORM
- [x] NestJS backend structure
- [x] JWT authentication ready
- [x] Swagger API docs

### 🔄 To Build (MVP Phase 1)
- [ ] Auth endpoints (register, login)
- [ ] User management
- [ ] GST verification (mock for MVP)
- [ ] Product CRUD
- [ ] Basic RFQ system
- [ ] Simple dashboards

---

## 📝 API Endpoints (To Build)

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
GET /api/auth/me
```

### Products
```
GET /api/products
POST /api/products
GET /api/products/:id
PATCH /api/products/:id
```

### RFQs
```
POST /api/rfq
GET /api/rfq/buyer
GET /api/rfq/seller
POST /api/rfq/:id/quote
```

### File Upload
```
POST /api/uploads/document
```

---

## 🔐 MVP Simplifications

For MVP, we're skipping:
- ❌ Real GST API integration (use manual verification)
- ❌ Email notifications (console logging)
- ❌ Payment integration
- ❌ Advanced analytics
- ❌ Real-time notifications
- ❌ Complex admin features

Focus on:
- ✅ Basic auth & user management
- ✅ Product listing
- ✅ Simple RFQ system
- ✅ File uploads
- ✅ Basic dashboards

---

## 💰 Costs Breakdown

### Supabase Free Tier Limits

| Resource | Free Tier | Enough For MVP? |
|----------|-----------|-----------------|
| **Database** | 500 MB | ✅ Yes (1000s of records) |
| **Storage** | 1 GB | ✅ Yes (200+ PDFs/images) |
| **Bandwidth** | 2 GB/month | ✅ Yes (light testing) |
| **API Requests** | Unlimited | ✅ Yes |

### When You Exceed Free Tier

**Pro Plan**: $25/month
- 8 GB database
- 100 GB storage
- 50 GB bandwidth

**Production Estimate**: ~$0-25/month for first 100 users

---

## 🚀 Deployment (When Ready)

### Backend (Railway - Free $5 credit)
1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. "New Project" → "Deploy from GitHub"
4. Add environment variables from `.env`
5. Deploy!

### Frontend (Vercel - Free forever)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. "Import Project" → Select repo
4. Deploy!

**Total Cost**: $0/month with free tiers 🎉

---

## 📚 Next Steps

### Week 1: Authentication
1. Build registration endpoint
2. Build login endpoint
3. Implement JWT strategy
4. Create login/register UI

### Week 2: Products
1. Create product endpoints
2. Implement file upload
3. Build product list page
4. Build product detail page

### Week 3: RFQ System
1. Create RFQ endpoints
2. Build RFQ creation UI
3. Build quote submission
4. Build buyer/seller dashboards

### Week 4: Polish & Deploy
1. Test thoroughly
2. Fix bugs
3. Deploy to production
4. Get first users!

---

## 🆘 Troubleshooting

### "Database connection failed"
- Check your DATABASE_URL in `.env`
- Make sure password is correctly URL-encoded
- Test connection: `npx prisma db pull`

### "Cannot upload file"
- Check bucket exists: `panora-documents`
- Check bucket is public
- Verify SUPABASE_SERVICE_KEY is correct

### "Module not found" errors
- Run: `cd server && npm install`
- Then: `npx prisma generate`

### Supabase Free Tier Exceeded
- Upgrade to Pro ($25/month)
- Or optimize: Delete old files, archive old records

---

## 🎉 You're Ready to Build MVP!

**Timeline**: 4 weeks for functional MVP
**Cost**: $0 (using free tiers)
**Focus**: Get to market fast, iterate based on feedback

**Start with**: Authentication → Products → RFQs → Deploy

Good luck! 🚀🇮🇳

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- NestJS Docs: https://docs.nestjs.com
- Prisma Docs: https://www.prisma.io/docs
