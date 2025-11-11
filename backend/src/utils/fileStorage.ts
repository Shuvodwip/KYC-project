import { promises as fs } from 'fs';
import { join } from 'path';
import type { KYCSubmission } from './types.js';

const DATA_DIR = process.env.DATA_DIR || './data';
const KYC_FILE = join(DATA_DIR, 'kyc-submissions.json');

// Ensure data directory and file exist
export async function initializeDataStore(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    try {
      await fs.access(KYC_FILE);
    } catch {
      // File doesn't exist, create it
      await fs.writeFile(KYC_FILE, JSON.stringify({ submissions: [] }, null, 2));
    }
  } catch (error) {
    console.error('Error initializing data store:', error);
    throw error;
  }
}

// Read all KYC submissions
export async function readAllSubmissions(): Promise<KYCSubmission[]> {
  try {
    const content = await fs.readFile(KYC_FILE, 'utf-8');
    const data = JSON.parse(content);
    return data.submissions || [];
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
}

// Save KYC submission
export async function saveSubmission(submission: KYCSubmission): Promise<void> {
  try {
    const submissions = await readAllSubmissions();
    submissions.push(submission);
    
    const data = { submissions };
    await fs.writeFile(KYC_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving submission:', error);
    throw error;
  }
}

// Get submission by ID
export async function getSubmissionById(id: string): Promise<KYCSubmission | null> {
  try {
    const submissions = await readAllSubmissions();
    return submissions.find(sub => sub.id === id) || null;
  } catch (error) {
    console.error('Error getting submission:', error);
    return null;
  }
}

// Get submission count
export async function getSubmissionCount(): Promise<number> {
  try {
    const submissions = await readAllSubmissions();
    return submissions.length;
  } catch (error) {
    console.error('Error counting submissions:', error);
    return 0;
  }
}
