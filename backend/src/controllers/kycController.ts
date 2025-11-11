import type { Request, Response, NextFunction } from 'express';
import { KYCService } from '../services/kycService.js';
import { generateCustomerPDF } from '../services/pdfService.js';
import type { KYCFormData, ApiResponse, SubmissionResponse } from '../utils/types.js';

/**
 * Submit KYC form data
 */
export async function submitKYC(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const formData = req.body as KYCFormData;

    const submission = await KYCService.submitKYC(formData);

    const response: ApiResponse<SubmissionResponse> = {
      success: true,
      status: 201,
      message: 'KYC submitted successfully',
      data: {
        id: submission.id,
        status: submission.status,
        message: 'Your KYC information has been received',
        timestamp: submission.timestamp,
      },
      timestamp: new Date().toISOString(),
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * Get submission by ID
 */
export async function getSubmission(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const submission = await KYCService.getSubmission(id);

    if (!submission) {
      const error = new Error('Submission not found');
      (error as any).status = 404;
      throw error;
    }

    const response: ApiResponse<SubmissionResponse> = {
      success: true,
      status: 200,
      message: 'Submission retrieved successfully',
      data: {
        id: submission.id,
        status: submission.status,
        message: `Submission status: ${submission.status}`,
        timestamp: submission.timestamp,
        data: submission.data,
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all submissions (for admin)
 */
export async function getAllSubmissions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number.parseInt(req.query.page as string) || 1;
    const limit = Number.parseInt(req.query.limit as string) || 10;

    const result = await KYCService.getAllSubmissions(page, limit);

    const response: ApiResponse<typeof result> = {
      success: true,
      status: 200,
      message: 'Submissions retrieved successfully',
      data: result,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const stats = await KYCService.getDashboardStats();

    const response: ApiResponse<typeof stats> = {
      success: true,
      status: 200,
      message: 'Dashboard statistics retrieved successfully',
      data: stats,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * Search submissions
 */
export async function searchSubmissions(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query.q as string;

    if (!query) {
      const error = new Error('Search query is required');
      (error as any).status = 400;
      throw error;
    }

    const submissions = await KYCService.searchSubmissions(query);

    const response: ApiResponse<{
      count: number;
      results: typeof submissions;
    }> = {
      success: true,
      status: 200,
      message: 'Search completed successfully',
      data: {
        count: submissions.length,
        results: submissions,
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * Export customer as PDF (admin only)
 */
export async function exportCustomerPDF(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const submission = await KYCService.getSubmission(id);

    if (!submission) {
      const error = new Error('Customer not found');
      (error as any).status = 404;
      throw error;
    }

    const customerData = {
      id: submission.id,
      firstName: submission.data?.firstName || '',
      lastName: submission.data?.lastName || '',
      email: submission.data?.email || '',
      phone: submission.data?.phone || '',
      dateOfBirth: submission.data?.dateOfBirth || '',
      nationality: submission.data?.nationality || '',
      address: submission.data?.address || '',
      city: submission.data?.city || '',
      createdAt: submission.timestamp,
    };

    const pdfStream = generateCustomerPDF(customerData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="customer-${customerData.firstName}-${customerData.lastName}.pdf"`
    );

    pdfStream.pipe(res);
  } catch (error) {
    next(error);
  }
}
