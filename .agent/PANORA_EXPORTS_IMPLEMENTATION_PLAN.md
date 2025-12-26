# Panora Exports - Complete B2B Platform Implementation Plan

## 🎯 Project Overview
A complete production-ready import-export business platform for "Panora Exports" with buyer verification, product management, RFQ, and order management.

---

## 📁 Project Structure

```
B2B/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── auth/              # Authentication & JWT
│   │   ├── users/             # User management
│   │   ├── verification/      # GST & International verification
│   │   ├── products/          # Product catalog
│   │   ├── categories/        # Product categories
│   │   ├── rfq/               # Request for Quotation
│   │   ├── orders/            # Order management
│   │   ├── dashboard/         # Dashboard analytics
│   │   ├── uploads/           # File upload (S3)
│   │   ├── common/            # Shared utilities
│   │   └── config/            # Configuration
│   ├── prisma/                # Database schema
│   └── package.json
├── client/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/               # App router
│   │   │   ├── (landing)/     # Landing page
│   │   │   ├── (auth)/        # Auth pages
│   │   │   ├── buyer/         # Buyer dashboard
│   │   │   ├── seller/        # Seller dashboard
│   │   │   ├── admin/         # Admin dashboard
│   │   │   └── api/           # API routes
│   │   ├── components/        # React components
│   │   │   ├── landing/       # Landing page components
│   │   │   ├── verification/  # Verification forms
│   │   │   ├── products/      # Product components
│   │   │   ├── rfq/           # RFQ components
│   │   │   ├── orders/        # Order components
│   │   │   └── dashboard/     # Dashboard components
│   │   ├── lib/               # Utilities
│   │   └── types/             # TypeScript types
│   └── package.json
└── docker-compose.yml          # Docker setup
```

---

## 🗄️ Database Schema (PostgreSQL)

### Core Tables

1. **users**
   - id, email, password, role (BUYER/SELLER/ADMIN)
   - name, phone, country, created_at, updated_at
   - is_verified, is_active

2. **buyer_verifications**
   - id, user_id, country, verification_type
   - For India: gst_number, legal_name, trade_name, status, registration_date, business_type
   - For International: ein/vat/abn/bn/crn/eori/duns/uscc/trade_license
   - documents (JSON array), verification_status, verified_at

3. **seller_profiles**
   - id, user_id, company_name, business_type
   - export_license, iec_code, verified, created_at

4. **product_categories**
   - id, name, slug, description, parent_id (for subcategories)
   - image_url, is_active, created_at

5. **products**
   - id, seller_id, category_id, name, description
   - specifications (JSON), images (JSON array)
   - min_order_quantity, price_range, currency
   - origin_country, certifications, is_active

6. **rfqs** (Request for Quotation)
   - id, buyer_id, product_id, quantity, target_price
   - delivery_location, delivery_date, requirements
   - status (PENDING/QUOTED/NEGOTIATING/ACCEPTED/REJECTED)
   - created_at, updated_at

7. **rfq_quotes**
   - id, rfq_id, seller_id, price, delivery_terms
   - payment_terms, validity_date, notes, status

8. **orders**
   - id, buyer_id, seller_id, rfq_id
   - total_amount, currency, status
   - shipping_address, payment_status, tracking_info
   - created_at, updated_at

9. **documents**
   - id, user_id, order_id, type (INVOICE/SHIPPING/COO/etc)
   - file_url, uploaded_at

---

## 🔐 Authentication & Authorization

### JWT Implementation
- Access tokens (15 min expiry)
- Refresh tokens (7 days)
- Role-based guards (Buyer/Seller/Admin)

### Endpoints
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/me

---

## ✅ Verification Module

### Indian Buyers (GST Verification)
**API**: GST Public API / Third-party service (e.g., ClearTax API)

**Flow**:
1. User enters GST number
2. Call GST API to fetch:
   - Legal Name
   - Trade Name
   - Status (Active/Cancelled)
   - Registration Date
   - Business Type (Partnership/Private/Public)
   - Principal Place of Business
3. Auto-fill business details
4. Upload supporting documents (optional)
5. Admin approval (if needed)

**Endpoints**:
- POST /verification/gst/validate
- POST /verification/gst/submit
- GET /verification/gst/status/:userId

### International Buyers

**Supported Identifiers**:
- **USA**: EIN (Employer Identification Number)
- **EU**: VAT Number, EORI
- **Australia**: ABN (Australian Business Number)
- **Canada**: BN (Business Number)
- **Saudi Arabia**: CRN (Commercial Registration Number)
- **UAE**: Trade License
- **Global**: DUNS Number

**Flow**:
1. Select country
2. Enter business identifier
3. Optional: Call third-party verification API (if available)
4. Upload documents:
   - Business registration certificate
   - Tax registration
   - Trade license
   - Bank statement
   - Director ID proof
5. Admin manual verification

**Endpoints**:
- POST /verification/international/submit
- POST /verification/documents/upload
- GET /verification/status/:userId
- PATCH /verification/admin/approve/:id

---

## 📦 Product Management

### Features
- Multi-category support (Textiles, Agriculture, Hardware, etc.)
- Rich product descriptions with specifications
- Multiple image uploads
- Bulk import/export (CSV)
- Inventory management

### Endpoints
- GET /products (with filters, pagination)
- GET /products/:id
- POST /products (seller only)
- PATCH /products/:id
- DELETE /products/:id
- GET /categories
- POST /categories (admin only)

---

## 💬 RFQ System

### Workflow
1. Buyer creates RFQ (product, quantity, target price, delivery)
2. Sellers receive notifications
3. Sellers submit quotes
4. Buyer reviews and negotiates
5. Buyer accepts a quote → Creates Order

### Endpoints
- POST /rfq/create
- GET /rfq/buyer (buyer's RFQs)
- GET /rfq/seller (RFQs for seller's products)
- POST /rfq/:id/quote
- PATCH /rfq/:id/accept-quote/:quoteId
- GET /rfq/:id/quotes

---

## 📊 Dashboards

### Buyer Dashboard
- Pending verifications
- Active RFQs
- Orders in progress
- Favorite products
- Saved sellers

### Seller Dashboard
- Product performance
- Active quotes
- Order fulfillment
- Revenue analytics
- Buyer inquiries

### Admin Dashboard
- Pending verifications (manual approval)
- Platform statistics
- User management
- Category management
- Flagged content

---

## 🎨 Landing Page (Panora Exports)

### Sections
1. **Hero** - "India's Trusted Export Partner"
2. **Categories** - Textiles, Agriculture, Hardware, Handicrafts
3. **Why Choose Us** - Quality, Certification, Global Reach
4. **How It Works** - 4-step process
5. **Featured Products**
6. **Statistics** - Countries, Products, Verified Buyers
7. **Testimonials**
8. **CTA** - Get Verified & Start Trading
9. **Footer**

### Design
- Premium, modern design
- Indian color palette (Saffron, White, Green accents)
- Trust signals (certifications, awards)
- Responsive, mobile-first

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + Passport
- **File Upload**: AWS S3 / Cloudinary
- **Email**: SendGrid / AWS SES
- **Caching**: Redis
- **Queue**: Bull (for background jobs)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand / React Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **File Upload**: react-dropzone

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Hosting**: Vercel (Frontend), Railway/Render (Backend)
- **Monitoring**: Sentry

---

## 🚀 Deployment Strategy

### Development
```bash
docker-compose up
```

### Production
1. **Backend**: Deploy to Railway/Render
2. **Frontend**: Deploy to Vercel
3. **Database**: Managed PostgreSQL (Supabase/Neon)
4. **Storage**: AWS S3
5. **CDN**: Cloudflare

---

## 📝 Implementation Phases

### Phase 1: Foundation (Week 1)
- [x] Project setup
- [ ] Database schema
- [ ] Authentication system
- [ ] Basic CRUD APIs

### Phase 2: Verification (Week 2)
- [ ] GST API integration
- [ ] International verification
- [ ] Document upload
- [ ] Admin approval workflow

### Phase 3: Core Features (Week 3)
- [ ] Product catalog
- [ ] Category management
- [ ] RFQ system
- [ ] Order management

### Phase 4: Dashboards (Week 4)
- [ ] Buyer dashboard
- [ ] Seller dashboard
- [ ] Admin panel
- [ ] Analytics

### Phase 5: Landing & Polish (Week 5)
- [ ] Premium landing page
- [ ] Email notifications
- [ ] Search & filters
- [ ] Performance optimization

### Phase 6: Testing & Deployment (Week 6)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Security audit
- [ ] Production deployment

---

## 🔒 Security Measures

1. **Authentication**: JWT with short expiry
2. **Authorization**: Role-based access control
3. **Data Validation**: Zod schemas
4. **SQL Injection**: Prisma ORM (parameterized queries)
5. **XSS**: Content Security Policy
6. **CSRF**: CSRF tokens
7. **Rate Limiting**: Express rate limit
8. **File Upload**: Size limits, type validation, virus scanning
9. **Encryption**: Bcrypt for passwords, encrypt sensitive data at rest
10. **HTTPS**: SSL/TLS everywhere

---

## 📈 Scalability Considerations

1. **Database**: Read replicas, connection pooling
2. **Caching**: Redis for sessions, API responses
3. **CDN**: Static assets on CDN
4. **Load Balancing**: Multiple backend instances
5. **Message Queue**: Bull for async tasks
6. **Microservices**: Separate verification service

---

## 🧪 Testing Strategy

1. **Unit Tests**: Jest (70%+ coverage)
2. **Integration Tests**: Supertest
3. **E2E Tests**: Playwright
4. **Load Testing**: k6
5. **Security Testing**: OWASP ZAP

---

**Status**: Ready to implement
**Timeline**: 6 weeks for MVP
**Budget**: TBD based on third-party services

Let's build this! 🚀
