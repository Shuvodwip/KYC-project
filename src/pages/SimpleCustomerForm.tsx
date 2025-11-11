import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { kycAPI } from "../services/api";
import "../styles/SimpleCustomerForm.css";

// Simple validation schema with 8 essential fields
const simpleKycSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[\d\s()+-]{10,15}$/, "Invalid phone number"),
  dateOfBirth: z.string().refine(
    (date) => {
      const birthDate = new Date(date);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      return age >= 18;
    },
    "You must be at least 18 years old"
  ),
  nationality: z.string().min(2, "Nationality is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
});

type SimpleFormData = z.infer<typeof simpleKycSchema>;

interface SuccessCardProps {
  submissionId: string;
  onClose: () => void;
}

const SuccessCard: React.FC<SuccessCardProps> = ({ submissionId, onClose }) => (
  <div className="success-overlay">
    <div className="success-card">
      <div className="success-icon">✅</div>
      <h2>Submission Successful!</h2>
      <p>Your information has been received and is being processed.</p>
      <div className="submission-id">
        <label>Submission ID:</label>
        <code>{submissionId}</code>
      </div>
      <button className="success-btn" onClick={onClose}>
        Submit Another
      </button>
    </div>
  </div>
);

export function SimpleCustomerForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SimpleFormData>({
    resolver: zodResolver(simpleKycSchema),
  });

  const onSubmit = async (data: SimpleFormData) => {
    setIsSubmitting(true);
    try {
      const response = await kycAPI.submitKYC(data as any);
      // Extract submission ID from response (might be nested differently)
      const id = (response.data as any)?.id || (response as any)?.id;
      if (id) {
        setSubmissionId(id);
      } else {
        alert("Submission received but no ID returned");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccess = () => {
    setSubmissionId(null);
    reset();
  };

  if (submissionId) {
    return <SuccessCard submissionId={submissionId} onClose={handleSuccess} />;
  }

  return (
    <div className="simple-form-container">
      <div className="form-header">
        <h1>Customer Information Form</h1>
        <p>Please provide your basic information (8 fields)</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="simple-form">
        {/* Row 1: First Name & Last Name */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name *</label>
            <input
              id="firstName"
              type="text"
              placeholder="John"
              {...register("firstName")}
              className={errors.firstName ? "input-error" : ""}
            />
            {errors.firstName && (
              <span className="error-message">{errors.firstName.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name *</label>
            <input
              id="lastName"
              type="text"
              placeholder="Doe"
              {...register("lastName")}
              className={errors.lastName ? "input-error" : ""}
            />
            {errors.lastName && (
              <span className="error-message">{errors.lastName.message}</span>
            )}
          </div>
        </div>

        {/* Row 2: Email & Phone */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              placeholder="+1-555-123-4567"
              {...register("phone")}
              className={errors.phone ? "input-error" : ""}
            />
            {errors.phone && (
              <span className="error-message">{errors.phone.message}</span>
            )}
          </div>
        </div>

        {/* Row 3: Date of Birth & Nationality */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth *</label>
            <input
              id="dateOfBirth"
              type="date"
              {...register("dateOfBirth")}
              className={errors.dateOfBirth ? "input-error" : ""}
            />
            {errors.dateOfBirth && (
              <span className="error-message">
                {errors.dateOfBirth.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nationality">Nationality *</label>
            <select
              id="nationality"
              {...register("nationality")}
              className={errors.nationality ? "input-error" : ""}
            >
              <option value="">Select Nationality</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="India">India</option>
              <option value="China">China</option>
              <option value="Japan">Japan</option>
              <option value="Other">Other</option>
            </select>
            {errors.nationality && (
              <span className="error-message">{errors.nationality.message}</span>
            )}
          </div>
        </div>

        {/* Row 4: Address */}
        <div className="form-group full-width">
          <label htmlFor="address">Street Address *</label>
          <input
            id="address"
            type="text"
            placeholder="123 Main Street, Apt 4B"
            {...register("address")}
            className={errors.address ? "input-error" : ""}
          />
          {errors.address && (
            <span className="error-message">{errors.address.message}</span>
          )}
        </div>

        {/* Row 5: City */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              id="city"
              type="text"
              placeholder="New York"
              {...register("city")}
              className={errors.city ? "input-error" : ""}
            />
            {errors.city && (
              <span className="error-message">{errors.city.message}</span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Information"}
        </button>

        <p className="required-note">* Required fields</p>
      </form>
    </div>
  );
}
