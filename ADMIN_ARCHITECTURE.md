# 🎨 Admin Features - Visual Reference & Architecture

---

## 📐 Application Flow Diagram

```
START
  ↓
┌─────────────────────────────┐
│   KYC Application Home      │
│   Navigation Bar Visible    │
│  - Customer Form            │
│  - Admin Login ←─────────┐  │
└─────────────────────────────┘
         ↓
    [User Path]
    Click "Admin Login"
         ↓
┌─────────────────────────────┐
│  Admin Login Page           │
│  - Email input              │
│  - Password input           │
│  - Demo Credentials Toggle  │
│  - Features List            │
└─────────────────────────────┘
         ↓
   [Validate Input]
    [Submit Form]
         ↓
    [Backend Check]
    POST /api/auth/login
         ↓
    ┌─Fail─────────────────┐
    │ Show Error Message   │
    │ Return to Login      │
    └─────────────────────┘
         ↓
    ┌─Pass─────────────────┐
    │ JWT Token Generated  │
    │ Token Stored         │
    └─────────────────────┘
         ↓
┌─────────────────────────────┐
│ Admin Dashboard             │
│ Navigation: "Admin Logged In"│
│                             │
│ Total Customers: X          │
│                             │
│ ┌─ Customer Card 1 ────┐   │
│ │ Name: John Doe       │   │
│ │ Email: john@...      │   │
│ │ Phone: +1-555-1234   │   │
│ │ [📥 Download PDF]    │   │
│ └──────────────────────┘   │
│ ┌─ Customer Card 2 ────┐   │
│ │ Name: Jane Smith     │   │
│ │ Email: jane@...      │   │
│ │ Phone: +1-555-5678   │   │
│ │ [📥 Download PDF]    │   │
│ └──────────────────────┘   │
│                             │
│ [🚪 Logout]                 │
└─────────────────────────────┘
         ↓
   [Click PDF Button]
         ↓
    GET /api/kyc/export/:id
    (JWT Authenticated)
         ↓
    [Generate PDF]
    [Stream to Browser]
         ↓
    [Browser Downloads]
    customer-John-Doe.pdf
         ↓
   [Click Logout]
         ↓
    [Clear Token]
    [Clear Session]
         ↓
┌─────────────────────────────┐
│   Back to Home              │
│   Navigation: Admin Login   │
└─────────────────────────────┘
         ↓
      END
```

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    WEB BROWSER                             │
│  http://localhost:5173                                     │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              React Application                       │ │
│  │                                                      │ │
│  │  ┌─────────────────┐      ┌─────────────────┐      │ │
│  │  │  App.tsx        │      │ Navigation Bar  │      │ │
│  │  │ (Router)        │      │  - Customer Form │      │ │
│  │  │ (Auth State)    │──┬──→│  - Admin Login   │      │ │
│  │  └─────────────────┘  │   │  - Admin Logged  │      │ │
│  │                       │   │    In           │      │ │
│  │                       ↓   └─────────────────┘      │ │
│  │         ┌───────────────────────┐                  │ │
│  │         │ Page Routing          │                  │ │
│  │         ├───────────────────────┤                  │ │
│  │         │ • SimpleCustomerForm  │                  │ │
│  │         │ • AdminLoginPage      │                  │ │
│  │         │ • AdminDashboard      │                  │ │
│  │         └───────────────────────┘                  │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  localStorage: { adminToken: "JWT..." }                   │
│                                                            │
└────────────────────────────────────────────────────────────┘
                         ↕ HTTP
        ┌────────────────────────────────────┐
        │   AXIOS Client (api.ts)            │
        │   Base URL: http://localhost:5000  │
        │   Headers: Authorization: Bearer   │
        └────────────────────────────────────┘
                         ↕ HTTP
┌────────────────────────────────────────────────────────────┐
│         EXPRESS BACKEND                                    │
│         http://localhost:5000                              │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │             Middleware Stack                       │   │
│  │  • Helmet (Security)                              │   │
│  │  • CORS (Cross-Origin)                            │   │
│  │  • Body Parser (JSON)                             │   │
│  │  • Logger                                         │   │
│  └────────────────────────────────────────────────────┘   │
│                         ↓                                   │
│  ┌────────────────────────────────────────────────────┐   │
│  │          Route Handlers                            │   │
│  │                                                    │   │
│  │  POST /api/auth/login                             │   │
│  │  ├─→ authController.adminLogin()                  │   │
│  │  ├─→ Validate credentials                         │   │
│  │  ├─→ Generate JWT token                           │   │
│  │  └─→ Return token                                 │   │
│  │                                                    │   │
│  │  GET /api/auth/verify (Protected)                 │   │
│  │  ├─→ authMiddleware.verifyToken()                 │   │
│  │  └─→ Return verification status                   │   │
│  │                                                    │   │
│  │  GET /api/kyc/all (Protected)                     │   │
│  │  ├─→ authMiddleware.verifyToken()                 │   │
│  │  ├─→ kycController.getAllSubmissions()            │   │
│  │  └─→ Return all customers                         │   │
│  │                                                    │   │
│  │  GET /api/kyc/export/:id (Protected)              │   │
│  │  ├─→ authMiddleware.verifyToken()                 │   │
│  │  ├─→ kycController.exportCustomerPDF()            │   │
│  │  ├─→ pdfService.generateCustomerPDF()             │   │
│  │  └─→ Stream PDF to browser                        │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                         ↓                                   │
│  ┌────────────────────────────────────────────────────┐   │
│  │          Services                                  │   │
│  │  • kycService.ts - Data management                │   │
│  │  • pdfService.ts - PDF generation                 │   │
│  └────────────────────────────────────────────────────┘   │
│                         ↓                                   │
│  ┌────────────────────────────────────────────────────┐   │
│  │          Data Storage                              │   │
│  │  📄 kyc-submissions.json                           │   │
│  │  └─ [ { id, firstName, email, ... }, ... ]        │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │          Error Handler                             │   │
│  │  • Global exception handler                        │   │
│  │  • 404 handler                                     │   │
│  │  • Proper error responses                          │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 🔐 JWT Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│                 LOGIN REQUEST                            │
│                                                          │
│  Client                        Backend                   │
│    │                              │                      │
│    ├──POST /api/auth/login───────>│                      │
│    │  {                            │                      │
│    │   email: "admin@kyc.com"     │                      │
│    │   password: "admin123"        │                      │
│    │  }                            │                      │
│    │                              │                      │
│    │                              ├─ Validate input       │
│    │                              ├─ Check credentials    │
│    │                              ├─ Generate JWT:        │
│    │                              │  header.payload.sig   │
│    │                              │                      │
│    │<─ 200 OK ─────────────────────│                      │
│    │  {                            │                      │
│    │   token: "eyJhbG..."         │                      │
│    │   admin: {                    │                      │
│    │    id: "admin-001",           │                      │
│    │    email: "admin@kyc.com"     │                      │
│    │   }                           │                      │
│    │  }                            │                      │
│    │                              │                      │
│    ├─ Save token to localStorage   │                      │
│    │  localStorage.adminToken      │                      │
│    │                              │                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              PROTECTED REQUEST                           │
│                                                          │
│  Client                        Backend                   │
│    │                              │                      │
│    ├─GET /api/kyc/all ───────────>│                      │
│    │  Headers: {                   │                      │
│    │   Authorization:              │                      │
│    │   "Bearer eyJhbG..."          │                      │
│    │  }                            │                      │
│    │                              │                      │
│    │                              ├─ Check header         │
│    │                              ├─ Extract token        │
│    │                              ├─ Verify JWT:         │
│    │                              │  • Check signature    │
│    │                              │  • Check expiration   │
│    │                              │  • Decode payload     │
│    │                              ├─ Get user from JWT    │
│    │                              │  (admin-001, email)   │
│    │                              ├─ Execute handler      │
│    │                              │  (getAllSubmissions)   │
│    │<─ 200 OK ─────────────────────│                      │
│    │  {                            │                      │
│    │   submissions: [              │                      │
│    │    { id, firstName, ... },    │                      │
│    │    { id, firstName, ... }     │                      │
│    │   ]                           │                      │
│    │  }                            │                      │
│    │                              │                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              INVALID TOKEN                               │
│                                                          │
│  Client                        Backend                   │
│    │                              │                      │
│    ├─GET /api/kyc/all ───────────>│                      │
│    │  Headers: {                   │                      │
│    │   Authorization:              │                      │
│    │   "Bearer expired_token..."   │                      │
│    │  }                            │                      │
│    │                              │                      │
│    │                              ├─ Check header         │
│    │                              ├─ Extract token        │
│    │                              ├─ Verify JWT:         │
│    │                              │  ✗ Expired!          │
│    │                              │                      │
│    │<─ 401 Unauthorized ───────────│                      │
│    │  {                            │                      │
│    │   message:                    │                      │
│    │   "Invalid or expired token"  │                      │
│    │  }                            │                      │
│    │                              │                      │
│    ├─ Clear token from storage     │                      │
│    ├─ Redirect to login            │                      │
│    │                              │                      │
└──────────────────────────────────────────────────────────┘
```

---

## 📄 PDF Generation Pipeline

```
┌────────────────────────────────────────────┐
│   User Clicks "📥 Download PDF"            │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│   Frontend sends request:                  │
│   GET /api/kyc/export/{customerId}         │
│   Header: Authorization: Bearer {token}    │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│   Backend receives request                 │
│   ├─ Extract token from header             │
│   ├─ Verify JWT token                      │
│   └─ Check user is authenticated           │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│   kycController.exportCustomerPDF()        │
│   ├─ Get customerId from URL params        │
│   ├─ Query database for customer data      │
│   └─ Check if customer exists              │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│   pdfService.generateCustomerPDF()         │
│                                            │
│   Create new PDFDocument:                  │
│   ├─ Title: KYC CUSTOMER INFORMATION       │
│   ├─ Header with timestamp                 │
│   ├─ Section 1: Personal Information       │
│   │  ├─ Full Name                          │
│   │  ├─ Date of Birth                      │
│   │  └─ Nationality                        │
│   ├─ Section 2: Contact Information        │
│   │  ├─ Email Address                      │
│   │  └─ Phone Number                       │
│   ├─ Section 3: Address Information        │
│   │  ├─ Street Address                     │
│   │  └─ City                               │
│   ├─ Section 4: Document Details           │
│   │  ├─ Registration Date                  │
│   │  ├─ Customer ID                        │
│   │  └─ Document Type                      │
│   └─ Footer with confidentiality notice    │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│   Response with PDF Stream:                │
│   ├─ Content-Type: application/pdf         │
│   ├─ Content-Disposition: attachment       │
│   ├─ Filename: customer-John-Doe.pdf       │
│   └─ Stream PDF data                       │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│   Browser receives response:               │
│   ├─ Detects PDF content type              │
│   ├─ Creates blob from stream              │
│   ├─ Creates download link                 │
│   ├─ Triggers download                     │
│   └─ File saves to Downloads folder        │
└────────────────────────────────────────────┘
              ↓
┌────────────────────────────────────────────┐
│   User's computer                          │
│   📥 customer-John-Doe.pdf                 │
│   Location: ~/Downloads/                   │
└────────────────────────────────────────────┘
```

---

## 🎨 UI Component Hierarchy

```
App
├── Navigation Bar
│   ├── Logo "KYC System"
│   ├── Link: "Customer Form"
│   ├── Link: "Admin Login" (conditional)
│   └── Link: "Admin Logged In" (conditional)
│
├── Routes
│   │
│   ├── Route: /
│   │   └── SimpleCustomerForm
│   │       ├── Form Header
│   │       ├── Form Fields (8 inputs)
│   │       ├── Submit Button
│   │       └── Success Modal
│   │
│   ├── Route: /admin-login
│   │   └── AdminLoginPage
│   │       ├── Login Card
│   │       │   ├── Header (🔐 Admin Portal)
│   │       │   ├── Email Input
│   │       │   ├── Password Input
│   │       │   ├── Error Alert (conditional)
│   │       │   ├── Login Button
│   │       │   ├── Demo Credentials Toggle
│   │       │   └── Demo Credentials Box (conditional)
│   │       └── Features List
│   │
│   └── Route: /admin-dashboard
│       └── AdminDashboard
│           ├── Dashboard Header
│           │   ├── Title "📊 Admin Dashboard"
│           │   └── Logout Button
│           ├── Content Area
│           │   ├── Customer Count Badge
│           │   ├── Empty State (conditional)
│           │   ├── Loading Spinner (conditional)
│           │   ├── Error Banner (conditional)
│           │   └── Customer Grid
│           │       └── Customer Cards (repeating)
│           │           ├── Card Header
│           │           │   ├── Name
│           │           │   └── Customer ID
│           │           ├── Card Body
│           │           │   ├── Email
│           │           │   ├── Phone
│           │           │   ├── DOB
│           │           │   ├── Nationality
│           │           │   ├── Address
│           │           │   ├── City
│           │           │   └── Registration Date
│           │           └── Card Footer
│           │               └── PDF Download Button
│           └── Footer
```

---

## 📊 Data Flow Diagram

```
Customer Submission
         ↓
┌──────────────────────────┐
│ SimpleCustomerForm       │
│ (Frontend)               │
│ - 8 input fields         │
│ - Form validation (Zod)  │
│ - Submit handler         │
└──────────────────────────┘
         ↓
POST /api/kyc/submit
         ↓
┌──────────────────────────┐
│ Backend                  │
│ - Receive form data      │
│ - Validate input         │
│ - Generate submission ID │
│ - Save to JSON file      │
└──────────────────────────┘
         ↓
kyc-submissions.json
{
  "submissions": [
    {
      "id": "uuid-123",
      "status": "pending",
      "timestamp": "2025-11-11T10:00:00Z",
      "data": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1-555-1234",
        "dateOfBirth": "1990-01-15",
        "nationality": "United States",
        "address": "123 Main St",
        "city": "New York"
      }
    }
  ]
}
         ↓
Admin Login
         ↓
POST /api/auth/login
         ↓
Backend validates credentials
Generates JWT token
         ↓
Token stored in localStorage
         ↓
Admin Dashboard
         ↓
GET /api/kyc/all (with JWT)
         ↓
Backend returns all customers
         ↓
Dashboard displays customer cards
         ↓
User clicks PDF download
         ↓
GET /api/kyc/export/:id (with JWT)
         ↓
Backend generates PDF
         ↓
Browser downloads PDF file
```

---

## 🔄 State Management

```
App Component State:
│
├── currentPage: 'form' | 'admin-login' | 'admin-dashboard'
│   └─ Controls which component to render
│
├── adminToken: string | null
│   ├─ Stored in: localStorage.adminToken
│   ├─ Set by: handleLoginSuccess()
│   ├─ Cleared by: handleLogout()
│   └─ Used for: Protected API calls
│
└── Event Handlers:
    ├── handleLoginSuccess(token)
    │   ├─ Save token to localStorage
    │   ├─ Set adminToken state
    │   └─ Navigate to dashboard
    │
    └── handleLogout()
        ├─ Clear localStorage
        ├─ Clear token state
        └─ Navigate to form

AdminDashboard Component State:
│
├── customers: Customer[]
│   └─ Fetched from GET /api/kyc/all
│
├── isLoading: boolean
│   └─ Show loading spinner
│
├── error: string | null
│   └─ Show error banner
│
├── downloadingId: string | null
│   └─ Track which PDF is downloading
│
└── Effects:
    └── useEffect(() => fetchCustomers(), [])
        └─ Load customers on mount
```

---

## 🔌 API Contracts

### Authentication Endpoints

#### POST /api/auth/login
```
Request:
{
  "email": "admin@kyc.com",
  "password": "admin123"
}

Response (200):
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "admin-001",
    "email": "admin@kyc.com"
  }
}

Response (401):
{
  "message": "Invalid email or password"
}
```

#### GET /api/auth/verify
```
Request:
Headers: Authorization: Bearer {token}

Response (200):
{
  "message": "Token is valid",
  "authenticated": true
}

Response (401):
{
  "message": "Invalid or expired token"
}
```

### KYC Endpoints

#### GET /api/kyc/all (Protected)
```
Request:
Headers: Authorization: Bearer {token}

Response (200):
{
  "success": true,
  "status": 200,
  "message": "Submissions retrieved successfully",
  "data": {
    "total": 2,
    "submissions": [
      {
        "id": "uuid-1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "+1-555-1234",
        "dateOfBirth": "1990-01-15",
        "nationality": "United States",
        "address": "123 Main St",
        "city": "New York",
        "createdAt": "2025-11-11T10:00:00Z"
      }
    ]
  }
}
```

#### GET /api/kyc/export/:id (Protected)
```
Request:
Headers: Authorization: Bearer {token}

Response (200):
Content-Type: application/pdf
[PDF Binary Data]
Filename: customer-John-Doe.pdf

Response (401):
{
  "message": "Invalid or expired token"
}

Response (404):
{
  "message": "Customer not found"
}
```

---

**Diagram Version**: 1.0.0  
**Last Updated**: 2025-11-11
