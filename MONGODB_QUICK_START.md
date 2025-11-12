# MongoDB Atlas Integration - Quick Start Guide 🚀

## Prerequisites
- Node.js installed
- MongoDB Atlas account (already configured)
- Git (optional)

---

## Running the Project

### Terminal 1: Start Backend (MongoDB + Express Server)
```bash
cd backend
npm run dev
```

Expected output:
```
✅ MongoDB Atlas connected successfully
📊 Database: kyc_database

🚀 KYC Backend Server Running
📍 Server: http://localhost:5000
```

### Terminal 2: Start Frontend (React + Vite)
```bash
npm run dev
```

Expected output:
```
VITE v7.2.2  ready in ~1200 ms
➜  Local:   http://localhost:5173/
```

---

## Test the Integration

### 1. Open Browser
Navigate to: `http://localhost:5173`

### 2. Submit a KYC Form
Fill in the customer form and submit

### 3. Check Admin Dashboard
- Go to: `http://localhost:5173/admin`
- Login with:
  - Email: `admin@kyc.com`
  - Password: `admin123`

### 4. Verify Data in MongoDB
The submitted data is now in MongoDB Atlas cloud database

---

## API Endpoints

All endpoints work the same way as before:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/kyc/submit` | Submit KYC form |
| GET | `/api/kyc/status/:id` | Get submission status |
| GET | `/api/kyc/all` | Get all submissions (admin) |
| GET | `/api/kyc/stats` | Get dashboard stats |
| GET | `/api/kyc/search` | Search submissions |
| GET | `/health` | Health check |
| POST | `/api/auth/login` | Admin login |

---

## Key Changes Made

✅ Database changed from local JSON file to MongoDB Atlas
✅ All data now persists in the cloud
✅ Better scalability and performance
✅ Ready for LLM integration

---

## What's Next?

🎯 **Task 2:** Connect open-source LLM to generate summaries
- Install LLM API client
- Create summary generation service
- Store summaries in MongoDB

---

## Troubleshooting

**Q: Backend won't start**
A: Check if MongoDB connection string is correct in `.env`

**Q: Can't submit forms**
A: Ensure backend is running on port 5000

**Q: Data not saving**
A: Check browser console for errors, verify MongoDB is connected

---

**Happy coding! 🎉**
