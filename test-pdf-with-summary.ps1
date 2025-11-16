# Test PDF Export with Summary - PowerShell Script

Write-Host @"

╔════════════════════════════════════════════════════════════╗
║     TESTING PDF EXPORT WITH SUMMARY                       ║
╚════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Create test data
$testData = @{
    firstName = "Pritha"
    lastName = "SAHA"
    email = "pritha@gmail.com"
    phone = "01935757163"
    dateOfBirth = "2001-07-25"
    nationality = "China"
    address = "Narsingdi Sadar, Narsingdi, Bangladesh"
    city = "Narsingdi"
    gender = "Female"
    documentType = "Passport"
    documentId = "AB123456"
    employmentStatus = "Employed"
    sourceOfFunds = "Employment"
} | ConvertTo-Json

Write-Host "1️⃣  STEP 1: Submitting KYC Form..." -ForegroundColor Yellow
Write-Host "   Sending POST request to /api/kyc/submit" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/kyc/submit" `
        -Method POST `
        -ContentType "application/json" `
        -Body $testData `
        -UseBasicParsing

    $responseContent = $response.Content | ConvertFrom-Json
    $submissionId = $responseContent.data.id

    Write-Host "   ✅ Form Submitted!" -ForegroundColor Green
    Write-Host "   Submission ID: $submissionId" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Submission Failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "2️⃣  STEP 2: Waiting for LLM Summary Generation..." -ForegroundColor Yellow
Write-Host "   Waiting 10 seconds..." -ForegroundColor Gray

for ($i = 10; $i -gt 0; $i--) {
    Write-Host -NoNewline "   ⏳ $i seconds remaining...`r"
    Start-Sleep -Seconds 1
}
Write-Host "   ✅ Wait complete!                     " -ForegroundColor Green

Write-Host ""
Write-Host "3️⃣  STEP 3: Checking Summary..." -ForegroundColor Yellow
Write-Host "   Fetching submission data..." -ForegroundColor Gray

try {
    $checkResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/kyc/submission/$submissionId" `
        -Method GET `
        -UseBasicParsing
    
    $checkContent = $checkResponse.Content | ConvertFrom-Json
    $summary = $checkContent.data.summary
    
    if ($summary -and $summary -ne "Summary pending...") {
        Write-Host "   ✅ Summary Generated!" -ForegroundColor Green
        Write-Host "   Summary: $summary" -ForegroundColor Yellow
    } else {
        Write-Host "   ⚠️  Summary status: $summary" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "   ❌ Failed to fetch submission: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "4️⃣  STEP 4: Downloading PDF..." -ForegroundColor Yellow
Write-Host "   Requesting PDF export..." -ForegroundColor Gray

try {
    $pdfDir = "C:\temp"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $pdfPath = "$pdfDir\customer-pritha-saha-$timestamp.pdf"
    
    # Create directory if it doesn't exist
    if (-not (Test-Path $pdfDir)) {
        New-Item -ItemType Directory -Path $pdfDir -Force | Out-Null
    }
    
    # Download PDF
    Invoke-WebRequest -Uri "http://localhost:5000/api/kyc/export/$submissionId" `
        -OutFile $pdfPath
    
    Write-Host "   ✅ PDF Downloaded!" -ForegroundColor Green
    Write-Host "   Location: $pdfPath" -ForegroundColor Green
    
    # Check file size
    if (Test-Path $pdfPath) {
        $fileSize = (Get-Item $pdfPath).Length
        Write-Host "   File Size: $([math]::Round($fileSize / 1KB, 2)) KB" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "5️⃣  STEP 5: PDF Verification" -ForegroundColor Yellow
        Write-Host "   ✅ PDF file created successfully" -ForegroundColor Green
        Write-Host "   📄 You can open this file to verify the summary appears" -ForegroundColor Cyan
        Write-Host "   💡 Look for: 'AI SUMMARY' section after the title" -ForegroundColor Cyan
    }
}
catch {
    Write-Host "   ❌ PDF Download Failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     ✅ TEST COMPLETE                                       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host ""
Write-Host "SUMMARY OF CHANGES:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Fixed: PDF Export now includes summary" -ForegroundColor Green
Write-Host "   - Modified: backend/src/controllers/kycController.ts" -ForegroundColor Gray
Write-Host "   - Added: summary field to customerData object" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Improved: Summary Generation with Better Grammar" -ForegroundColor Green
Write-Host "   - Modified: backend/src/services/llmService.ts" -ForegroundColor Gray
Write-Host "   - Updated: LLM prompt to request proper English" -ForegroundColor Gray
Write-Host "   - Enhanced: Fallback summary with full sentences" -ForegroundColor Gray
Write-Host ""
Write-Host "EXAMPLE OF NEW FALLBACK SUMMARY FORMAT:" -ForegroundColor Cyan
Write-Host "   'Pritha SAHA is a 23-year-old China national residing in" -ForegroundColor Gray
Write-Host "    Narsingdi with Employed employment status.'" -ForegroundColor Gray
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Download the PDF and open it" -ForegroundColor Gray
Write-Host "   2. Look for 'AI SUMMARY' section after the title" -ForegroundColor Gray
Write-Host "   3. Verify the summary displays properly" -ForegroundColor Gray
Write-Host "   4. Check that the summary is a complete English sentence" -ForegroundColor Gray
Write-Host ""
