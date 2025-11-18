import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JSX } from "react";
import { kycValidationSchema } from "../types/validation";
import { kycAPI } from "../services/api";
import "../styles/CustomerForm.css";

type FormDataType = typeof kycValidationSchema._type;

interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: (keyof FormDataType)[];
}

const FORM_STEPS: FormStep[] = [
  {
    id: "personal",
    title: "Personal Information",
    description: "Let's start with your basic information",
    fields: [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dateOfBirth",
      "nationality",
      "gender",
    ],
  },
  {
    id: "address",
    title: "Address Information",
    description: "Where do you live?",
    fields: ["address", "city", "state", "postalCode", "country"],
  },
  {
    id: "document",
    title: "Document Information",
    description: "Please provide your identification details",
    fields: [
      "documentType",
      "documentId",
      "documentIssueDate",
      "documentExpiryDate",
    ],
  },
  {
    id: "employment",
    title: "Employment & Source of Funds",
    description: "Tell us about your employment status",
    fields: ["employmentStatus", "industry", "sourceOfFunds"],
  },
];

function getFieldLabel(fieldName: keyof FormDataType): string {
  const labelMap: Record<keyof FormDataType, string> = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone Number",
    dateOfBirth: "Date of Birth",
    nationality: "Nationality",
    gender: "Gender",
    address: "Street Address",
    city: "City",
    state: "State/Province",
    postalCode: "Postal Code",
    country: "Country",
    documentType: "Document Type",
    documentId: "Document ID",
    documentIssueDate: "Document Issue Date",
    documentExpiryDate: "Document Expiry Date",
    employmentStatus: "Employment Status",
    industry: "Industry",
    sourceOfFunds: "Source of Funds",
  };
  return labelMap[fieldName];
}

function getSelectOptions(
  fieldName: keyof FormDataType
): { value: string; label: string }[] {
  switch (fieldName) {
    case "gender":
      return [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ];
    case "documentType":
      return [
        { value: "passport", label: "Passport" },
        { value: "driverLicense", label: "Driver License" },
        { value: "idCard", label: "ID Card" },
        { value: "nationalId", label: "National ID" },
      ];
    case "employmentStatus":
      return [
        { value: "employed", label: "Employed" },
        { value: "self-employed", label: "Self-Employed" },
        { value: "unemployed", label: "Unemployed" },
        { value: "retired", label: "Retired" },
      ];
    case "sourceOfFunds":
      return [
        { value: "salary", label: "Salary" },
        { value: "business", label: "Business" },
        { value: "investments", label: "Investments" },
        { value: "savings", label: "Savings" },
        { value: "other", label: "Other" },
      ];
    default:
      return [];
  }
}

function isSelectField(fieldName: keyof FormDataType): boolean {
  return ["gender", "documentType", "employmentStatus", "sourceOfFunds"].includes(
    fieldName
  );
}

function isDateField(fieldName: keyof FormDataType): boolean {
  return ["dateOfBirth", "documentIssueDate", "documentExpiryDate"].includes(
    fieldName
  );
}

function isEmailField(fieldName: keyof FormDataType): boolean {
  return fieldName === "email";
}

function isPhoneField(fieldName: keyof FormDataType): boolean {
  return fieldName === "phone";
}

interface FieldRendererProps {
  fieldName: keyof FormDataType;
  register: ReturnType<typeof useForm<FormDataType>>["register"];
  errors: Record<string, any>;
  isOptional: boolean;
}

function TextInput({
  fieldName,
  register,
  errors,
  isOptional,
  type = "text",
  placeholder = "",
}: FieldRendererProps & { type?: string; placeholder?: string }) {
  const fieldError = errors[fieldName];
  const label = getFieldLabel(fieldName);

  return (
    <div className="form-group">
      <label htmlFor={fieldName}>
        {label}
        {!isOptional && " *"}
      </label>
      <input
        id={fieldName}
        type={type}
        placeholder={placeholder}
        {...register(fieldName)}
        className={`form-input ${fieldError ? "input-error" : ""}`}
      />
      {fieldError && (
        <span className="error-message">{fieldError.message}</span>
      )}
    </div>
  );
}

function SelectInput({
  fieldName,
  register,
  errors,
  isOptional,
}: FieldRendererProps) {
  const fieldError = errors[fieldName];
  const label = getFieldLabel(fieldName);
  const options = getSelectOptions(fieldName);

  return (
    <div className="form-group">
      <label htmlFor={fieldName}>
        {label}
        {!isOptional && " *"}
      </label>
      <select
        id={fieldName}
        {...register(fieldName)}
        className={`form-input form-select ${fieldError ? "input-error" : ""}`}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {fieldError && (
        <span className="error-message">{fieldError.message}</span>
      )}
    </div>
  );
}

function renderField(props: FieldRendererProps): JSX.Element {
  const { fieldName } = props;
  const isOptional = fieldName === "industry";

  if (isSelectField(fieldName)) {
    return (
      <SelectInput {...props} key={fieldName} isOptional={isOptional} />
    );
  }

  if (isDateField(fieldName)) {
    return (
      <TextInput {...props} key={fieldName} type="date" isOptional={isOptional} />
    );
  }

  if (isEmailField(fieldName)) {
    return (
      <TextInput
        {...props}
        key={fieldName}
        type="email"
        placeholder="your@email.com"
        isOptional={isOptional}
      />
    );
  }

  if (isPhoneField(fieldName)) {
    return (
      <TextInput
        {...props}
        key={fieldName}
        type="tel"
        placeholder="+1 (555) 123-4567"
        isOptional={isOptional}
      />
    );
  }

  return (
    <TextInput
      {...props}
      key={fieldName}
      placeholder={`Enter your ${fieldName.toLowerCase()}`}
      isOptional={isOptional}
    />
  );
}

export function CustomerForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<FormDataType>({
    resolver: zodResolver(kycValidationSchema),
    mode: "onBlur",
    defaultValues: {
      gender: "male" as const,
      employmentStatus: "employed" as const,
      sourceOfFunds: "salary" as const,
      documentType: "passport" as const,
    },
  });

  const currentStepData = FORM_STEPS[currentStep];

  const canProceedToNextStep = async (): Promise<boolean> => {
    return await trigger(currentStepData.fields);
  };

  const handleNext = async () => {
    if (await canProceedToNextStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: FormDataType) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await kycAPI.submitKYC(data);
      const id = response.id || "UNKNOWN";
      setSubmissionId(id);
      setSubmitStatus({
        type: "success",
        message: `✓ KYC submitted successfully! Your submission ID: ${id}`,
      });
      // Reset form after successful submission
      setTimeout(() => {
        globalThis.location.reload();
      }, 3000);
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error ? error.message : "Failed to submit KYC data",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastStep = currentStep === FORM_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="kyc-form-container">
      <div className="kyc-form-wrapper">
        {/* Header */}
        <div className="form-header">
          <div className="header-content">
            <h1>KYC Information Form</h1>
            <p className="form-subtitle">
              Complete your customer information
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentStep + 1) / FORM_STEPS.length) * 100}%`,
              }}
            />
          </div>
          <div className="progress-steps">
            {FORM_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`progress-step ${index === currentStep ? "active" : ""} ${index < currentStep ? "completed" : ""}`}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-label">{step.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="kyc-form">
          {/* Current Step */}
          <div className="form-step">
            <div className="step-header">
              <h2>{currentStepData.title}</h2>
              <p>{currentStepData.description}</p>
            </div>

            {/* Form Fields */}
            <div className="form-fields">
              {currentStepData.fields.map((fieldName) =>
                renderField({
                  fieldName,
                  register,
                  errors,
                  isOptional: fieldName === "industry",
                })
              )}
            </div>

            {/* Status Message */}
            {submitStatus.type && currentStep === FORM_STEPS.length - 1 && (
              <div className={`status-message status-${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="form-navigation">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="btn btn-secondary"
            >
              ← Previous
            </button>

            {isLastStep ? (
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="btn btn-primary btn-submit"
              >
                {isSubmitting ? "Submitting..." : "✓ Submit KYC"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                Next →
              </button>
            )}
          </div>

          {/* Step Info */}
          <div className="step-info">
            Step {currentStep + 1} of {FORM_STEPS.length}
          </div>
        </form>

        {/* Submission Success Card */}
        {submissionId && submitStatus.type === "success" && (
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h3>Submission Successful!</h3>
            <p>Your KYC information has been submitted successfully.</p>
            <div className="submission-id">
              <label htmlFor="submission-id">Submission ID:</label>
              <code id="submission-id">{submissionId}</code>
            </div>
            <p className="redirect-message">
              You will be redirected shortly...
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="form-footer">
        <p>
          Your information is secure and encrypted. We never share your data
          without permission.
        </p>
      </div>
    </div>
  );
}
