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
    const baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://cge-lounge-production.up.railway.app";

    // Prepare the request payload
    const payload = {
      email: userData.email,
      password: userData.password,
    };

    console.log("Making login request with payload:", payload);

    // Make the API request to access response headers
    const url = `${baseURL}/user/auth/login`;
    console.log("📡 Login request URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Log ALL response headers to identify which contains the token
    console.log("📥 ========== LOGIN RESPONSE HEADERS ==========");
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
      console.log(`📥 Header: ${key} = ${value}`);
    });
    console.log("📥 All response headers:", responseHeaders);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        (errorData as { message?: string })?.message || "Login failed"
      );
    }

    const result = (await response.json()) as LoginResponse;
    console.log("Login successful:", result);

    // Extract token from response headers
    // Check common header names that might contain the token
    const possibleTokenHeaders = [
      "authorization",
      "Authorization",
      "x-access-token",
      "X-Access-Token",
      "access-token",
      "Access-Token",
      "x-auth-token",
      "X-Auth-Token",
    ];

    let tokenFromHeader: string | null = null;
    for (const headerName of possibleTokenHeaders) {
      const headerValue = response.headers.get(headerName);
      if (headerValue) {
        console.log(`🔑 Token found in header "${headerName}":`, headerValue);
        // Remove "Bearer " prefix if present
        tokenFromHeader = headerValue.startsWith("Bearer ")
          ? headerValue.substring(7)
          : headerValue;
        break;
      }
    }

    if (tokenFromHeader) {
      console.log(
        "✅ Extracted token from response header:",
        tokenFromHeader.substring(0, 20) + "..."
      );
      console.log("💾 Storing token using ApiClient.setAccessToken()...");
      apiClient.setAccessToken(tokenFromHeader);
      console.log(
        "✅ Token stored in localStorage (as 'token') and cookie (as 'access_token')"
      );
    } else {
      console.warn("⚠️ No token found in response headers!");
      console.warn("⚠️ Falling back to access_token from response body...");

      // Fallback: Use access_token from response body if headers don't have it
      if (result.access_token) {
        console.log(
          "✅ Found access_token in response body:",
          result.access_token.substring(0, 20) + "..."
        );
        console.log("💾 Storing token using ApiClient.setAccessToken()...");
        apiClient.setAccessToken(result.access_token);
        console.log(
          "✅ Token stored in localStorage (as 'token') and cookie (as 'access_token')"
        );
      } else {
        console.error("❌ No token found in headers OR response body!");
        console.error(
          "❌ Check the logged headers above to see which header contains the token"
        );
        console.error(
          "❌ If token is in a different header, update the possibleTokenHeaders array"
        );
      }
    }

    return result;
  } catch (error) {
    console.log("Login error:", error);
    throw error;
  }
}
