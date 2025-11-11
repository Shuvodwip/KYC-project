import type { Router } from 'express';
import { Router as ExpressRouter } from 'express';
import {
  submitKYC,
  getSubmission,
  getAllSubmissions,
  getDashboardStats,
  searchSubmissions,
  exportCustomerPDF,
} from '../controllers/kycController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = ExpressRouter() as Router;

/**
 * KYC Submission Routes
 */

// POST /api/kyc/submit - Submit KYC form
router.post('/submit', submitKYC);

// GET /api/kyc/status/:id - Get submission status
router.get('/status/:id', getSubmission);

// GET /api/kyc/all - Get all submissions (admin)
router.get('/all', verifyToken, getAllSubmissions);

// GET /api/kyc/stats - Get dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/kyc/search - Search submissions
router.get('/search', searchSubmissions);

// GET /api/kyc/export/:id - Export customer PDF (admin)
router.get('/export/:id', verifyToken, exportCustomerPDF);

export default router;
