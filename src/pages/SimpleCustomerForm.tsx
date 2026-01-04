import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { kycAPI } from "../services/api";

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
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slide-up">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
          ✅
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Submission Successful!</h2>
        <p className="text-slate-600 mb-6">
          Your information has been received and is being processed.
        </p>
        <div className="bg-slate-100 rounded-xl p-4 mb-6">
          <label className="text-sm font-semibold text-slate-700 block mb-2">
            Submission ID:
          </label>
          <code className="text-lg font-mono font-bold text-cyan-600 bg-white px-4 py-2 rounded-lg inline-block">
            {submissionId}
          </code>
        </div>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          Submit Another
        </button>
      </div>
    </div>
  </div>
);

interface SimpleCustomerFormProps {
  readonly onNavigateToLanding?: () => void;
}

export function SimpleCustomerForm({ onNavigateToLanding }: SimpleCustomerFormProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={onNavigateToLanding}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                🚀
              </div>
              <span className="text-xl font-bold text-slate-900">KYC System</span>
            </button>
            <nav className="flex items-center gap-4">
              <span className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-lg font-semibold text-sm">
                Customer Form
              </span>
              <button
                onClick={onNavigateToLanding}
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Back to Landing
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <p className="text-cyan-600 font-semibold text-sm uppercase tracking-wide mb-3">
                Trusted flow
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Submit once, stay compliant everywhere
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                This lightweight form feeds our AI summarizer and admin review console.
                Every required datapoint is validated in real-time and encrypted at rest.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-700">
                  <span className="text-xl">⏱</span>
                  <span>Average completion time: 3 minutes</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <span className="text-xl">🤖</span>
                  <span>Instant summary for the review team</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <span className="text-xl">🔒</span>
                  <span>ISO 27001 aligned storage</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <p className="font-semibold mb-2">Next steps</p>
              <strong className="text-lg">
                Receive your submission ID + live status tracking link.
              </strong>
            </div>
          </aside>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 px-8 py-10 text-white">
                <h1 className="text-4xl font-bold mb-3">Complete Your KYC Verification</h1>
                <p className="text-cyan-50 text-lg">
                  Provide your information to get verified in minutes
                </p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                {/* Row 1: First Name & Last Name */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-bold text-slate-900 mb-2"
                    >
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      {...register("firstName")}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.firstName ? "border-red-500" : "border-slate-300"
                        }`}
                    />
                    {errors.firstName && (
                      <span className="text-red-600 text-sm font-semibold mt-1 block">
                        ⚠️ {errors.firstName.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-bold text-slate-900 mb-2"
                    >
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      {...register("lastName")}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.lastName ? "border-red-500" : "border-slate-300"
                        }`}
                    />
                    {errors.lastName && (
                      <span className="text-red-600 text-sm font-semibold mt-1 block">
                        ⚠️ {errors.lastName.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register("email")}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.email ? "border-red-500" : "border-slate-300"
                        }`}
                    />
                    {errors.email && (
                      <span className="text-red-600 text-sm font-semibold mt-1 block">
                        ⚠️ {errors.email.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+1-555-123-4567"
                      {...register("phone")}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.phone ? "border-red-500" : "border-slate-300"
                        }`}
                    />
                    {errors.phone && (
                      <span className="text-red-600 text-sm font-semibold mt-1 block">
                        ⚠️ {errors.phone.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 3: Date of Birth & Nationality */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-bold text-slate-900 mb-2"
                    >
                      Date of Birth *
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      {...register("dateOfBirth")}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.dateOfBirth ? "border-red-500" : "border-slate-300"
                        }`}
                    />
                    {errors.dateOfBirth && (
                      <span className="text-red-600 text-sm font-semibold mt-1 block">
                        ⚠️ {errors.dateOfBirth.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="nationality"
                      className="block text-sm font-bold text-slate-900 mb-2"
                    >
                      Nationality *
                    </label>
                    <select
                      id="nationality"
                      {...register("nationality")}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.nationality ? "border-red-500" : "border-slate-300"
                        }`}
                    >
                      <option value="">Select Nationality</option>
                      <option value="Australia">Australia</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Canada">Canada</option>
                      <option value="China">China</option>
                      <option value="France">France</option>
                      <option value="Germany">Germany</option>
                      <option value="India">India</option>
                      <option value="Japan">Japan</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="United States">United States</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.nationality && (
                      <span className="text-red-600 text-sm font-semibold mt-1 block">
                        ⚠️ {errors.nationality.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Row 4: Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-bold text-slate-900 mb-2">
                    Street Address *
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="123 Main Street, Apt 4B"
                    {...register("address")}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.address ? "border-red-500" : "border-slate-300"
                      }`}
                  />
                  {errors.address && (
                    <span className="text-red-600 text-sm font-semibold mt-1 block">
                      ⚠️ {errors.address.message}
                    </span>
                  )}
                </div>

                {/* Row 5: City */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-bold text-slate-900 mb-2">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="New York"
                      {...register("city")}
                      className={`w-full px-4 py-3 bg-white border-2 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all ${errors.city ? "border-red-500" : "border-slate-300"
                        }`}
                    />
                    {errors.city && (
                      <span className="text-red-600 text-sm font-semibold mt-1 block">
                        ⚠️ {errors.city.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">🚀</span>
                        Submit Information
                      </>
                    )}
                  </button>
                  <p className="text-center text-sm text-slate-600 mt-4">* Required fields</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
