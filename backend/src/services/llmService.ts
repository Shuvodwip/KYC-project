import axios from 'axios';
import type { KYCFormData } from '../utils/types.js';

/**
 * Generate a one-line summary of KYC data using LLM
 */
export async function generateKYCSummary(
  data: KYCFormData
): Promise<string> {
  try {
    const provider = process.env.LLM_PROVIDER || 'huggingface';

    if (provider === 'huggingface') {
      return await generateSummaryHuggingFace(data);
    } else if (provider === 'ollama') {
      return await generateSummaryOllama(data);
    } else {
      throw new Error(`Unknown LLM provider: ${provider}`);
    }
  } catch (error) {
    console.error('Error generating LLM summary:', error);
    // Return a fallback summary if LLM fails
    return generateFallbackSummary(data);
  }
}

/**
 * Generate summary using Hugging Face API
 */
async function generateSummaryHuggingFace(
  data: KYCFormData
): Promise<string> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  const model = process.env.HUGGINGFACE_MODEL || 'mistral-7b-instruct-v0.1';

  if (!apiKey) {
    console.warn('HUGGINGFACE_API_KEY not configured, using fallback');
    return generateFallbackSummary(data);
  }

  // Format the KYC data into a prompt
  const prompt = formatKYCPrompt(data);

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_length: 100,
          temperature: 0.3,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    if (Array.isArray(response.data) && response.data.length > 0) {
      const summary = response.data[0]?.generated_text || '';
      // Extract just the summary part (remove the prompt)
      const summaryOnly = summary.replace(prompt, '').trim();
      return summaryOnly.substring(0, 200); // Limit to 200 chars
    }

    return generateFallbackSummary(data);
  } catch (error) {
    console.error('Hugging Face API error:', error);
    return generateFallbackSummary(data);
  }
}

/**
 * Generate summary using local Ollama API
 */
async function generateSummaryOllama(
  data: KYCFormData
): Promise<string> {
  const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'mistral';

  const prompt = formatKYCPrompt(data);

  try {
    const response = await axios.post(
      `${ollamaUrl}/api/generate`,
      {
        model,
        prompt,
        stream: false,
        temperature: 0.3,
      },
      {
        timeout: 30000,
      }
    );

    const summary = response.data?.response || '';
    return summary.substring(0, 200); // Limit to 200 chars
  } catch (error) {
    console.error('Ollama API error:', error);
    return generateFallbackSummary(data);
  }
}

/**
 * Format KYC data into a structured prompt for the LLM
 */
function formatKYCPrompt(data: KYCFormData): string {
  const firstName = data.firstName || 'N/A';
  const lastName = data.lastName || 'N/A';
  const nationality = data.nationality || 'N/A';
  const dateOfBirth = data.dateOfBirth || 'N/A';
  const email = data.email || 'N/A';
  const phone = data.phone || 'N/A';
  const address = data.address || 'N/A';
  const city = data.city || 'N/A';

  // Additional optional fields
  const gender = data.gender || 'N/A';
  const documentType = data.documentType || 'N/A';
  const documentId = data.documentId || 'N/A';
  const employmentStatus = data.employmentStatus || 'N/A';
  const sourceOfFunds = data.sourceOfFunds || 'N/A';

  return `Create a professional one-sentence summary of this customer's KYC profile. Use proper English grammar and punctuation. Keep it concise (under 150 characters).

Customer Information:
- Name: ${firstName} ${lastName}
- Age: ${calculateAge(dateOfBirth)}
- Nationality: ${nationality}
- City: ${city}
- Employment Status: ${employmentStatus}
- Document Type: ${documentType}

Write only the summary sentence, nothing else:`;
}

/**
 * Calculate age from date of birth
 */
function calculateAge(dateOfBirth: string | undefined): string {
  if (!dateOfBirth) return 'N/A';
  try {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age.toString();
  } catch {
    return 'N/A';
  }
}

/**
 * Fallback summary if LLM is unavailable
 */
function generateFallbackSummary(data: KYCFormData): string {
  const firstName = data.firstName || 'Customer';
  const lastName = data.lastName || '';
  const nationality = data.nationality || 'Unknown';
  const city = data.city || 'Unknown';
  const age = calculateAge(data.dateOfBirth);
  const employmentStatus = data.employmentStatus || 'Not specified';

  return `${firstName} ${lastName} is a ${age}-year-old ${nationality} national residing in ${city} with ${employmentStatus} employment status.`;
}
