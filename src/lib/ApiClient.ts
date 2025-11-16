"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

class ApiClient {
  private static instance: ApiClient;
  private baseURL: string;
  private headers: Record<string, string>;
  private router: AppRouterInstance | null = null;

  private constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://cge-lounge-production.up.railway.app";
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public setRouter(router: AppRouterInstance): void {
    this.router = router;
  }

  public setAccessToken(token: string): void {
    // Ensure token is a string and trim whitespace
    const cleanToken =
      typeof token === "string" ? token.trim() : String(token).trim();

    if (!cleanToken) {
      return;
    }

    // Check if token is already formatted with "Bearer "
    const formattedToken = cleanToken.startsWith("Bearer ")
      ? cleanToken
      : `Bearer ${cleanToken}`;

    this.headers["Authorization"] = formattedToken;

    // Store in both localStorage and cookies
    localStorage.setItem("token", cleanToken);
    this.setCookie("access_token", cleanToken, 7); // 7 days expiry
  }

  public removeAccessToken(): void {
    delete this.headers["Authorization"];
    localStorage.removeItem("token");
    this.removeCookie("access_token");
  }

  private setCookie(name: string, value: string, days: number): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  private removeCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  private handleUnauthorized(): void {
    // Clear session data
    this.removeAccessToken();
    localStorage.removeItem("user");

    // Redirect to login page silently (using window.location for reliability)
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }

  public initializeWithToken(): void {
    let accessToken: string | null = null;

    // FIRST: Check localStorage (where token is stored after OTP verification)
    accessToken = localStorage.getItem("token");
    if (accessToken) {
      this.setAccessToken(accessToken);
      return;
    }

    // SECOND: Try to get token from cookies (check multiple possible cookie names)
    const cookieNames = ["access_token", "session.token", "token"];
    for (const cookieName of cookieNames) {
      const cookieToken = this.getCookie(cookieName);
      if (cookieToken) {
        accessToken = cookieToken;
        break;
      }
    }

    if (accessToken) {
      this.setAccessToken(accessToken);
    }
  }

  private getErrorMessage(status: number, message?: string): string {
    switch (status) {
      case 400:
        return message || "Bad request. Please check your input.";
      case 401:
        return "Your session has expired. Please sign in again.";
      case 403:
        return "You don't have permission to access this resource.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return message || "Conflict. The resource already exists.";
      case 422:
        return message || "Validation error. Please check your input.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      case 502:
        return "Bad gateway. Please try again later.";
      case 503:
        return "Service unavailable. Please try again later.";
      default:
        return message || "An unexpected error occurred.";
    }
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Initialize token before each request
    this.initializeWithToken();

    const url = `${this.baseURL}${endpoint}`;

    // JWT tokens are sent in Authorization header, so we don't need credentials
    // Only use credentials if explicitly needed (for cookie-based auth)
    const config: RequestInit = {
      ...options,
      credentials: options.credentials || "same-origin",
      headers: {
        ...this.headers,
        ...(options.headers || {}),
      },
    };

    try {
      const response = await fetch(url, config);

      // Check content type to handle both JSON and plain text responses
      const contentType = response.headers.get("content-type");
      let data: unknown;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Handle plain text or other content types
        const textData = await response.text();
        // Try to parse as JSON if possible, otherwise return as text
        try {
          data = JSON.parse(textData);
        } catch {
          // If not JSON, return a success object for plain text success messages
          data = { message: textData, success: true };
        }
      }

      if (!response.ok) {
        // Handle authentication errors - only for real HTTP 401 responses
        if (response.status === 401) {
          // This is a real 401 response from the server
          // Clear session data and redirect to login
          this.handleUnauthorized();
          return Promise.reject(
            new Error("Your session has expired. Please sign in again.")
          );
        }

        // Handle other errors with specific messages
        const errorMessage = this.getErrorMessage(
          response.status,
          (data as { message?: string })?.message
        );
        throw new Error(errorMessage);
      }

      return data as T;
    } catch (error) {
      // Check if it's a network error (not a real HTTP response)
      if (
        error instanceof TypeError &&
        (error.message.includes("fetch") ||
          error.message.includes("Failed to fetch") ||
          error.message.includes("NetworkError") ||
          error.message.includes("Network request failed"))
      ) {
        // This is a network error, not a real 401
        // Don't clear session data, just throw the error
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      }

      // Check if it's a CORS error
      if (
        error instanceof TypeError &&
        (error.message.includes("CORS") || error.message.includes("blocked"))
      ) {
        throw new Error(
          "CORS error. Please contact the backend team to fix CORS configuration."
        );
      }

      // Re-throw other errors as-is
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  // Convenience methods for common HTTP methods
  public async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public async post<T>(
    endpoint: string,
    data: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  public async put<T>(
    endpoint: string,
    data: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  public async delete<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export default ApiClient;
