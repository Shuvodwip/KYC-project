# 🚀 QUICK START - Form Submission Testing

## 2-Step Setup

### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```

Wait for this message:
```
✅ MongoDB Atlas connected successfully
🚀 KYC Backend Server Running
📍 Server: http://localhost:5000
```

---

### Terminal 2: Start Frontend
```bash
npm run dev
```

Wait for this message:
```
VITE v7.2.2  ready
➜  Local:   http://localhost:5173/
```

---

## Test Form Submission

### 1. Open Browser
Go to: **http://localhost:5173**

### 2. Fill Form (All Fields Required)
- First Name: John
- Last Name: Doe
- Email: john@example.com
- Phone: 1234567890
- Date of Birth: 1990-01-15
- Nationality: USA
- Address: 123 Main St
- City: New York

### 3. Click Submit

### 4. Expected Result ✅
```
✅ Submission Successful!
Your information has been received and is being processed.
Submission ID: KYC-XXXXXXXX
```

---

## If Submission Fails

**Error: "Failed to submit form"**

### Check 1: Backend Running?
```bash
# In terminal, you should see these messages:
✅ MongoDB Atlas connected successfully
🚀 KYC Backend Server Running
```

### Check 2: MongoDB Connected?
```bash
# Look for this in backend terminal:
✅ MongoDB Atlas connected successfully
```

### Check 3: Both URLs Work?
- http://localhost:5000/health → Should show JSON with status "OK"
- http://localhost:5173 → Should show form

### Check 4: Ports Available?
```bash
# Check if ports are in use
netstat -ano | findstr ":5000"    # Backend
netstat -ano | findstr ":5173"    # Frontend
```

---

## Admin Dashboard

### Login to Admin
1. Go to: http://localhost:5173/admin
2. Email: `admin@kyc.com`
3. Password: `admin123`

### View Submissions
- See all KYC submissions
- View statistics
- Search submissions
- Download PDFs (coming in Task 2)

---

## Database Info

✅ **MongoDB Atlas is configured with:**
- New password updated
- Connection string: `mongodb+srv://shuvo787:4UgcVr7ZjLUJtkVf@cluster0.nybbnjy.mongodb.net/`
- Database: `kyc_database`
- Collection: `kyc_submissions`
- All data auto-backed up

---

## Success Indicators

✅ Backend output shows:
```
🔄 Connecting to MongoDB Atlas...
✅ MongoDB Atlas connected successfully
```

✅ Form submits and shows:
```
✅ Submission Successful!
Submission ID: KYC-XXXXX
```

✅ Data appears in:
- MongoDB Atlas dashboard
- Admin panel (http://localhost:5173/admin)

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Failed to submit" | Check backend is running: `npm run dev` |
| "Connection refused" | Kill port 5000: `taskkill /PID xxxxx /F` |
| "MongoDB failed" | Verify new password in `.env` file |
| "CORS error" | Check FRONTEND_URL in `.env` |
| "Form won't load" | Check frontend: `npm run dev` |

---

## Files Modified

✅ **backend/.env** - MongoDB connection updated
```
MONGODB_URI=mongodb+srv://shuvo787:4UgcVr7ZjLUJtkVf@cluster0.nybbnjy.mongodb.net/?appName=Cluster0
```

---

**Ready to submit forms!** 🎉

