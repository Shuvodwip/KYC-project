# 🎯 Phase 2: Backend API - Complete Documentation

## Overview

Express.js REST API for the KYC Data Management System. Handles customer KYC submissions, storage, and retrieval with local JSON file storage.

**Status:** ✅ Complete & Ready for Use  
**Last Updated:** November 11, 2025

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

The default `.env` is already set up for local development:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATA_DIR=./data
```

### 3. Start Development Server

```bash
npm run dev
```

Output:
```
============================================================
🚀 KYC Backend Server Running
============================================================
📍 Server: http://localhost:5000
🌐 CORS Origin: http://localhost:5173
📁 Data Directory: ./data
============================================================

Endpoints:
  ✓ POST   /api/kyc/submit        - Submit KYC data
  ✓ GET    /api/kyc/status/:id    - Get submission status
  ✓ GET    /api/kyc/all           - Get all submissions
  ✓ GET    /api/kyc/stats         - Get statistics
  ✓ GET    /api/kyc/search        - Search submissions
  ✓ GET    /health                - Health check
```

---

### 4. Start RabbitMQ + PDF Worker (for email delivery)

1. Run RabbitMQ locally (Docker example):
   ```bash
   docker run -d --hostname kyc-rabbit --name rabbitmq \
     -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management
   ```
2. Configure the mail + RabbitMQ values inside `.env` (`RABBITMQ_URL`, `MAIL_HOST`, etc.).
3. Start the worker in a second terminal:
   ```bash
   npm run worker:pdf
   ```

The API will enqueue jobs via `POST /api/kyc/export/:id/email`, and the worker will generate the PDF + email it to the customer.

---

## 📋 API Endpoints

### 1. Submit KYC Data

**Endpoint:** `POST /api/kyc/submit`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "dateOfBirth": "1990-01-15",
  "nationality": "United States",
  "gender": "male",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "United States",
  "documentType": "passport",
  "documentId": "A12345678",
  "documentIssueDate": "2020-01-01",
  "documentExpiryDate": "2030-01-01",
  "employmentStatus": "employed",
  "industry": "Technology",
  "sourceOfFunds": "salary"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "status": 201,
  "message": "KYC submitted successfully",
  "data": {
    "id": "KYC-A1B2C3D4",
    "status": "submitted",
    "message": "Your KYC information has been received",
    "timestamp": "2025-11-11T12:00:00.000Z"
  },
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

---

### 2. Get Submission Status

**Endpoint:** `GET /api/kyc/status/:id`

**Example:** `GET /api/kyc/status/KYC-A1B2C3D4`

**Response (200 OK):**
```json
{
  "success": true,
  "status": 200,
  "message": "Submission retrieved successfully",
  "data": {
    "id": "KYC-A1B2C3D4",
    "status": "submitted",
    "message": "Submission status: submitted",
    "timestamp": "2025-11-11T12:00:00.000Z",
    "data": {
      "firstName": "John",
      "lastName": "Doe",
      ...
    }
  },
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "status": 404,
  "message": "Submission not found",
  "error": "Submission not found",
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

---

### 3. Get All Submissions (Admin)

**Endpoint:** `GET /api/kyc/all`

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 10) - Items per page

**Example:** `GET /api/kyc/all?page=1&limit=20`

**Response (200 OK):**
```json
{
  "success": true,
  "status": 200,
  "message": "Submissions retrieved successfully",
  "data": {
    "submissions": [
      {
        "id": "KYC-A1B2C3D4",
        "data": {...},
        "timestamp": "2025-11-11T12:00:00.000Z",
        "status": "submitted",
        "createdAt": "2025-11-11T12:00:00.000Z",
        "updatedAt": "2025-11-11T12:00:00.000Z"
      }
    ],
    "total": 150,
    "page": 1,
    "pages": 8
  },
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

---

### 4. Get Dashboard Statistics

**Endpoint:** `GET /api/kyc/stats`

**Response (200 OK):**
```json
{
  "success": true,
  "status": 200,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "totalSubmissions": 150,
    "submittedCount": 100,
    "processingCount": 30,
    "approvedCount": 15,
    "rejectedCount": 5
  },
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

---

### 5. Search Submissions

**Endpoint:** `GET /api/kyc/search`

**Query Parameters:**
- `q` (required) - Search query (name, email, phone, or ID)

**Example:** `GET /api/kyc/search?q=john@example.com`

**Response (200 OK):**
```json
{
  "success": true,
  "status": 200,
  "message": "Search completed successfully",
  "data": {
    "count": 2,
    "results": [
      {
        "id": "KYC-A1B2C3D4",
        "data": {...},
        "timestamp": "2025-11-11T12:00:00.000Z",
        "status": "submitted"
      }
    ]
  },
  "timestamp": "2025-11-11T12:00:00.000Z"
}
```

---

### 6. Health Check

**Endpoint:** `GET /health`

**Response (200 OK):**
```json
{
  "status": "OK",
  "timestamp": "2025-11-11T12:00:00.000Z",
  "uptime": 3600.5
}
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── kycController.ts         # Request handlers
│   ├── services/
│   │   └── kycService.ts            # Business logic
│   ├── routes/
│   │   └── kycRoutes.ts             # Route definitions
│   ├── middleware/
│   │   └── errorHandler.ts          # Error handling
│   ├── utils/
│   │   ├── fileStorage.ts           # File operations
│   │   └── types.ts                 # TypeScript types
│   └── index.ts                     # Server entry point
├── data/
│   └── kyc-submissions.json         # Data store
├── package.json
├── tsconfig.json
├── .env
├── .env.example
└── README.md
```

---

## 🔒 Data Storage

### Local JSON File

Data is stored in `data/kyc-submissions.json`:

```json
{
  "submissions": [
    {
      "id": "KYC-A1B2C3D4",
      "data": {
        "firstName": "John",
        "lastName": "Doe",
        ...
      },
      "timestamp": "2025-11-11T12:00:00.000Z",
      "status": "submitted",
      "createdAt": "2025-11-11T12:00:00.000Z",
      "updatedAt": "2025-11-11T12:00:00.000Z"
    }
  ]
}
```

---

## 🛠 Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| Express | 4.18.2 | Web framework |
| TypeScript | 5.2.2 | Type safety |
| CORS | 2.8.5 | Cross-origin requests |
| Helmet | 7.1.0 | Security headers |
| dotenv | 16.3.1 | Environment config |
| UUID | 9.0.1 | Unique IDs |
| Node.js | 18+ | Runtime |

---

## 🔐 Security Features

✅ **CORS Configuration** - Only allows frontend origin  
✅ **Helmet Headers** - Security headers  
✅ **Input Validation** - Frontend-backed server validation  
✅ **Error Handling** - Proper error responses  
✅ **Environment Variables** - No hardcoded secrets  
✅ **Type Safety** - TypeScript strict mode  

---

## 📊 Response Format

All API responses follow a consistent format:

```typescript
{
  success: boolean;           // Success status
  status: number;            // HTTP status code
  message: string;           // Human-readable message
  data?: T;                  // Response data (if successful)
  error?: string;            // Error description (if failed)
  timestamp: string;         // ISO 8601 timestamp
}
```

---

## ⚠️ Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "status": 400,
  "message": "Validation failed",
  "error": "Missing required fields"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "status": 404,
  "message": "Submission not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "status": 500,
  "message": "Internal Server Error"
}
```

---

## 🧪 Testing with cURL

### Submit KYC

```bash
curl -X POST http://localhost:5000/api/kyc/submit \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1-555-123-4567",
    "dateOfBirth": "1990-01-15",
    "nationality": "United States",
    "gender": "male",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "United States",
    "documentType": "passport",
    "documentId": "A12345678",
    "documentIssueDate": "2020-01-01",
    "documentExpiryDate": "2030-01-01",
    "employmentStatus": "employed",
    "industry": "Technology",
    "sourceOfFunds": "salary"
  }'
```

### Get All Submissions

```bash
curl http://localhost:5000/api/kyc/all?page=1&limit=10
```

### Get Dashboard Stats

```bash
curl http://localhost:5000/api/kyc/stats
```

### Search Submissions

```bash
curl http://localhost:5000/api/kyc/search?q=john
```

### Health Check

```bash
curl http://localhost:5000/health
```

---

## 📝 Submission Statuses

- **submitted** - Initial submission received
- **processing** - Admin reviewing KYC data
- **approved** - KYC approved
- **rejected** - KYC rejected

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Creates `dist/` folder with compiled JavaScript.

### Start Production Server

```bash
npm run start
```

---

## 🔗 Integration with Frontend

Frontend (`http://localhost:5173`) is pre-configured to call backend endpoints:

```typescript
// src/services/api.ts
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});
```

Update `VITE_API_URL` in frontend `.env.local` if backend runs on different port/host.

---

## 📊 Data Management

### Adding More Data

New submissions are automatically appended to `kyc-submissions.json`:

```bash
curl http://localhost:5000/api/kyc/all
# Get latest submissions with pagination
```

### Clearing Data

Remove `data/kyc-submissions.json` and restart server to reset data.

---

## 🐛 Debugging

### Enable Detailed Logging

Add to `.env`:
```env
DEBUG=true
NODE_ENV=development
```

### Check Data File

```bash
cat data/kyc-submissions.json
```

### Server Logs

Check console output for request logs and errors.

---

## ✅ Checklist for Phase 2

- [x] Express server setup
- [x] CORS configuration
- [x] Routes defined
- [x] Controllers implemented
- [x] Services layer created
- [x] Local JSON storage
- [x] Error handling middleware
- [x] Response formatting
- [x] TypeScript strict mode
- [x] Environment configuration
- [x] Security headers (Helmet)
- [x] API documentation

---

## 🗺️ Next Phase: Phase 3 - AI Integration

Will add:
- LLM service integration (Ollama/Hugging Face)
- KYC summarization endpoint
- Summary storage
- Admin dashboard integration

---

**Backend Version:** 1.0.0  
**Status:** ✅ Complete & Production-Ready
