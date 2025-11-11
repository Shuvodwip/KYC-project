import { v4 as uuidv4 } from 'uuid';
import {
  saveSubmission,
  getSubmissionById,
  readAllSubmissions,
} from '../utils/fileStorage.js';
import type { KYCFormData, KYCSubmission } from '../utils/types.js';

export class KYCService {
  /**
   * Submit KYC data
   */
  static async submitKYC(formData: KYCFormData): Promise<KYCSubmission> {
    const id = `KYC-${uuidv4().substring(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();

    const submission: KYCSubmission = {
      id,
      data: formData,
      timestamp: now,
      status: 'submitted',
      createdAt: now,
      updatedAt: now,
    };

    await saveSubmission(submission);
    return submission;
  }

  /**
   * Get submission by ID
   */
  static async getSubmission(id: string): Promise<KYCSubmission | null> {
    return await getSubmissionById(id);
  }

  /**
   * Get all submissions (with pagination)
   */
  static async getAllSubmissions(page = 1, limit = 10): Promise<{
    submissions: KYCSubmission[];
    total: number;
    page: number;
    pages: number;
  }> {
    const allSubmissions = await readAllSubmissions();
    const total = allSubmissions.length;
    const pages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const recentSubmissions = allSubmissions.toReversed();
    const submissions = recentSubmissions.slice(start, start + limit);

    return {
      submissions,
      total,
      page,
      pages,
    };
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<{
    totalSubmissions: number;
    submittedCount: number;
    processingCount: number;
    approvedCount: number;
    rejectedCount: number;
  }> {
    const submissions = await readAllSubmissions();

    return {
      totalSubmissions: submissions.length,
      submittedCount: submissions.filter((s) => s.status === 'submitted').length,
      processingCount: submissions.filter(
        (s) => s.status === 'processing'
      ).length,
      approvedCount: submissions.filter((s) => s.status === 'approved').length,
      rejectedCount: submissions.filter((s) => s.status === 'rejected').length,
    };
  }

  /**
   * Update submission status
   */
  static async updateSubmissionStatus(
    id: string,
    status: 'submitted' | 'processing' | 'approved' | 'rejected'
  ): Promise<KYCSubmission | null> {
    const submissions = await readAllSubmissions();
    const index = submissions.findIndex((s) => s.id === id);

    if (index === -1) {
      return null;
    }

    submissions[index].status = status;
    submissions[index].updatedAt = new Date().toISOString();

    // Update the submissions file
    const { promises: fs } = await import('node:fs');
    const { join } = await import('node:path');
    const DATA_DIR = process.env.DATA_DIR || './data';
    const KYC_FILE = join(DATA_DIR, 'kyc-submissions.json');

    await fs.writeFile(
      KYC_FILE,
      JSON.stringify({ submissions }, null, 2)
    );

    return submissions[index];
  }

  /**
   * Add AI summary to submission
   */
  static async addSummary(id: string, summary: string): Promise<KYCSubmission | null> {
    const submissions = await readAllSubmissions();
    const index = submissions.findIndex((s) => s.id === id);

    if (index === -1) {
      return null;
    }

    submissions[index].summary = summary;
    submissions[index].updatedAt = new Date().toISOString();

    // Update the submissions file
    const { promises: fs } = await import('node:fs');
    const { join } = await import('node:path');
    const DATA_DIR = process.env.DATA_DIR || './data';
    const KYC_FILE = join(DATA_DIR, 'kyc-submissions.json');

    await fs.writeFile(
      KYC_FILE,
      JSON.stringify({ submissions }, null, 2)
    );

    return submissions[index];
  }

  /**
   * Search submissions
   */
  static async searchSubmissions(query: string): Promise<KYCSubmission[]> {
    const submissions = await readAllSubmissions();
    const lowerQuery = query.toLowerCase();

    return submissions.filter(
      (sub) =>
        sub.data.firstName.toLowerCase().includes(lowerQuery) ||
        sub.data.lastName.toLowerCase().includes(lowerQuery) ||
        sub.data.email.toLowerCase().includes(lowerQuery) ||
        sub.data.phone.includes(query) ||
        sub.id.includes(query.toUpperCase())
    );
  }
}
