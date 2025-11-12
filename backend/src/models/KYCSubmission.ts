import mongoose from 'mongoose';

// KYC Form Data embedded schema
const kycFormDataSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    nationality: { type: String, required: true },
    gender: { type: String, required: false },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: false },
    postalCode: { type: String, required: false },
    country: { type: String, required: false },
    documentType: { type: String, required: false },
    documentId: { type: String, required: false },
    documentIssueDate: { type: String, required: false },
    documentExpiryDate: { type: String, required: false },
    employmentStatus: { type: String, required: false },
    industry: { type: String, required: false },
    sourceOfFunds: { type: String, required: false },
  },
  { _id: false }
);

// KYC Submission main schema
const kycSubmissionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    data: { type: kycFormDataSchema, required: true },
    timestamp: { type: String, required: true },
    status: {
      type: String,
      enum: ['submitted', 'processing', 'approved', 'rejected'],
      default: 'submitted',
      index: true,
    },
    summary: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: 'kyc_submissions',
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

// Create indexes for better query performance
kycSubmissionSchema.index({ 'data.email': 1 });
kycSubmissionSchema.index({ 'data.firstName': 1, 'data.lastName': 1 });
kycSubmissionSchema.index({ status: 1, createdAt: -1 });

// Export the model
export const KYCSubmissionModel = mongoose.model(
  'KYCSubmission',
  kycSubmissionSchema
);

// Also export the schema
export { kycSubmissionSchema };
