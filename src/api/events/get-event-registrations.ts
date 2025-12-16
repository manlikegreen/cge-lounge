import ApiClient from "@/lib/ApiClient";

// Types for event registration response
export interface EventRegistrationProfile {
  id: string;
  username: string;
  bio: string;
  avatarUrl: string;
  phoneNumber: string;
}

export interface EventRegistrationEvent {
  id: string;
  eventName: string;
  description: string;
  banner: string;
  location: string;
  startDate: string;
  registrationDeadline: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistration {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  event: EventRegistrationEvent;
  profile: EventRegistrationProfile;
  createdAt: string;
}

/**
 * Get event registrations API utility function
 * Fetches all users registered for a specific event
 */
export async function getEventRegistrations(
  eventId: string | number
): Promise<EventRegistration[]> {
  try {
    const apiClient = ApiClient.getInstance();

    // Make the API request using ApiClient
    const result = await apiClient.get<EventRegistration[]>(
      `/event-registrations/event/${eventId}`
    );

    // Response is an array directly
    return Array.isArray(result) ? result : [];
  } catch (error) {
    throw error;
  }
}
