# 🚀 Panora Exports - Quick Start Guide

## ⚠️ Important Notice
This is a **MASSIVE enterprise-level project** that typically takes 6-8 weeks for a team to build. I've created the complete architecture, database schema, and core modules. Follow this guide to get started.

---

## 📦 What's Been Created

### ✅ Backend (NestJS)
- [x] Complete Prisma database schema (`prisma/schema.prisma`)
- [x] Package.json with all dependencies
- [x] Environment configuration template
- [x] Prisma service module
- [x] Auth module structure  
- [x] App module with all imports

### ✅ Frontend (Next.js)
- [x] Existing React components
- [x] Tailwind CSS setup
- [x] Premium landing page (LuxuryLanding.tsx)

### 📋 Still To Build (Following Phases)
- [ ] Complete Auth Service (registration, login, JWT)
- [ ] GST Verification API Integration
- [ ] International Verification Module
- [ ] Product CRUD APIs
- [ ] RFQ System
- [ ] Order Management
- [ ] All Dashboards (Buyer/Seller/Admin)
- [ ] File Upload to S3
- [ ] Email Notifications
- [ ] Panora Exports Landing Page

---

## 🛠️ Installation & Setup

### Prerequisites
```bash
# Install Node.js 18+ and PostgreSQL 14+
node --version  # Should be 18+
postgres --version  # Should be 14+
```

### Step 1: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
# - Set DATABASE_URL to your PostgreSQL connection
# - Set JWT_SECRET to a secure random string
# - Configure AWS S3 credentials for file uploads
# - Add GST API credentials

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed initial data (categories, admin user)
npm run prisma:seed

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:3001`

### Step 2: Frontend Setup

```bash
# Navigate to client directory (already exists)
cd ../client

# Install any missing dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 🗄️ Database Schema Overview

### Core Tables Created
1. **users** - All users (buyers, sellers, admins)
2. **buyer_verifications** - GST & international verification data
3. **seller_profiles** - Seller company information
4. **product_categories** - Hierarchical categories
5. **products** - Product catalog
6. **rfqs** - Request for quotations
7. **rfq_quotes** -Seller quotes for RFQs
8. **orders** - Confirmed orders
9. **documents** - File uploads
10. **activity_logs** - Audit trail

### Key Relationships
- User → BuyerVerification (1:1)
- User → SellerProfile (1:1)
- User → Products (1:many) - as seller
- User → RFQs (1:many) - as buyer
- RFQ → RFQQuotes (1:many)
- RFQ → Order (1:1) - when accepted

---

## 🔐 Authentication Flow

### 1. Registration
```
POST /api/auth/register
{
  "email": "buyer@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "role": "BUYER",  // or "SELLER"
  "country": "India"
}
```

### 2. Login
```
POST /api/auth/login
{
  "email": "buyer@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { ... }
}
```

### 3. Protected Routes
```
Headers:
Authorization: Bearer eyJhbGc...
```

---

## ✅ Buyer Verification Flow

### Indian Buyers (GST)

#### Step 1: Enter GST Number
```
POST /api/verification/gst/validate
{
  "gstNumber": "29ABCDE1234F1Z5"
}

Response (from GST API):
{
  "legalName": "ABC Enterprises Pvt Ltd",
  "tradeName": "ABC Exports",
  "status": "Active",
  "registrationDate": "2020-01-15",
  "businessType": "PRIVATE_LIMITED",
  "principalPlace": {
    "address": "...",
    "district": "Mumbai",
    "state": "Maharashtra"
  }
}
```

#### Step 2: Submit Verification
```
POST /api/verification/gst/submit
{
  "gstNumber": "29ABCDE1234F1Z5",
  "legalName": "ABC Enterprises Pvt Ltd",
  "tradeName": "ABC Exports",
  // ... auto-filled from API
  "documents": ["url1", "url2"]  // optional
}
```

### International Buyers

```
POST /api/verification/international/submit
{
  "country": "USA",
  "verificationType": "EIN",
  "businessIdentifier": "12-3456789",
  "companyName": "XYZ Corp",
  "registeredAddress": { ... },
  "documents": [
    {
      "type": "BUSINESS_REGISTRATION",
      "url": "s3://..."  
    },
    {
      "type": "TAX_CERTIFICATE",
      "url": "s3://..."
    }
  ]
}
```

---

## 📦 Product Management

### Create Product (Seller Only)
```
POST /api/products
Headers: Authorization: Bearer <token>

{
  "name": "Premium Basmati Rice",
  "categoryId": "uuid",
  "description": "Premium quality aged basmati rice",
  "specifications": {
    "variety": "1121",
    "aging": "2 years",
    "grade": "A1"
  },
  "images": ["url1", "url2"],
  "minOrderQuantity": 1000,
  "priceRange": "$500-$800 per ton",
  "currency": "USD",
  "originCountry": "India",
  "hsCode": "1006.30",
  "certifications": ["ISO 9001", "HACCP"]
}
```

### Get Products (with filters)
```
GET /api/products?category=textiles&country=India&page=1&limit=20
```

---

## 💬 RFQ System

### Create RFQ (Buyer)
```
POST /api/rfq
{
  "productId": "uuid",  // optional
  "productName": "Organic Cotton Fabric",
  "quantity": 5000,
  "targetPrice": 12.50,
  "currency": "USD",
  "deliveryLocation": "Los Angeles, USA",
  "deliveryDate": "2024-03-15",
  "requirements": "GOTS certified, white color"
}
```

### Submit Quote (Seller)
```
POST /api/rfq/:rfqId/quote
{
  "price": 13.00,
  "currency": "USD",
  "deliveryTerms": "FOB Mumbai",
  "paymentTerms": "30% advance, 70% on shipment",
  "validityDate": "2024-02-28",
  "notes": "Bulk discount available"
}
```

### Accept Quote (Buyer)
```
PATCH /api/rfq/:rfqId/accept-quote/:quoteId
```
This creates an Order automatically.

---

## 📊 Dashboard Endpoints

### Buyer Dashboard
```
GET /api/dashboard/buyer
Response:
{
  "stats": {
    "activeRFQs": 5,
    "pendingOrders": 3,
    "completedOrders": 12
  },
  "recentRFQs": [...],
  "recentOrders": [...]
}
```

### Seller Dashboard
```
GET /api/dashboard/seller
Response:
{
  "stats": {
    "totalProducts": 45,
    "activeQuotes": 8,
    "monthlyRevenue": 125000
  },
  "recentQuotes": [...],
  "topProducts": [...]
}
```

### Admin Dashboard
```
GET /api/dashboard/admin
Response:
{
  "stats": {
    "totalUsers": 1250,
    "pendingVerifications": 23,
    "activeOrders": 67,
    "monthlyGMV": 2500000
  },
  "pendingVerifications": [...],
  "recentActivity": [...]
}
```

---

## 📤 File Upload (S3)

```
POST /api/uploads/document
Content-Type: multipart/form-data

FormData:
- file: <binary>
- type: "BUSINESS_REGISTRATION"

Response:
{
  "id": "uuid",
  "fileName": "registration.pdf",
  "fileUrl": "https://s3.amazonaws.com/panora-exports/documents/uuid.pdf",
  "fileSize": 245678
}
```

---

## 🎨 Panora Exports Landing Page

### Route Structure
```
/                     → Landing page (Panora Exports)
/auth/login           → Login page
/auth/register        → Registration with role selection
/auth/verify          → Verification (GST or International)
/buyer/dashboard      → Buyer dashboard
/buyer/rfqs           → My RFQs
/buyer/orders         → My orders
/seller/dashboard     → Seller dashboard
/seller/products      → My products
/seller/quotes        → RFQ quotes
/admin/dashboard      → Admin dashboard
/admin/verifications  → Pending verifications
/admin/users          → User management
```

### Landing Page Sections
1. **Hero** - "India's Premier Export Platform"
2. **Categories** - Textiles, Agriculture, Hardware, Handicrafts, Spices
3. **How It Works** - 4 steps (Register → Verify → Browse/List → Trade)
4. **Why Choose Us** - Trust, Quality, Global Reach
5. **Statistics** - 500+ Sellers, 50+ Countries, $10M+ GMV
6. **Featured Products**
7. **Testimonials**
8. **CTA** - Get Verified & Start Trading

---

## 🚢 Deployment

### Docker Compose (Development)
```bash
docker-compose up
```

### Production Deployment
1. **Database**: Supabase / AWS RDS PostgreSQL
2. **Backend**: Railway / Render / AWS ECS
3. **Frontend**: Vercel
4. **Storage**: AWS S3
5. **CDN**: Cloudflare

---

## 🔑 Important API Keys Needed

### 1. GST Verification API (India)
- **Provider**: ClearTax API, Vayana Network, or KYC API
- **Cost**: ~$0.10 per verification
- **Endpoint**: Provides legal name, trade name, status, etc.

### 2. International Verification (Optional)
- **EU VAT**: VIES API (Free)
- **USA EIN**: No public API (manual verification)
- **Australia ABN**: ABN Lookup (Free)
- Other countries: Manual document verification

### 3. AWS S3
- Access Key ID
- Secret Access Key
- Bucket name

### 4. Email Service
- SendGrid API Key or AWS SES credentials

---

## 📋 Next Steps

### Phase 1: Core Backend (Week 1-2)
1. Complete Auth Service implementation
2. User CRUD operations
3. GST Verification API integration
4. International verification document upload

### Phase 2: Product & RFQ (Week 3)
1. Product CRUD with image upload
2. Category management
3. RFQ creation and listing
4. Quote submission

### Phase 3: Orders & Payments (Week 4)
1. Order creation from accepted quotes
2. Order status management
3. Document uploads (invoice, shipping)
4. Payment integration (optional)

### Phase 4: Dashboards (Week 5)
1. Buyer dashboard with charts
2. Seller dashboard with analytics
3. Admin panel with user management
4. Verification approval workflows

### Phase 5: Landing & Polish (Week 6)
1. Premium Panora Exports landing page
2. Email notifications
3. Search & filters
4. Performance optimization
5. Security audit

---

## 🆘 GST API Integration Example

### Using ClearTax API (Recommended)

```typescript
// verification/gst.service.ts
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GstService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async validateGstNumber(gstNumber: string) {
    const apiUrl = this.configService.get('GST_API_URL');
    const apiKey = this.configService.get('GST_API_KEY');

    try {
      const response = await this.httpService.axiosRef.get(
        `${apiUrl}/v2/gst/${gstNumber}`,
        {
          headers: {
            'X-API-Key': apiKey,
          },
        },
      );

      return {
        legalName: response.data.lgnm,
        tradeName: response.data.tradeNam,
        status: response.data.sts,
        registrationDate: response.data.rgdt,
        businessType: response.data.ctb,
        principalPlace: {
          address: response.data.pradr.addr,
          district: response.data.pradr.dst,
          state: response.data.pradr.stcd,
          pincode: response.data.pradr.pncd,
        },
      };
    } catch (error) {
      throw new HttpException('Invalid GST Number', 400);
    }
  }
}
```

---

## 📱 Frontend Components Structure

### Landing Page
```
components/landing/
├── Hero.tsx
├── Categories.tsx
├── HowItWorks.tsx
├── WhyChooseUs.tsx
├── Statistics.tsx
├── FeaturedProducts.tsx
├── Testimonials.tsx
└── CTASection.tsx
```

### Verification
```
components/verification/
├── GstVerification.tsx
├── InternationalVerification.tsx
├── DocumentUpload.tsx
└── VerificationStatus.tsx
```

### Dashboard
```
components/dashboard/
├── BuyerDashboard.tsx
├── SellerDashboard.tsx
├── AdminDashboard.tsx
├── StatsCard.tsx
├── RecentActivity.tsx
└── Charts.tsx
```

---

## 🎯 Success Criteria

- ✅ Users can register as Buyer or Seller
- ✅ Indian buyers verify using GST API
- ✅ International buyers upload documents
- ✅ Sellers list products with images
- ✅ Buyers create RFQs
- ✅ Sellers submit quotes
- ✅ Orders created from accepted quotes
- ✅ Dashboards show relevant data
- ✅ Admin can approve verifications
- ✅ Secure authentication with JWT
- ✅ File uploads to S3
- ✅ Premium landing page

---

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Reset database
npx prisma migrate reset
```

### Prisma Client Errors
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

---

## 📞 Support

For questions or issues:
1. Check the implementation plan: `.agent/PANORA_EXPORTS_IMPLEMENTATION_PLAN.md`
2. Review database schema: `prisma/schema.prisma`
3. Check API documentation (Swagger): `http://localhost:3001/api/docs`

---

**Built with ❤️ for Panora Exports**

*Last Updated*: December 12, 2025
*Version*: 1.0.0-alpha
*Status*: Foundation Complete - Ready for Phase 1 Development
