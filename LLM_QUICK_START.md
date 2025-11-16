# ⚡ LLM INTEGRATION - QUICK START GUIDE

## 🚀 Get Started in 2 Minutes

### **Terminal 1: Start Backend**
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

### **Terminal 2: Submit Test Form**

**Using PowerShell:**
```powershell
$body = @{
    firstName = "John"
    lastName = "Smith"
    email = "john@example.com"
    phone = "+1-555-9999"
    dateOfBirth = "1990-01-15"
    nationality = "American"
    address = "123 Main St"
    city = "Los Angeles"
    employmentStatus = "Employed"
    sourceOfFunds = "Salary"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/kyc/submit" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$result = $response.Content | ConvertFrom-Json
$submissionId = $result.data.id

Write-Host "✅ Submitted! ID: $submissionId"
Write-Host "⏳ Waiting for LLM summary..."
Start-Sleep -Seconds 5

# Get the summary
$summary = Invoke-WebRequest -Uri "http://localhost:5000/api/kyc/summary/$submissionId" | ConvertFrom-Json
Write-Host "📝 Summary: $($summary.data.summary)"
```

---

## 📊 Expected Output

**After Form Submission (Backend Console):**
```
[LLM] Generating summary for submission KYC-ABC12345...
[LLM] Summary generated: John Smith, Age 34, from Los Angeles, American | Employment: Employed
[LLM] Summary stored for submission KYC-ABC12345
```

**API Response:**
```json
{
  "success": true,
  "data": {
    "id": "KYC-ABC12345",
    "summary": "John Smith, Age 34, from Los Angeles, American | Employment: Employed",
    "customerName": "John Smith"
  }
}
```

---

## 🧪 Test Endpoints

### **Test 1: Check Health**
```bash
curl http://localhost:5000/health
```

### **Test 2: Get All Submissions**
```bash
curl http://localhost:5000/api/kyc/all
```

### **Test 3: Get Specific Submission with Summary**
```bash
curl http://localhost:5000/api/kyc/summary/KYC-ABC12345
```

---

## ✅ Verification Checklist

- [ ] Backend started successfully
- [ ] Form submitted without errors
- [ ] Submission ID returned
- [ ] LLM logs appeared in backend console
- [ ] Summary generated and stored
- [ ] Retrieved summary via API
- [ ] Summary appears in database

---

## 🐛 Troubleshooting

### **Issue: "Cannot find module 'ts-node'"**
```bash
cd backend
npm install
npm run dev
```

### **Issue: "Port 5000 already in use"**
```bash
Get-Process node | Stop-Process -Force
```

### **Issue: "LLM API timeout"**
- Hugging Face free tier can be slow
- First request may take 10+ seconds
- Fallback summary will be used if timeout occurs

### **Issue: "No summary generated"**
Check backend logs for:
- `[LLM] Error generating summary...` → API error
- Missing API key → Check `.env` file
- Network issue → Check internet connection

---

## 📚 Documentation

- **Full Implementation Guide:** `TASK2_LLM_INTEGRATION_COMPLETE.md`
- **Technical Details:** `LLM_INTEGRATION_SUMMARY.md`
- **API Reference:** Check routes in `backend/src/routes/kycRoutes.ts`

---

✨ **LLM Integration is Ready!** ✨
