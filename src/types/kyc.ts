// KYC Form Data Type
export interface KYCFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  gender: "male" | "female" | "other";

  // Address Information
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  // Document Information
  documentType: "passport" | "driverLicense" | "idCard" | "nationalId";
  documentId: string;
  documentIssueDate: string;
  documentExpiryDate: string;

  // Additional Information
  employmentStatus: "employed" | "self-employed" | "unemployed" | "retired";
  industry?: string;
  sourceOfFunds: "salary" | "business" | "investments" | "savings" | "other";
}

// API Response Type
export interface KYCSubmissionResponse {
  id: string;
  timestamp: string;
  status: "success" | "error";
  message: string;
  data?: KYCFormData;
}

// Form Step Type
export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: string[];
}
