# 🚀 Business Verification System - Setup Guide

## Overview

This guide will help you set up and run the complete business verification system with both backend and frontend.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
- A code editor (VS Code recommended)

## 🔧 Setup Instructions

### Step 1: Backend Setup

1. **Navigate to the server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run start:dev
   ```

4. **Verify the server is running:**
   - The server should start on `http://localhost:3001`
   - You should see: `✅ Verification server running on http://localhost:3001`
   - Swagger documentation available at: `http://localhost:3001/api/docs`

### Step 2: Frontend Setup

1. **Navigate back to the project root:**
   ```bash
   cd ..
   ```

2. **Ensure .env file exists:**
   - The `.env` file should already be created with:
     ```
     VITE_API_URL=http://localhost:3001
     ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: `http://localhost:5000`
   - Verification page: `http://localhost:5000/verification`

## 🧪 Testing the Verification System

### Test 1: India GST Verification

1. Go to `http://localhost:5000/verification`
2. Fill in the form:
   - **Business Name:** Test Company Pvt Ltd
   - **Business Type:** Seller/Exporter
   - **Contact Person:** John Doe
   - **Email:** test@example.com
   - **Phone:** +91 9876543210
   - **Country:** India (GST)
   - **Registration Number:** `22AAAAA0000A1Z5`
3. Click "Verify Business"
4. **Expected Result:** ✅ Verification Successful

### Test 2: EU VAT Verification (Real-time)

1. Fill in the form:
   - **Country:** Germany (VAT)
   - **Registration Number:** `DE123456789`
2. Click "Verify Business"
3. **Expected Result:** Will check against real EU VIES database

### Test 3: USA EIN Verification

1. Fill in the form:
   - **Country:** United States (EIN)
   - **Registration Number:** `12-3456789`
2. Click "Verify Business"
3. **Expected Result:** ✅ Format validation successful

### Test 4: Australia ABN Verification

1. Fill in the form:
   - **Country:** Australia (ABN)
   - **Registration Number:** `51824753556`
2. Click "Verify Business"
3. **Expected Result:** ✅ Checksum validation successful

## 📡 API Testing (Optional)

### Using cURL

**Test India GST:**
```bash
curl -X POST http://localhost:3001/verification/verify \
  -H "Content-Type: application/json" \
  -d "{\"country\":\"INDIA\",\"businessId\":\"22AAAAA0000A1Z5\"}"
```

**Test EU VAT:**
```bash
curl -X POST http://localhost:3001/verification/verify \
  -H "Content-Type: application/json" \
  -d "{\"country\":\"GERMANY\",\"businessId\":\"DE123456789\"}"
```

### Using Swagger UI

1. Open `http://localhost:3001/api/docs`
2. Find the `/verification/verify` endpoint
3. Click "Try it out"
4. Enter test data
5. Click "Execute"

## 🎯 What Happens After Verification?

### Successful Verification Flow

1. **Instant Verification** → User enters business details
2. **API Call** → Frontend sends request to backend
3. **Validation** → Backend validates format and/or checks external APIs
4. **Success Response** → User sees verification success message
5. **Dashboard Access** → User is shown the verified dashboard with:
   - ✅ Verified badge
   - 🛍️ Browse Products
   - 📝 Create RFQ (Request for Quotation)
   - 📦 List Products
   - 💬 Messages
   - 📊 Analytics Dashboard

### Verified User Features

Once verified, users can:

1. **Browse Products** - Access the full product catalog
2. **Create RFQs** - Submit requests for quotations
3. **List Products** - Add their own products to the marketplace
4. **Direct Messaging** - Connect with other verified businesses
5. **Secure Transactions** - Access payment and escrow services
6. **Priority Listings** - Products appear first in search results
7. **Verified Badge** - Display trust badge on profile

## 🌍 Supported Countries

| Country | Type | Validation | Real-time API |
|---------|------|------------|---------------|
| 🇮🇳 India | GST | Format | ❌ (Requires paid API) |
| 🇪🇺 EU | VAT | Format + API | ✅ Free EU VIES |
| 🇺🇸 USA | EIN | Format | ❌ |
| 🇬🇧 UK | Company Number | Format | ❌ (Free API available) |
| 🇦🇪 UAE | Trade License | Format | ❌ |
| 🇨🇦 Canada | Business Number | Format | ❌ |
| 🇦🇺 Australia | ABN | Checksum | ❌ (Free API available) |

## 🔍 Verification Formats

### India (GST)
- **Format:** 15 characters
- **Pattern:** `2 digits + 5 letters + 4 digits + 1 letter + 1 alphanumeric + Z + 1 alphanumeric`
- **Example:** `22AAAAA0000A1Z5`

### USA (EIN)
- **Format:** 9 digits with hyphen
- **Pattern:** `XX-XXXXXXX`
- **Example:** `12-3456789`

### EU (VAT)
- **Format:** 2-letter country code + 8-12 digits
- **Pattern:** `CC + 8-12 digits`
- **Example:** `DE123456789` (Germany)

### UK (Company Number)
- **Format:** 8 alphanumeric characters
- **Example:** `AB123456`

### UAE (Trade License)
- **Format:** Minimum 6 digits
- **Example:** `123456`

### Canada (Business Number)
- **Format:** 9 digits
- **Example:** `123456789`

### Australia (ABN)
- **Format:** 11 digits
- **Pattern:** With checksum validation
- **Example:** `51824753556`

## 🛠️ Troubleshooting

### Backend Not Starting

**Issue:** Server fails to start
**Solution:**
```bash
cd server
rm -rf node_modules package-lock.json
npm install
npm run start:dev
```

### Frontend Not Connecting to Backend

**Issue:** "Failed to connect to verification service"
**Solution:**
1. Check if backend is running on port 3001
2. Verify `.env` file has `VITE_API_URL=http://localhost:3001`
3. Restart frontend: `npm run dev`

### CORS Errors

**Issue:** CORS policy blocking requests
**Solution:**
- Backend already configured for CORS
- Check `server/src/main.ts` for CORS settings
- Ensure frontend is running on port 5000

### EU VAT Verification Timeout

**Issue:** EU VIES API timeout
**Solution:**
- EU VIES API may be temporarily unavailable
- Try again after a few minutes
- Check internet connection

## 📚 Additional Resources

- **Verification Guide:** See `VERIFICATION_GUIDE.md` for detailed documentation
- **API Documentation:** `http://localhost:3001/api/docs` (when server is running)
- **Project README:** See `README.md` for overall project information

## 🎉 Success Checklist

- [ ] Backend server running on port 3001
- [ ] Frontend running on port 5000
- [ ] Can access verification page
- [ ] Can submit verification form
- [ ] Receives verification response
- [ ] Sees verified dashboard on success
- [ ] Can access Swagger docs

## 🚀 Next Steps

After successful verification setup:

1. **Explore the Dashboard** - Check out all verified user features
2. **Test Different Countries** - Try verification for various countries
3. **Review API Docs** - Explore Swagger documentation
4. **Customize** - Add your own country support or validation logic
5. **Integrate** - Connect with other platform features (products, RFQs, etc.)

## 💡 Tips

- Use the format hints in the form for correct registration number format
- EU VAT verification is the only real-time API integration (free)
- Other countries use format validation (can be upgraded with paid APIs)
- Verified users get access to premium platform features
- All verification data is encrypted and secure

## 🤝 Need Help?

- Check the `VERIFICATION_GUIDE.md` for detailed documentation
- Review the code comments in `verification.service.ts`
- Test with the provided sample data
- Check browser console for error messages
- Verify backend logs for API errors

---

**Happy Verifying! 🎊**

Built with ❤️ for secure B2B transactions
