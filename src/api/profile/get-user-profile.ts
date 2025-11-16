import ApiClient from "@/lib/ApiClient";

// Types for the user profile API
export interface UserProfileResponse {
  id: number;
  username: string;
  bio: string;
  avatarUrl: string;
  phoneNumber: string;
  user: {
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
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Get user profile API utility function
 * Fetches the current user's profile information
 */
export async function getUserProfile(): Promise<UserProfileResponse> {
  try {
    const apiClient = ApiClient.getInstance();

    // Make the API request using ApiClient
    const result = await apiClient.get<UserProfileResponse>("/profile/user/me");

    return result;
  } catch (error) {
    throw error;
  }
}
