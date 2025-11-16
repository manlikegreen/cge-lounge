import ApiClient from "@/lib/ApiClient";

// Types for the profile API
export interface CreateProfileRequest {
  username: string;
  bio: string;
  avatarUrl: string;
  phoneNumber: string;
  role: "user" | "admin" | "moderator";
}

export interface CreateProfileResponse {
  message: string;
  success?: boolean;
  data?: {
    username: string;
    bio: string;
    avatarUrl: string;
    phoneNumber: string;
    role: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Create/Update user profile API utility function
 * Creates or updates the user's profile with the provided information
 */
export async function createProfile(
  profileData: CreateProfileRequest
): Promise<CreateProfileResponse> {
  try {
    console.log("📝 Starting profile creation process...");
    console.log("📋 Profile data received:", {
      username: profileData.username,
      bio: profileData.bio || "(empty)",
      avatarUrl: profileData.avatarUrl,
      phoneNumber: profileData.phoneNumber,
      role: profileData.role,
    });

    const apiClient = ApiClient.getInstance();
    console.log("✅ ApiClient instance obtained");

    // Log token state (ApiClient will handle token initialization)
    console.log("🔐 Checking authentication token...");
    const tokenFromStorage = localStorage.getItem("token");

    // Check multiple possible cookie names
    const cookieNames = ["session.token", "access_token", "token"];
    let tokenFromCookie: string | undefined;
    for (const cookieName of cookieNames) {
      const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${cookieName}=`))
        ?.split("=")[1];
      if (cookieValue) {
        tokenFromCookie = cookieValue;
        console.log(`🔑 Token found in cookie "${cookieName}"`);
        break;
      }
    }

    console.log(
      "🔑 Token from localStorage:",
      tokenFromStorage
        ? `Found (${tokenFromStorage.substring(0, 20)}...)`
        : "Not found"
    );
    console.log(
      "🔑 Token from cookie:",
      tokenFromCookie
        ? `Found (${tokenFromCookie.substring(0, 20)}...)`
        : "Not found"
    );

    // Ensure token is set in ApiClient (it will also check during request, but set it here too)
    const tokenToUse = tokenFromStorage || tokenFromCookie;
    if (tokenToUse) {
      console.log("✅ Setting token in ApiClient...");
      apiClient.setAccessToken(tokenToUse);
      console.log("✅ Token set successfully");
    } else {
      console.warn(
        "⚠️ No token found, but proceeding - ApiClient will handle token initialization"
      );
    }

    // Prepare the request payload
    const payload = {
      username: profileData.username,
      bio: profileData.bio || "", // Send empty string if bio is not provided
      avatarUrl: profileData.avatarUrl,
      phoneNumber: profileData.phoneNumber,
      role: profileData.role,
    };

    console.log("📤 Preparing to send profile creation request...");
    console.log("📦 Request payload:", payload);
    console.log("🌐 Endpoint: /profile/user");
    console.log("🔑 Method: POST");
    console.log(
      "🔑 ApiClient will automatically add 'Bearer ' prefix to the token"
    );

    // Make the API request using ApiClient
    // ApiClient will automatically handle the Authorization header with "Bearer " prefix
    const result = await apiClient.post<CreateProfileResponse>(
      "/profile/user",
      payload
    );

    console.log("✅ Profile creation API call successful!");
    console.log("📥 Response received:", result);
    console.log(
      "🎉 Profile created successfully for user:",
      profileData.username
    );

    return result;
  } catch (error) {
    console.error("❌ Profile creation failed!");
    console.error("💥 Error details:", error);

    if (error instanceof Error) {
      console.error("📝 Error message:", error.message);
      console.error("📚 Error stack:", error.stack);
    }

    console.log("🔄 Re-throwing error for component handling...");
    throw error;
  }
}
