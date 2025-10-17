
import { Bank, VietQRRequest, VietQRResponse } from '../types';

const API_BASE_URL = 'https://api.vietqr.io/v2';
const CLIENT_ID = 'c1b67c32-a579-430c-9396-1463991253a5';
const API_KEY = '12228221-87A5-4228-8924-A6129C35F7E7';


interface BankApiResponse {
    code: string;
    desc: string;
    data: Bank[];
}

export const fetchBanks = async (): Promise<Bank[]> => {
  const response = await fetch(`${API_BASE_URL}/banks`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const result: BankApiResponse = await response.json();
  if (result.code !== '00') {
      throw new Error(result.desc || 'Failed to fetch banks');
  }
  // Sanitize data: The API returns `bin` as a string, but we use it as a number.
  // This ensures type consistency throughout the app, fixing profile loading issues.
  return result.data.map(bank => ({
      ...bank,
      bin: parseInt(String(bank.bin), 10)
  }));
};

export const generateQR = async (payload: VietQRRequest): Promise<VietQRResponse> => {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'x-client-id': CLIENT_ID,
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to generate QR code. Please check your details and try again.');
  }

  const result: VietQRResponse = await response.json();
  // The API returns success=true even on validation errors, so check the code.
  if (result.code !== '00') {
      // Create a more user-friendly error message.
      const errorMessage = result.desc || 'An error occurred during QR code generation.';
      return { ...result, success: false, desc: errorMessage };
  }

  return { ...result, success: true };
};
