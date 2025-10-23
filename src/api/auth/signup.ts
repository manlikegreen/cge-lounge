import ApiClient from "@/lib/ApiClient";

// Types for the signup API
export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  provider: string;
  avatarUrl: string | null;
  emailVerifiedAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SignupResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Signup API utility function
 * Creates a new user account with the provided information
 */
export async function signupUser(
  userData: SignupRequest
): Promise<SignupResponse> {
  try {
    const apiClient = ApiClient.getInstance();

    // Combine firstName and lastName into fullName
    const fullName = `${userData.firstName} ${userData.lastName}`.trim();

    // Prepare the request payload
    const payload = {
      email: userData.email,
      password: userData.password,
      fullName: fullName,
    };

    console.log("Making signup request with payload:", payload);

    // Make the API request using ApiClient
    const result = await apiClient.post<SignupResponse>(
      "/user/auth/email",
      payload
    );

    console.log("Signup successful:", result);
    return result;
  } catch (error) {
    console.log("Signup error:", error);
    throw error;
  }
}
