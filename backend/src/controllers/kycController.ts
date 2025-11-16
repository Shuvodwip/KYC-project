import type { Request, Response, NextFunction } from 'express';
import { KYCService } from '../services/kycService.js';
import { generateCustomerPDF } from '../services/pdfService.js';
import { generateKYCSummary } from '../services/llmService.js';
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
      summary: submission.summary || undefined,
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

/**
 * Generate summary for a specific submission
 */
export async function generateSummaryForSubmission(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    // Get the submission
    const submission = await KYCService.getSubmission(id);
    if (!submission) {
      const error = new Error('Submission not found');
      (error as any).status = 404;
      throw error;
    }

    // Generate summary
    const summary = await generateKYCSummary(submission.data);

    // Store summary
    await KYCService.addSummary(id, summary);

    const response: ApiResponse<{ id: string; summary: string }> = {
      success: true,
      status: 200,
      message: 'Summary generated successfully',
      data: {
        id,
        summary,
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * Get submission with summary
 */
export async function getSubmissionWithSummary(
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

    const response: ApiResponse<any> = {
      success: true,
      status: 200,
      message: 'Submission retrieved successfully',
      data: {
        id: submission.id,
        status: submission.status,
        summary: submission.summary || 'Summary pending...',
        customerName: `${submission.data.firstName} ${submission.data.lastName}`,
        email: submission.data.email,
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
 * Approve a customer submission
 */
export async function approveCustomer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const submission = await KYCService.updateSubmissionStatus(id, 'approved');

    if (!submission) {
      const error = new Error('Submission not found');
      (error as any).status = 404;
      throw error;
    }

    const response: ApiResponse<any> = {
      success: true,
      status: 200,
      message: 'Customer approved successfully',
      data: {
        id: submission.id,
        status: submission.status,
        customerName: `${submission.data.firstName} ${submission.data.lastName}`,
        email: submission.data.email,
        summary: submission.summary,
        timestamp: submission.timestamp,
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * Reject a customer submission
 */
export async function rejectCustomer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const submission = await KYCService.updateSubmissionStatus(id, 'rejected');

    if (!submission) {
      const error = new Error('Submission not found');
      (error as any).status = 404;
      throw error;
    }

    const response: ApiResponse<any> = {
      success: true,
      status: 200,
      message: 'Customer rejected successfully',
      data: {
        id: submission.id,
        status: submission.status,
        customerName: `${submission.data.firstName} ${submission.data.lastName}`,
        email: submission.data.email,
        summary: submission.summary,
        timestamp: submission.timestamp,
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a customer submission
 */
export async function deleteCustomer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    const deleted = await KYCService.deleteSubmission(id);

    if (!deleted) {
      const error = new Error('Submission not found');
      (error as any).status = 404;
      throw error;
    }

    const response: ApiResponse<{ id: string }> = {
      success: true,
      status: 200,
      message: 'Customer deleted successfully',
      data: {
        id,
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

