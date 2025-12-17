import ApiClient from "@/lib/ApiClient";

// Types for the reset password API
export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
  success?: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Reset password API utility function
 * Resets user password after OTP verification
 */
export async function resetPassword(
  userData: ResetPasswordRequest
): Promise<ResetPasswordResponse> {
  try {
    const apiClient = ApiClient.getInstance();

    // Prepare the request payload
    const payload = {
      email: userData.email,
      newPassword: userData.newPassword,
    };

    console.log("Making reset password request with payload:", {
      email: payload.email,
      newPassword: "***",
    });

    // Make the API request using ApiClient
    const result = await apiClient.post<ResetPasswordResponse>(
      "/user/reset-password",
      payload
    );

    console.log("Password reset successful:", result);
    return result;
  } catch (error) {
    console.log("Reset password error:", error);
    throw error;
  }
}

