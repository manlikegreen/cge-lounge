import ApiClient from "@/lib/ApiClient";

// Types for the send OTP API
export interface SendOTPRequest {
  email: string;
}

export interface SendOTPResponse {
  message: string;
  error?: string;
  statusCode: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Send OTP API utility function
 * Sends a new OTP code to user's email
 */
export async function sendOTP(
  userData: SendOTPRequest
): Promise<SendOTPResponse> {
  try {
    const apiClient = ApiClient.getInstance();

    // Prepare the request payload
    const payload = {
      email: userData.email,
    };

    console.log("Making send OTP request with payload:", payload);

    // Make the API request using ApiClient
    const result = await apiClient.post<SendOTPResponse>(
      "/user/send-otp",
      payload
    );

    console.log("OTP sent successfully:", result);
    return result;
  } catch (error) {
    console.log("Send OTP error:", error);
    throw error;
  }
}
