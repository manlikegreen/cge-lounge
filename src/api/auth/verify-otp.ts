import ApiClient from "@/lib/ApiClient";

// Types for the verify OTP API
export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface VerifyOTPResponse {
  message: string;
  error?: string;
  statusCode: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Verify OTP API utility function
 * Verifies the OTP code sent to user's email
 */
export async function verifyOTP(
  userData: VerifyOTPRequest
): Promise<VerifyOTPResponse> {
  try {
    const apiClient = ApiClient.getInstance();

    // Prepare the request payload
    const payload = {
      email: userData.email,
      otp: userData.otp,
    };

    console.log("Making verify OTP request with payload:", payload);

    // Make the API request using ApiClient
    const result = await apiClient.post<VerifyOTPResponse>(
      "/user/verify-otp",
      payload
    );

    console.log("OTP verification successful:", result);
    return result;
  } catch (error) {
    console.log("OTP verification error:", error);
    throw error;
  }
}
