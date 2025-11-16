# MongoDB Integration - Technical Documentation

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│             React Frontend (Vite)                    │
│   http://localhost:5173                             │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ HTTP/REST API
                   │
┌──────────────────▼──────────────────────────────────┐
│   Express Backend Server (Node.js)                   │
│   http://localhost:5000                             │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  API Routes                                  │  │
│  │  - /api/kyc/submit                          │  │
│  │  - /api/kyc/status/:id                      │  │
│  │  - /api/kyc/all                             │  │
│  │  - /api/kyc/stats                           │  │
│  │  - /api/auth/login                          │  │
│  └──────────────────────────────────────────────┘  │
│                   │                                  │
│  ┌────────────────▼──────────────────────────────┐ │
│  │  Service Layer                                │ │
│  │  - KYCService                                │ │
│  │  - AuthService                               │ │
│  │  - PDFService                                │ │
│  └────────────────┬──────────────────────────────┘ │
│                   │                                  │
│  ┌────────────────▼──────────────────────────────┐ │
│  │  MongoDB Service (NEW)                       │ │
│  │  - saveSubmission()                          │ │
│  │  - getSubmissionById()                       │ │
│  │  - updateSubmission()                        │ │
│  │  - searchSubmissions()                       │ │
│  │  - getPaginatedSubmissions()                 │ │
│  │  - getDashboardStats()                       │ │
│  └────────────────┬──────────────────────────────┘ │
│                   │                                  │
│  ┌────────────────▼──────────────────────────────┐ │
│  │  MongoDB Connection (NEW)                    │ │
│  │  - connectDB()                               │ │
│  │  - disconnectDB()                            │ │
│  │  - isDBConnected()                           │ │
│  └────────────────┬──────────────────────────────┘ │
│                   │                                  │
│  ┌────────────────▼──────────────────────────────┐ │
│  │  Mongoose Models (NEW)                       │ │
│  │  - KYCSubmission Schema                      │ │
│  │  - Indexes & Validation                      │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ MongoDB Wire Protocol
                   │
┌──────────────────▼──────────────────────────────────┐
│    MongoDB Atlas (Cloud)                            │
│    Cluster: cluster0.nybbnjy.mongodb.net            │
│    Database: kyc_database                           │
│    Collection: kyc_submissions                      │
└─────────────────────────────────────────────────────┘
```

---

## File Structure (Backend)

```
backend/
├── src/
│   ├── index.ts                          (Updated)
│   ├── controllers/
│   │   ├── kycController.ts
│   │   └── authController.ts
│   ├── routes/
│   │   ├── kycRoutes.ts
│   │   └── authRoutes.ts
│   ├── services/
│   │   ├── kycService.ts                 (Updated)
│   │   ├── authService.ts
│   │   └── pdfService.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   └── KYCSubmission.ts              (NEW)
│   ├── utils/
│   │   ├── db.ts                         (NEW)
│   │   ├── mongodbService.ts             (NEW)
│   │   ├── fileStorage.ts                (Deprecated)
│   │   └── types.ts
│   └── data/
│       └── kyc-submissions.json          (Deprecated)
├── .env                                  (Updated)
├── package.json                          (Updated)
└── tsconfig.json
```

---

## New Files Created

### 1. `backend/src/utils/db.ts`
**Purpose:** MongoDB connection management

```typescript
export async function connectDB(): Promise<void>
export async function disconnectDB(): Promise<void>
export function isDBConnected(): boolean
```

**Responsibilities:**
- Establishes connection to MongoDB Atlas
- Handles connection errors gracefully
- Provides connection status
- Manages graceful shutdown

---

### 2. `backend/src/models/KYCSubmission.ts`
**Purpose:** Mongoose schema and model definition

**Schema Features:**
- Embedded form data document
- Status enumeration
- Automatic timestamps
- Multiple indexes for performance
- Required field validation

**Indexes:**
```typescript
- id (unique, indexed)
- data.email
- data.firstName + data.lastName
- status + createdAt
```

---

### 3. `backend/src/utils/mongodbService.ts`
**Purpose:** MongoDB CRUD operations

**Operations:**
- `saveSubmission()` - Insert new document
- `readAllSubmissions()` - Fetch all (sorted)
- `getSubmissionById()` - Fetch single
- `updateSubmission()` - Update fields
- `deleteSubmission()` - Remove document
- `searchSubmissions()` - Text search
- `getSubmissionsByStatus()` - Filter
- `getPaginatedSubmissions()` - Pagination
- `getDashboardStats()` - Aggregation

All operations use `.lean()` for better performance (returns plain objects).

---

## Updated Files

### 1. `backend/src/index.ts`

**Changes:**
```typescript
// Old
import { initializeDataStore } from './utils/fileStorage.js';

// New
import { connectDB, disconnectDB } from './utils/db.js';

// Old
await initializeDataStore();

// New
await connectDB();
```

**Shutdown handlers updated:**
```typescript
process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});
```

---

### 2. `backend/src/services/kycService.ts`

**Changes:**
```typescript
// Old imports
import {
  saveSubmission,
  getSubmissionById,
  readAllSubmissions,
} from '../utils/fileStorage.js';

// New imports
import {
  saveSubmission,
  getSubmissionById,
  updateSubmission,
  searchSubmissions,
  getPaginatedSubmissions,
  getDashboardStats,
} from '../utils/mongodbService.js';
```

**All methods still have same signature:**
```typescript
- submitKYC()           -> MongoDB insert
- getSubmission()       -> MongoDB findOne
- getAllSubmissions()   -> MongoDB paginated find
- getDashboardStats()   -> MongoDB aggregation
- updateSubmissionStatus() -> MongoDB update
- addSummary()         -> MongoDB update
- searchSubmissions()   -> MongoDB regex search
```

---

### 3. `backend/.env`

**Added:**
```env
# MongoDB Atlas Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=kyc_database
```

**Note:** Password special characters are URL-encoded
- Original: `@123456789`
- Encoded: `%40123456789`

---

### 4. `backend/package.json`

**Added Dependency:**
```json
{
  "dependencies": {
    "mongoose": "^8.19.3"
  }
}
```

---

## Data Migration

### Before (File Storage)
```
backend/
  data/
    kyc-submissions.json
```

File format:
```json
{
  "submissions": [
    {
      "id": "KYC-ABC123",
      "data": { ... },
      "status": "submitted"
    }
  ]
}
```

### After (MongoDB)
```
MongoDB Atlas
  Database: kyc_database
    Collection: kyc_submissions
      Documents: {...}
```

**No manual migration needed:**
- Old file storage still works
- New MongoDB operations run in parallel if needed
- Can remove file storage operations once verified

---

## API Response Format (Unchanged)

All API responses remain the same:

```json
{
  "success": true,
  "status": 201,
  "message": "KYC submitted successfully",
  "data": {
    "id": "KYC-ABC123",
    "status": "submitted",
    "message": "Your KYC information has been received",
    "timestamp": "2025-01-15T10:30:00.000Z"
  },
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Performance Improvements

### Queries with Indexes

**Fast submission lookup:**
```typescript
// Uses index on 'id'
await KYCSubmissionModel.findOne({ id: 'KYC-ABC123' })
```

**Fast email search:**
```typescript
// Uses index on 'data.email'
await KYCSubmissionModel.findOne({ 'data.email': email })
```

**Fast pagination:**
```typescript
// Uses indexes on status and createdAt
await KYCSubmissionModel
  .find({ status: 'submitted' })
  .sort({ createdAt: -1 })
  .skip(20)
  .limit(10)
```

---

## Error Handling

### Connection Errors
```typescript
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}
```

### Query Errors
```typescript
try {
  const doc = await KYCSubmissionModel.findOne({ id });
  return doc || null;
} catch (error) {
  console.error('Error getting submission by ID:', error);
  throw error;
}
```

### Graceful Shutdown
```typescript
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await disconnectDB();
  process.exit(0);
});
```

---

## Environment Variables

**Required:**
- `MONGODB_URI` - Connection string to MongoDB Atlas
- `MONGODB_DB_NAME` - Database name (default: kyc_database)

**Optional:**
- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - CORS origin (default: http://localhost:5173)
- `NODE_ENV` - Environment (default: development)

---

## Testing Checklist

- [x] MongoDB connects on startup
- [x] KYC submissions save to MongoDB
- [x] Submissions retrieve from MongoDB
- [x] Status updates work in MongoDB
- [x] Search queries work properly
- [x] Pagination works correctly
- [x] Dashboard stats calculate accurately
- [x] Server gracefully disconnects from MongoDB

---

## Rollback (if needed)

If you need to go back to file storage:

1. Revert imports in `kycService.ts`
2. Remove MongoDB connection from `index.ts`
3. Use old `fileStorage.ts` functions
4. Data remains in MongoDB (not deleted)

---

## Next Phase

**LLM Integration Tasks:**
1. Install LLM client library
2. Create summary generation service
3. Call LLM on KYC submission
4. Store summary in MongoDB
5. Display summary in admin dashboard

---

**Technical Stack Summary:**
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB Atlas (Cloud)
- **ORM:** Mongoose
- **Frontend:** React + Vite
- **Authentication:** JWT
- **Validation:** Express Validator
- **Security:** Helmet + CORS

