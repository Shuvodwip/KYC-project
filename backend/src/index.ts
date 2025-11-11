import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { initializeDataStore } from './utils/fileStorage.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import kycRoutes from './routes/kycRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// Middleware
// ============================================================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// Routes
// ============================================================================

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/kyc', kycRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req: express.Request, res: express.Response) => {
  res.json({
    message: 'KYC Data Management System - Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /health',
      submit: 'POST /api/kyc/submit',
      status: 'GET /api/kyc/status/:id',
      all: 'GET /api/kyc/all (requires auth)',
      stats: 'GET /api/kyc/stats',
      search: 'GET /api/kyc/search',
      export: 'GET /api/kyc/export/:id (requires auth)',
      login: 'POST /api/auth/login',
      verify: 'GET /api/auth/verify (requires auth)',
    },
  });
});

// ============================================================================
// Error Handling
// ============================================================================

app.use(notFound);
app.use(errorHandler);

// ============================================================================
// Server Initialization
// ============================================================================

async function startServer() {
  try {
    // Initialize data store
    await initializeDataStore();
    console.log('✓ Data store initialized');

    // Start server
    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🚀 KYC Backend Server Running`);
      console.log(`${'='.repeat(60)}`);
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🌐 CORS Origin: ${FRONTEND_URL}`);
      console.log(`📁 Data Directory: ${process.env.DATA_DIR || './data'}`);
      console.log(`${'='.repeat(60)}\n`);

      console.log('Endpoints:');
      console.log(`  ✓ POST   /api/kyc/submit        - Submit KYC data`);
      console.log(`  ✓ GET    /api/kyc/status/:id    - Get submission status`);
      console.log(`  ✓ GET    /api/kyc/all           - Get all submissions`);
      console.log(`  ✓ GET    /api/kyc/stats         - Get statistics`);
      console.log(`  ✓ GET    /api/kyc/search        - Search submissions`);
      console.log(`  ✓ GET    /health                - Health check`);
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\nSIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
await startServer();

export default app;
