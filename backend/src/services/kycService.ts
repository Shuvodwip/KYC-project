import { v4 as uuidv4 } from 'uuid';
import {
  saveSubmission,
  getSubmissionById,
  updateSubmission,
  searchSubmissions,
  getPaginatedSubmissions,
  getDashboardStats,
  deleteSubmission,
} from '../utils/mongodbService.js';
import { generateKYCSummary } from './llmService.js';
import type { KYCFormData, KYCSubmission } from '../utils/types.js';

export class KYCService {
  /**
   * Submit KYC data and generate summary asynchronously
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

    // Generate summary asynchronously (don't wait for it)
    this.generateAndStoreSummary(id, formData).catch((error) => {
      console.error(`Failed to generate summary for ${id}:`, error);
    });

    return submission;
  }

  /**
   * Generate and store summary for a submission
   */
  private static async generateAndStoreSummary(
    submissionId: string,
    data: KYCFormData
  ): Promise<void> {
    try {
      console.log(`[LLM] Generating summary for submission ${submissionId}...`);
      const summary = await generateKYCSummary(data);
      
      console.log(`[LLM] Summary generated: ${summary}`);
      await this.addSummary(submissionId, summary);
      
      console.log(`[LLM] Summary stored for submission ${submissionId}`);
    } catch (error) {
      console.error(`[LLM] Error generating summary for ${submissionId}:`, error);
    }
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
  static async getAllSubmissions(
    page = 1,
    limit = 10
  ): Promise<{
    submissions: KYCSubmission[];
    total: number;
    page: number;
    pages: number;
  }> {
    return await getPaginatedSubmissions(page, limit);
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
    return await getDashboardStats();
  }

  /**
   * Update submission status
   */
  static async updateSubmissionStatus(
    id: string,
    status: 'submitted' | 'processing' | 'approved' | 'rejected'
  ): Promise<KYCSubmission | null> {
    return await updateSubmission(id, { status, updatedAt: new Date().toISOString() });
  }

  /**
   * Add AI summary to submission
   */
  static async addSummary(id: string, summary: string): Promise<KYCSubmission | null> {
    return await updateSubmission(id, {
      summary,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Delete submission
   */
  static async deleteSubmission(id: string): Promise<boolean> {
    return await deleteSubmission(id);
  }

  /**
   * Search submissions
   */
  static async searchSubmissions(query: string): Promise<KYCSubmission[]> {
    return await searchSubmissions(query);
  }
}
