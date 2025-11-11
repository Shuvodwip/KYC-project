// KYC Submission Data
export interface KYCFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  documentType: string;
  documentId: string;
  documentIssueDate: string;
  documentExpiryDate: string;
  employmentStatus: string;
  industry?: string;
  sourceOfFunds: string;
}

// KYC Submission stored in database
export interface KYCSubmission {
  id: string;
  data: KYCFormData;
  timestamp: string;
  status: 'submitted' | 'processing' | 'approved' | 'rejected';
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// Submission Response
export interface SubmissionResponse {
  id: string;
  status: string;
  message: string;
  timestamp: string;
  data?: KYCFormData;
}
