# 🔗 Frontend-Backend Integration Guide

**Status:** ✅ Ready to Test  
**Date:** November 11, 2025  
**Target:** End-to-End KYC System

---

## 📋 Prerequisites

✅ **Frontend:** Built and running on `http://localhost:5173`  
✅ **Backend:** Code ready, dependencies installed  
✅ **Database:** Local JSON storage configured at `backend/data/`  
✅ **Configuration:** CORS enabled for cross-origin requests  

---

## 🚀 Getting Started (Step-by-Step)

### Step 1: Start Backend Server

Open a **new terminal** and run:

```bash
cd backend
npm run dev
```

Expected output:
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

✅ **Success Indicator:** Server running on port 5000 without errors

---

### Step 2: Verify Frontend is Running

In another terminal, make sure frontend is still running:

```bash
# If not already running:
npm run dev
```

Expected output:
```
VITE v7.2.2  ready in 489 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

✅ **Success Indicator:** Frontend running on port 5173

---

### Step 3: Open KYC Form in Browser

Navigate to: **`http://localhost:5173`**

You should see:
- Modern, gradient-themed form
- 4 steps: Personal Info, Address, Documents, Employment
- Progress indicator at top
- Clean, professional UI

---

### Step 4: Test Form Submission

**Fill out the form:**

**Step 1 - Personal Information:**
```
First Name: John
Last Name: Doe
Email: john.doe@example.com
Phone: +1-555-123-4567
Date of Birth: 1990-01-15
Nationality: United States
Gender: Male
```

**Step 2 - Address:**
```
Address: 123 Main Street
City: New York
State/Province: NY
Postal Code: 10001
Country: United States
```

**Step 3 - Documents:**
```
Document Type: Passport
Document ID: A12345678
Issue Date: 2020-01-01
Expiry Date: 2030-01-01
```

**Step 4 - Employment:**
```
Employment Status: Employed
Industry: Technology
Source of Funds: Salary
```

**Submit the form:**
1. Click "Submit" button
2. Form validates all fields
3. Sends POST request to backend

---

### Step 5: Verify Backend Received Data

Check the backend terminal - you should see:
```
📤 Submission received from: john.doe@example.com
💾 Saved with ID: KYC-A1B2C3D4
```

And check that the file was created:
```
backend/data/kyc-submissions.json
```

---

### Step 6: Success Card Display

After submission, you should see:
```
✅ Submission Successful!

Your submission ID: KYC-A1B2C3D4
Your information has been received and is being processed.
```

✅ **Integration Success:** Frontend → Backend → File Storage → Success Response

---

## 🧪 End-to-End Test Cases

### Test 1: Submit New KYC

**Steps:**
1. Fill form with valid data
2. Click Submit
3. Observe success card
4. Note the submission ID

**Expected Result:**
- ✅ Form clears
- ✅ Success card shows ID
- ✅ Backend logs submission
- ✅ JSON file updated

---

### Test 2: Check Submission Status

**Using Frontend:**
1. Copy submission ID from success card
2. Refresh page
3. ID should still be visible in browser

**Using API (curl):**
```bash
curl http://localhost:5000/api/kyc/status/KYC-A1B2C3D4
```

**Expected Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "Submission retrieved successfully",
  "data": {
    "id": "KYC-A1B2C3D4",
    "status": "submitted",
    "data": {...full form data...}
  }
}
```

---

### Test 3: Multiple Submissions

**Steps:**
1. Submit first form with John Doe data
2. Observe success and note ID
3. Fill form again with different person
4. Submit Jane Smith data
5. Observe different ID

**Expected Result:**
- ✅ Each submission gets unique ID
- ✅ Both saved to JSON file
- ✅ Both retrievable by ID

---

### Test 4: View All Submissions (Admin)

**Using curl:**
```bash
curl http://localhost:5000/api/kyc/all?page=1&limit=10
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "submissions": [
      { "id": "KYC-A1B2C3D4", "data": {...}, ...},
      { "id": "KYC-X9Y8Z7W6", "data": {...}, ...}
    ],
    "total": 2,
    "page": 1,
    "pages": 1
  }
}
```

---

### Test 5: Search Functionality

**Using curl:**
```bash
curl http://localhost:5000/api/kyc/search?q=john
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "count": 1,
    "results": [
      { "id": "KYC-A1B2C3D4", "data": {...} }
    ]
  }
}
```

---

### Test 6: Dashboard Statistics

**Using curl:**
```bash
curl http://localhost:5000/api/kyc/stats
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalSubmissions": 2,
    "submittedCount": 2,
    "processingCount": 0,
    "approvedCount": 0,
    "rejectedCount": 0
  }
}
```

---

## 🔍 Data Flow Visualization

```
┌─────────────────────────────────────────────────────────┐
│ FRONTEND (http://localhost:5173)                        │
│ ├─ CustomerForm.tsx (4-step form)                       │
│ ├─ React Hook Form (state management)                   │
│ ├─ Zod (validation schema)                              │
│ └─ Axios (HTTP client)                                  │
└──────────────────────┬──────────────────────────────────┘
                       │
        [POST] /api/kyc/submit
        [GET]  /api/kyc/status/:id
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│ BACKEND (http://localhost:5000)                         │
│ ├─ Express Server                                       │
│ ├─ CORS Middleware (allows :5173)                       │
│ ├─ Routes (kycRoutes.ts)                                │
│ ├─ Controllers (kycController.ts)                       │
│ ├─ Services (kycService.ts)                             │
│ └─ Storage (fileStorage.ts)                             │
└──────────────────────┬──────────────────────────────────┘
                       │
         Write/Read kyc-submissions.json
                       │
                       ↓
┌─────────────────────────────────────────────────────────┐
│ DATA STORAGE (backend/data/)                            │
│ └─ kyc-submissions.json                                 │
│    {                                                     │
│      "submissions": [                                   │
│        {id, data, timestamp, status, ...}              │
│      ]                                                  │
│    }                                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Issue 1: CORS Error in Console

**Error Message:**
```
Cross-Origin Request Blocked:
The Cross-Origin Request to 'http://localhost:5000/api/kyc/submit' 
was blocked by CORS policy.
```

**Solution:**
```bash
# Check backend .env file contains:
FRONTEND_URL=http://localhost:5173

# Restart backend:
npm run dev
```

---

### Issue 2: Backend Says "Port 5000 Already in Use"

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution 1:** Kill existing process on port 5000
```bash
# PowerShell:
Get-Process | Where-Object {$_.Handles -gt 300} | Stop-Process -Force

# Or change port in .env:
PORT=5001
```

---

### Issue 3: Form Submission Returns Network Error

**Error Message:**
```
Failed to fetch: http://localhost:5000/api/kyc/submit
```

**Debugging:**
1. Verify backend is running: `curl http://localhost:5000/health`
2. Check backend terminal for errors
3. Verify API URL in frontend: `src/services/api.ts`
4. Restart both frontend and backend

---

### Issue 4: Data Not Saving to JSON File

**Problem:** Form submits but no JSON file created

**Debugging Steps:**
```bash
# 1. Check if data directory exists:
ls backend/data/

# 2. Check permissions:
cd backend/data
# Try to create test file

# 3. Check backend logs:
# Look for errors in backend terminal

# 4. Verify fileStorage.ts is working:
# Add console logs to see where it fails
```

---

### Issue 5: Submission ID Not Showing

**Problem:** Form submits but success card doesn't show ID

**Debugging:**
1. Check browser console for errors (F12)
2. Check backend response status code
3. Verify response contains `data.id` field
4. Check frontend code: `src/pages/CustomerForm.tsx` lines handling response

---

## 📊 Monitoring Checklist

Before declaring integration successful, verify:

- [ ] Frontend loads at http://localhost:5173
- [ ] Backend running at http://localhost:5000
- [ ] Browser console has no CORS errors
- [ ] Form validation works (try submitting empty form)
- [ ] Successful submission shows success card
- [ ] Submission ID displayed and formatted correctly
- [ ] Backend logs show submission received
- [ ] `backend/data/kyc-submissions.json` file created
- [ ] JSON file contains submission data
- [ ] Can retrieve status with curl using submission ID
- [ ] Dashboard stats endpoint works
- [ ] Search functionality returns results
- [ ] Multiple submissions get unique IDs

---

## 🔗 API Endpoint Reference

### Submit KYC
```
POST http://localhost:5000/api/kyc/submit
Content-Type: application/json

{...form data...}

Response: { success: true, data: { id: "KYC-XXXXX", ... } }
```

### Get Status
```
GET http://localhost:5000/api/kyc/status/KYC-XXXXX

Response: { success: true, data: { id, status, data, ... } }
```

### Get All
```
GET http://localhost:5000/api/kyc/all?page=1&limit=10

Response: { success: true, data: { submissions: [...], total, ... } }
```

### Statistics
```
GET http://localhost:5000/api/kyc/stats

Response: { success: true, data: { totalSubmissions, submitted, processing, ... } }
```

### Search
```
GET http://localhost:5000/api/kyc/search?q=john

Response: { success: true, data: { count, results: [...] } }
```

### Health
```
GET http://localhost:5000/health

Response: { status: "OK", timestamp, uptime }
```

---

## 📁 Key Files for Integration

### Frontend Files
- `src/pages/CustomerForm.tsx` - Main form component
- `src/services/api.ts` - API client (base URL configuration)
- `src/types/kyc.ts` - Data types
- `src/types/validation.ts` - Zod validation schema

### Backend Files
- `backend/src/index.ts` - Server entry point
- `backend/src/routes/kycRoutes.ts` - Route definitions
- `backend/src/controllers/kycController.ts` - Request handlers
- `backend/src/services/kycService.ts` - Business logic
- `backend/.env` - Configuration

### Data Files
- `backend/data/kyc-submissions.json` - Submission storage (created on first submission)

---

## 🎯 Success Criteria

✅ **Phase 2 Integration is Successful When:**

1. Frontend form submits without errors
2. Backend receives and logs submission
3. Data persists to JSON file
4. Submission ID returned to frontend
5. Success card displays with ID
6. Status can be retrieved by ID
7. Multiple submissions stored separately
8. Dashboard stats show correct counts
9. Search finds submissions
10. No CORS errors in console

---

## 📝 Next Steps After Integration

Once integration is verified:

1. **Document API Usage** - Update API docs with tested endpoints
2. **Create Admin Dashboard** - UI to view all submissions
3. **Phase 3 Planning** - AI integration for summarization
4. **Database Migration** - Plan MongoDB integration path
5. **Error Handling** - Add more validation and error messages

---

## 💡 Testing with Postman / Insomnia

### Setup
1. Import backend API endpoints into Postman
2. Set variables: `{{ base_url }}` = `http://localhost:5000`
3. Test each endpoint

### Collection Template
```json
{
  "info": {
    "name": "KYC API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Submit KYC",
      "request": {
        "method": "POST",
        "url": "{{ base_url }}/api/kyc/submit",
        "body": {...}
      }
    }
  ]
}
```

---

## 🎓 Architecture Summary

```
Request → CORS → Express Middleware → Routes → Controller → Service → Storage
   ↓       ↓          ↓               ↓        ↓           ↓         ↓
Browser  Check      Body Parse      Match   Handle      Business   File I/O
         Origin     Logging         Path    Request     Logic      JSON
                                                         ↓
                                              Response ← Storage
                                                ↓
                                          CORS Check
                                                ↓
                                              Browser
```

---

## 📞 Support

### Common Issues Quick Links
- [CORS Error](#issue-1-cors-error-in-console)
- [Port Already in Use](#issue-2-backend-says-port-5000-already-in-use)
- [Network Error](#issue-3-form-submission-returns-network-error)
- [Data Not Saving](#issue-4-data-not-saving-to-json-file)
- [ID Not Showing](#issue-5-submission-id-not-showing)

### Checking Logs
```bash
# Backend logs in terminal where npm run dev is running
# Frontend logs in browser console (F12 → Console)
# Data verification: cat backend/data/kyc-submissions.json
```

---

## ✅ Integration Verification Checklist

After completing all steps above:

```
[ ] Backend running on :5000
[ ] Frontend running on :5173
[ ] Form displays correctly
[ ] Form validation working
[ ] Can submit form
[ ] Success card appears
[ ] Submission ID shown
[ ] Backend logs receipt
[ ] JSON file created
[ ] Data in JSON file
[ ] Can retrieve by ID
[ ] Stats show correct count
[ ] Search works
[ ] No console errors
```

---

**Integration Status:** ✅ READY FOR TESTING  
**Backend Version:** 1.0.0  
**Frontend Version:** 1.0.0  
**Last Updated:** November 11, 2025
