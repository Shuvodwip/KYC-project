import type { Router } from 'express';
import { Router as ExpressRouter } from 'express';
import {
  submitKYC,
  getSubmission,
  getAllSubmissions,
  getDashboardStats,
  searchSubmissions,
  exportCustomerPDF,
  emailCustomerPDF,
  generateSummaryForSubmission,
  getSubmissionWithSummary,
  approveCustomer,
  rejectCustomer,
  deleteCustomer,
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

// GET /api/kyc/summary/:id - Get submission with summary
router.get('/summary/:id', getSubmissionWithSummary);

// POST /api/kyc/generate-summary/:id - Generate summary for submission (admin)
router.post('/generate-summary/:id', verifyToken, generateSummaryForSubmission);

// GET /api/kyc/all - Get all submissions (admin)
router.get('/all', verifyToken, getAllSubmissions);

// GET /api/kyc/stats - Get dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/kyc/search - Search submissions
router.get('/search', searchSubmissions);

// GET /api/kyc/export/:id - Export customer PDF (admin download)
router.get('/export/:id', verifyToken, exportCustomerPDF);

// POST /api/kyc/export/:id/email - Queue PDF email to customer
router.post('/export/:id/email', verifyToken, emailCustomerPDF);

// PUT /api/kyc/approve/:id - Approve customer (admin)
router.put('/approve/:id', verifyToken, approveCustomer);

// PUT /api/kyc/reject/:id - Reject customer (admin)
router.put('/reject/:id', verifyToken, rejectCustomer);

// DELETE /api/kyc/delete/:id - Delete customer (admin)
router.delete('/delete/:id', verifyToken, deleteCustomer);

export default router;

