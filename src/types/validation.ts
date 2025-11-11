import { z } from "zod";

export const kycValidationSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),
  
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),
  
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email cannot exceed 100 characters"),
  
  phone: z
    .string()
    .regex(/^[\d\s()+-]{10,15}$/, "Invalid phone number format"),
  
  dateOfBirth: z
    .string()
    .nonempty("Date of birth is required")
    .refine(
      (date: string) => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18;
      },
      "You must be at least 18 years old"
    ),
  
  nationality: z
    .string()
    .min(2, "Nationality must be at least 2 characters")
    .max(50, "Nationality cannot exceed 50 characters"),
  
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Please select a valid gender" }),
  }),

  // Address Information
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address cannot exceed 100 characters"),
  
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City cannot exceed 50 characters"),
  
  state: z
    .string()
    .min(2, "State/Province must be at least 2 characters")
    .max(50, "State/Province cannot exceed 50 characters"),
  
  postalCode: z
    .string()
    .regex(/^[0-9A-Za-z\s-]{3,10}$/, "Invalid postal code format"),
  
  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country cannot exceed 50 characters"),

  // Document Information
  documentType: z.enum(["passport", "driverLicense", "idCard", "nationalId"], {
    errorMap: () => ({ message: "Please select a valid document type" }),
  }),
  
  documentId: z
    .string()
    .min(5, "Document ID must be at least 5 characters")
    .max(50, "Document ID cannot exceed 50 characters"),
  
  documentIssueDate: z
    .string()
    .nonempty("Document issue date is required"),
  
  documentExpiryDate: z
    .string()
    .nonempty("Document expiry date is required")
    .refine(
      (date: string) => new Date(date) > new Date(),
      "Document must not be expired"
    ),

  // Additional Information
  employmentStatus: z.enum(["employed", "self-employed", "unemployed", "retired"], {
    errorMap: () => ({ message: "Please select a valid employment status" }),
  }),
  
  industry: z
    .string()
    .optional()
    .refine((value: string | undefined) => !value || value.length >= 2, "Industry must be at least 2 characters if provided"),
  
  sourceOfFunds: z.enum(["salary", "business", "investments", "savings", "other"], {
    errorMap: () => ({ message: "Please select a valid source of funds" }),
  }),
});

export type KYCValidationSchemaType = z.infer<typeof kycValidationSchema>;
