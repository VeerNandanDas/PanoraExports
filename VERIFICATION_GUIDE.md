# 🔐 Business Verification System

## Overview

The Business Verification System provides **instant automated verification** for businesses across multiple countries, enabling secure B2B transactions on the Panora Exports platform.

## ✨ Features

### Supported Countries & Verification Types

| Country | Verification Type | Status | Format |
|---------|------------------|--------|--------|
| 🇮🇳 India | GST | ✅ Format Validation | `22AAAAA0000A1Z5` |
| 🇪🇺 EU Countries | VAT (VIES) | ✅ Real-time API | `DE123456789` |
| 🇺🇸 USA | EIN | ✅ Format Validation | `12-3456789` |
| 🇬🇧 UK | Company Number | ✅ Format Validation | `AB123456` |
| 🇦🇪 UAE | Trade License | ✅ Format Validation | `123456` |
| 🇨🇦 Canada | Business Number | ✅ Format Validation | `123456789` |
| 🇦🇺 Australia | ABN | ✅ Checksum Validation | `12345678901` |

### EU Countries Supported (VAT VIES)
Austria, Belgium, Bulgaria, Cyprus, Czech Republic, Germany, Denmark, Estonia, Spain, Finland, France, Greece, Croatia, Hungary, Ireland, Italy, Lithuania, Luxembourg, Latvia, Malta, Netherlands, Poland, Portugal, Romania, Sweden, Slovenia, Slovakia

## 🚀 Quick Start

### Backend Setup

1. **Navigate to server directory:**
```bash
cd server
```

2. **Install dependencies (if not already done):**
```bash
npm install
```

3. **Start the server:**
```bash
npm run start:dev
```

The verification API will be available at `http://localhost:3001/verification`

### Frontend Setup

1. **Create `.env` file in project root:**
```bash
cp .env.example .env
```

2. **Update `.env` with API URL:**
```
VITE_API_URL=http://localhost:3001
```

3. **Start the frontend:**
```bash
npm run dev
```

4. **Access verification page:**
```
http://localhost:5000/verification
```

## 📡 API Endpoints

### 1. Verify Business
**POST** `/verification/verify`

**Request Body:**
```json
{
  "country": "INDIA",
  "businessId": "22AAAAA0000A1Z5"
}
```

**Response (Success):**
```json
{
  "verified": true,
  "country": "India",
  "businessName": "Sample Business Pvt Ltd",
  "verificationType": "GST",
  "note": "Format validated. Full verification requires GST API integration."
}
```

**Response (Failure):**
```json
{
  "verified": false,
  "country": "India",
  "verificationType": "GST",
  "reason": "Invalid GST format. Expected format: 22AAAAA0000A1Z5"
}
```

### 2. Check Format
**POST** `/verification/check-format`

**Request Body:**
```json
{
  "country": "INDIA",
  "businessId": "22AAAAA0000A1Z5"
}
```

**Response:**
```json
{
  "valid": true,
  "format": "15 characters: 2 digits + 10 alphanumeric + 1 letter + 1 alphanumeric + Z + 1 alphanumeric",
  "example": "22AAAAA0000A1Z5"
}
```

## 🔧 Implementation Details

### Backend Architecture

```
server/src/verification/
├── verification.module.ts      # Module configuration
├── verification.controller.ts  # API endpoints
└── verification.service.ts     # Business logic
```

### Verification Flow

1. **User Input** → User enters business details and registration number
2. **Format Check** → Client-side validation for quick feedback
3. **API Call** → POST request to `/verification/verify`
4. **Backend Processing:**
   - Country-specific validation
   - Format checking (regex patterns)
   - External API calls (EU VIES for VAT)
   - Checksum validation (Australia ABN)
5. **Response** → Verification result with details
6. **UI Update** → Show verification status and next steps

### Real-time Verification (EU VAT)

The system uses the **official EU VIES API** for real-time VAT verification:

```typescript
const url = `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${countryCode}/vat/${number}`;
```

This provides:
- ✅ Real company name
- ✅ Valid VAT status
- ✅ No cost (free EU service)

## 🎨 Frontend Features

### Verification Form
- **Multi-country support** with dynamic format hints
- **Real-time validation** feedback
- **Instant verification** results
- **Error handling** with clear messages

### Verified Dashboard
Once verified, users see:
- ✅ Verified badge and status
- 🎯 Quick actions (Browse Products, Create RFQ, List Products, Messages)
- 📊 Platform benefits overview
- 🔒 Access to premium features

### User Experience
- **Loading states** during verification
- **Success/failure animations**
- **Clear error messages** with format examples
- **Responsive design** for all devices

## 🔒 Security Features

1. **Input Validation** - Server-side validation for all inputs
2. **Rate Limiting** - Throttling to prevent abuse
3. **CORS Protection** - Configured for allowed origins
4. **Helmet Security** - HTTP headers protection
5. **Data Encryption** - Secure transmission

## 🌍 Adding New Countries

To add support for a new country:

1. **Update the service** (`verification.service.ts`):
```typescript
case 'NEW_COUNTRY':
  result = this.verifyNewCountry(businessId);
  break;
```

2. **Add verification method:**
```typescript
private verifyNewCountry(id: string): Promise<VerificationResult> {
  const regex = /your-format-regex/;
  return Promise.resolve({
    verified: regex.test(id),
    country: 'New Country',
    verificationType: 'Registration Type',
    // ... other fields
  });
}
```

3. **Update frontend** (`page.tsx`):
```tsx
<option value="NEW_COUNTRY">New Country</option>
```

## 📊 Verification Statistics

Track verification metrics:
- Total verifications performed
- Success rate by country
- Average verification time
- Popular verification types

## 🧪 Testing

### Test with Sample Data

**India (GST):**
```
Country: INDIA
Business ID: 22AAAAA0000A1Z5
Expected: ✅ Format Valid
```

**EU (Germany VAT):**
```
Country: GERMANY
Business ID: DE123456789
Expected: ⚠️ Real-time check (may fail if invalid)
```

**USA (EIN):**
```
Country: USA
Business ID: 12-3456789
Expected: ✅ Format Valid
```

**Australia (ABN):**
```
Country: AUSTRALIA
Business ID: 51824753556
Expected: ✅ Checksum Valid
```

### API Testing with cURL

```bash
curl -X POST http://localhost:3001/verification/verify \
  -H "Content-Type: application/json" \
  -d '{
    "country": "INDIA",
    "businessId": "22AAAAA0000A1Z5"
  }'
```

## 📝 Future Enhancements

### Planned Features
- [ ] **Real GST API Integration** (India) - Paid service
- [ ] **Companies House API** (UK) - Free API
- [ ] **IRS EIN Verification** (USA) - Requires authorization
- [ ] **Document Upload** - For manual verification
- [ ] **Verification History** - Track all verification attempts
- [ ] **Admin Dashboard** - Review and approve verifications
- [ ] **Email Notifications** - Verification status updates
- [ ] **Webhook Support** - Real-time verification updates

### Integration Opportunities
- **Payment Gateway** - Link verified businesses to payment processing
- **Credit Scoring** - Integrate with business credit services
- **KYC Services** - Enhanced identity verification
- **Blockchain** - Immutable verification records

## 🆘 Troubleshooting

### Common Issues

**1. "Failed to connect to verification service"**
- Check if backend server is running on port 3001
- Verify VITE_API_URL in `.env` file
- Check CORS configuration

**2. "EU VAT verification timeout"**
- EU VIES API may be temporarily unavailable
- Check internet connection
- Try again after a few minutes

**3. "Invalid format" errors**
- Verify the registration number format
- Check country-specific requirements
- Remove spaces and special characters

## 📚 Resources

- [EU VIES VAT Validation](https://ec.europa.eu/taxation_customs/vies/)
- [India GST Format](https://www.gst.gov.in/)
- [US EIN Information](https://www.irs.gov/businesses/small-businesses-self-employed/employer-id-numbers)
- [UK Companies House](https://www.gov.uk/government/organisations/companies-house)
- [Australia ABN Lookup](https://abr.business.gov.au/)

## 🤝 Contributing

To contribute to the verification system:
1. Add new country support
2. Improve validation logic
3. Enhance error messages
4. Add integration tests
5. Update documentation

## 📄 License

This verification system is part of the Panora Exports B2B Platform.

---

**Built with ❤️ for secure B2B transactions**
