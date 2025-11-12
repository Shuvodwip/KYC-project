@echo off
REM Test KYC submission endpoint

setlocal enabledelayedexpansion

curl -X POST http://localhost:5000/api/kyc/submit ^
  -H "Content-Type: application/json" ^
  -d "{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john@example.com\",\"phone\":\"1234567890\",\"dateOfBirth\":\"1990-01-15\",\"nationality\":\"USA\",\"gender\":\"Male\",\"address\":\"123 Main St\",\"city\":\"New York\",\"state\":\"NY\",\"postalCode\":\"10001\",\"country\":\"USA\",\"documentType\":\"Passport\",\"documentId\":\"A12345678\",\"documentIssueDate\":\"2020-01-01\",\"documentExpiryDate\":\"2030-01-01\",\"employmentStatus\":\"Employed\",\"industry\":\"Technology\",\"sourceOfFunds\":\"Salary\"}"

pause
