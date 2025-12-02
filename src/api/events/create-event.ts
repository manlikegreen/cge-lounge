import ApiClient from "@/lib/ApiClient";

// Types for the event API
export interface CreateEventRequest {
  eventName: string;
  description: string;
  banner?: string;
  location: string;
  startDate: string; // ISO datetime string
  endDate: string; // ISO datetime string
  registrationDeadline: string; // ISO datetime string
}

export interface CreateEventResponse {
  message: string;
  success?: boolean;
  data?: {
    id: number;
    eventName: string;
    description: string;
    banner?: string;
    location: string;
    startDate: string;
    endDate: string;
    registrationDeadline: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Create a new event API utility function
 * Creates a new event that can be used for tournaments
 */
export async function createEvent(
  eventData: CreateEventRequest
): Promise<CreateEventResponse> {
  try {
    const apiClient = ApiClient.getInstance();

    // Prepare the request payload
    const payload = {
      eventName: eventData.eventName.trim(),
      description: eventData.description.trim(),
      banner: eventData.banner?.trim() || "",
      location: eventData.location.trim(),
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      registrationDeadline: eventData.registrationDeadline,
    };

    // Make the API request using ApiClient
    const result = await apiClient.post<CreateEventResponse>(
      "/event/create",
      payload
    );

    return result;
  } catch (error) {
    throw error;
  }
}
