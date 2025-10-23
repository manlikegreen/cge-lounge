import ApiClient from "@/lib/ApiClient";

// Types for the login API
export interface LoginRequest {
  email: string;
  password: string;
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

export interface LoginResponse {
  user: User;
  access_token: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Login API utility function
 * Authenticates a user with email and password
 */
export async function loginUser(
  userData: LoginRequest
): Promise<LoginResponse> {
  try {
    const apiClient = ApiClient.getInstance();

    // Prepare the request payload
    const payload = {
      email: userData.email,
      password: userData.password,
    };

    console.log("Making login request with payload:", payload);

    // Make the API request using ApiClient
    const result = await apiClient.post<LoginResponse>(
      "/user/auth/login",
      payload
    );

    console.log("Login successful:", result);
    return result;
  } catch (error) {
    console.log("Login error:", error);
    throw error;
  }
}
