import axios from "axios";
import type { KYCFormData, KYCSubmissionResponse } from "../types/kyc";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// API endpoints
export const kycAPI = {
  // Submit KYC form data
  submitKYC: async (data: KYCFormData): Promise<KYCSubmissionResponse> => {
    try {
      const response = await apiClient.post<KYCSubmissionResponse>(
        "/kyc/submit",
        data
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as Record<string, unknown>)?.message ||
          error.message ||
          "Failed to submit KYC data";
        throw new Error(String(message));
      }
      throw error;
    }
  },

  // Get submission status
  getSubmissionStatus: async (id: string): Promise<KYCSubmissionResponse> => {
    try {
      const response = await apiClient.get<KYCSubmissionResponse>(
        `/kyc/status/${id}`
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          (error.response?.data as Record<string, unknown>)?.message ||
          error.message ||
          "Failed to fetch submission status";
        throw new Error(String(message));
      }
      throw error;
    }
  },
};

export default apiClient;
