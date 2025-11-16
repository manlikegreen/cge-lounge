import ApiClient from "@/lib/ApiClient";

export interface EnrollEventRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  eventId: string;
}

export interface EnrollEventResponse {
  message: string;
  success?: boolean;
  data?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    eventId: string;
    registeredAt: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Enroll in an event/tournament API utility function
 * Registers a user for a specific tournament
 */
export async function enrollEvent(
  enrollmentData: EnrollEventRequest
): Promise<EnrollEventResponse> {
  try {
    const apiClient = ApiClient.getInstance();

    // Prepare the request payload
    const payload = {
      fullName: enrollmentData.fullName,
      email: enrollmentData.email,
      phoneNumber: enrollmentData.phoneNumber,
      eventId: enrollmentData.eventId,
    };

    // Make the API request using ApiClient
    const result = await apiClient.post<EnrollEventResponse>(
      "/event-registrations/enroll",
      payload
    );

    return result;
  } catch (error) {
    throw error;
  }
}
