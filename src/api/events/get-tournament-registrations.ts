import ApiClient from "@/lib/ApiClient";

// Types for tournament registration response
export interface TournamentRegistrationProfile {
  id: string;
  username: string;
  bio: string;
  avatarUrl: string;
  phoneNumber: string;
}

export interface TournamentRegistrationTournament {
  id: string;
  title: string;
  banner: string;
  requirements: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentRegistration {
  id: string;
  tournament: TournamentRegistrationTournament;
  profile: TournamentRegistrationProfile;
  fullName: string;
  email: string;
  phoneNumber: string;
  paidAt: string;
  createdAt: string;
}

/**
 * Get tournament registrations API utility function
 * Fetches all users registered for a specific tournament
 */
export async function getTournamentRegistrations(
  tournamentId: string | number
): Promise<TournamentRegistration[]> {
  try {
    const apiClient = ApiClient.getInstance();

    // Make the API request using ApiClient
    const result = await apiClient.get<TournamentRegistration[]>(
      `/tournament-registrations/tournament/${tournamentId}`
    );

    // Response is an array directly
    return Array.isArray(result) ? result : [];
  } catch (error) {
    throw error;
  }
}
