import ApiClient from "@/lib/ApiClient";

// Types for the events list API
export interface Event {
  id: number;
  eventName: string;
  description: string;
  banner?: string;
  location: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Get all events API utility function
 * Fetches the list of all events available for tournaments
 */
export async function getEvents(): Promise<Event[]> {
  try {
    const apiClient = ApiClient.getInstance();

    // Make the API request using ApiClient
    const result = await apiClient.get<Event[]>("/event/all-events");

    // Response is an array directly
    return Array.isArray(result) ? result : [];
  } catch (error) {
    throw error;
  }
}
