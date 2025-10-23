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
    console.log("Setting access token:", token);
    this.headers["Authorization"] = `Bearer ${token}`;

    // Store in both localStorage and cookies
    localStorage.setItem("token", token);
    this.setCookie("access_token", token, 7); // 7 days expiry
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
    console.log("🔐 Starting unauthorized access handling");

    console.log("🧹 Clearing session data");
    // Clear session data
    this.removeAccessToken();
    localStorage.removeItem("user");

    console.log("🔄 Initiating redirect to /auth/login");
    // Redirect to login
    if (this.router) {
      this.router.push("/auth/login");
    } else {
      window.location.href = "/auth/login";
    }
    console.log("✅ Unauthorized handling complete");
  }

  public initializeWithToken(): void {
    // First try to get token from cookie
    let accessToken = this.getCookie("access_token");

    // If no token in cookie, try localStorage as fallback
    if (!accessToken) {
      accessToken = localStorage.getItem("token");
      if (accessToken) {
        console.log("Access token found in localStorage (fallback)");
      }
    }

    if (accessToken) {
      console.log("Access token found in cookie");
      this.setAccessToken(accessToken);
      return;
    }

    // If no token found anywhere, remove any existing token
    console.log("No access token found in cookie or localStorage");
    this.removeAccessToken();
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
    console.log("🚀 Starting API request to:", endpoint);
    // Initialize token before each request
    this.initializeWithToken();

    const url = `${this.baseURL}${endpoint}`;
    console.log("📡 Request URL:", url);
    console.log("🔑 Current headers:", this.headers);

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.headers,
        ...(options.headers || {}),
      },
    };

    try {
      console.log("📤 Sending request with config:", config);
      const response = await fetch(url, config);
      console.log("📥 Received response status:", response.status);

      const data = await response.json();
      console.log("📦 Response data:", data);

      if (!response.ok) {
        console.log("❌ Request failed with status:", response.status);

        // Handle authentication errors
        if (response.status === 401) {
          console.log("🔒 Unauthorized access detected");
          this.handleUnauthorized();
          return Promise.reject(
            new Error("Your session has expired. Please sign in again.")
          );
        }

        // Handle other errors with specific messages
        const errorMessage = this.getErrorMessage(
          response.status,
          data.message
        );
        console.log("❌ Error:", errorMessage);
        throw new Error(errorMessage);
      }

      console.log("✅ Request successful");
      return data as T;
    } catch (error) {
      console.log("💥 Error caught in request:", error);
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
