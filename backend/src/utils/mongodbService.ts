import { KYCSubmissionModel } from '../models/KYCSubmission.js';
import type { KYCSubmission } from './types.js';

/**
 * Save a new KYC submission to MongoDB
 */
export async function saveSubmission(submission: KYCSubmission): Promise<void> {
  try {
    const newSubmission = new KYCSubmissionModel(submission);
    await newSubmission.save();
  } catch (error) {
    console.error('Error saving submission to MongoDB:', error);
    throw error;
  }
}

/**
 * Read all KYC submissions from MongoDB
 */
export async function readAllSubmissions(): Promise<KYCSubmission[]> {
  try {
    const submissions = await KYCSubmissionModel.find()
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    return submissions as unknown as KYCSubmission[];
  } catch (error) {
    console.error('Error reading submissions from MongoDB:', error);
    throw error;
  }
}

/**
 * Get a single submission by ID
 */
export async function getSubmissionById(id: string): Promise<KYCSubmission | null> {
  try {
    const submission = await KYCSubmissionModel.findOne({ id })
      .lean()
      .exec();

    return (submission as unknown as KYCSubmission) || null;
  } catch (error) {
    console.error('Error getting submission by ID:', error);
    throw error;
  }
}

/**
 * Get submission count
 */
export async function getSubmissionCount(): Promise<number> {
  try {
    const count = await KYCSubmissionModel.countDocuments();
    return count;
  } catch (error) {
    console.error('Error counting submissions:', error);
    throw error;
  }
}

/**
 * Update a submission in MongoDB
 */
export async function updateSubmission(
  id: string,
  updateData: Partial<KYCSubmission>
): Promise<KYCSubmission | null> {
  try {
    const updated = await KYCSubmissionModel.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date().toISOString() },
      { new: true }
    )
      .lean()
      .exec();

    return (updated as unknown as KYCSubmission) || null;
  } catch (error) {
    console.error('Error updating submission:', error);
    throw error;
  }
}

/**
 * Delete a submission from MongoDB
 */
export async function deleteSubmission(id: string): Promise<boolean> {
  try {
    const result = await KYCSubmissionModel.deleteOne({ id });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting submission:', error);
    throw error;
  }
}

/**
 * Search submissions by query
 */
export async function searchSubmissions(query: string): Promise<KYCSubmission[]> {
  try {
    const submissions = await KYCSubmissionModel.find({
      $or: [
        { 'data.firstName': { $regex: query, $options: 'i' } },
        { 'data.lastName': { $regex: query, $options: 'i' } },
        { 'data.email': { $regex: query, $options: 'i' } },
        { 'data.phone': { $regex: query, $options: 'i' } },
        { 'data.documentId': { $regex: query, $options: 'i' } },
        { id: { $regex: query, $options: 'i' } },
      ],
    })
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    return submissions as unknown as KYCSubmission[];
  } catch (error) {
    console.error('Error searching submissions:', error);
    throw error;
  }
}

/**
 * Get submissions by status
 */
export async function getSubmissionsByStatus(
  status: 'submitted' | 'processing' | 'approved' | 'rejected'
): Promise<KYCSubmission[]> {
  try {
    const submissions = await KYCSubmissionModel.find({ status })
      .lean()
      .sort({ createdAt: -1 })
      .exec();

    return submissions as unknown as KYCSubmission[];
  } catch (error) {
    console.error('Error getting submissions by status:', error);
    throw error;
  }
}

/**
 * Get paginated submissions
 */
export async function getPaginatedSubmissions(
  page: number = 1,
  limit: number = 10
): Promise<{
  submissions: KYCSubmission[];
  total: number;
  page: number;
  pages: number;
}> {
  try {
    const skip = (page - 1) * limit;
    const total = await KYCSubmissionModel.countDocuments();
    const pages = Math.ceil(total / limit);

    const submissions = await KYCSubmissionModel.find()
      .lean()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return {
      submissions: submissions as unknown as KYCSubmission[],
      total,
      page,
      pages,
    };
  } catch (error) {
    console.error('Error getting paginated submissions:', error);
    throw error;
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<{
  totalSubmissions: number;
  submittedCount: number;
  processingCount: number;
  approvedCount: number;
  rejectedCount: number;
}> {
  try {
    const [totalSubmissions, submitted, processing, approved, rejected] = await Promise.all([
      KYCSubmissionModel.countDocuments(),
      KYCSubmissionModel.countDocuments({ status: 'submitted' }),
      KYCSubmissionModel.countDocuments({ status: 'processing' }),
      KYCSubmissionModel.countDocuments({ status: 'approved' }),
      KYCSubmissionModel.countDocuments({ status: 'rejected' }),
    ]);

    return {
      totalSubmissions,
      submittedCount: submitted,
      processingCount: processing,
      approvedCount: approved,
      rejectedCount: rejected,
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
}
