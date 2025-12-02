import ApiClient from "@/lib/ApiClient";

export interface EnrollTournamentRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  tournamentId: string;
  selectedGames: string[]; // Array of game IDs as strings
}

export interface EnrollTournamentResponse {
  message: string;
  success?: boolean;
  data?: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    tournamentId: string;
    registeredAt: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Enroll in a tournament API utility function
 * Registers a user for a specific tournament
 */
export async function enrollTournament(
  enrollmentData: EnrollTournamentRequest
): Promise<EnrollTournamentResponse> {
  try {
    const apiClient = ApiClient.getInstance();

    // Prepare the request payload
    const payload = {
      fullName: enrollmentData.fullName,
      email: enrollmentData.email,
      phoneNumber: enrollmentData.phoneNumber,
      tournamentId: enrollmentData.tournamentId,
      selectedGames: enrollmentData.selectedGames,
    };

    // Make the API request using ApiClient
    const result = await apiClient.post<EnrollTournamentResponse>(
      "/tournament-registrations/enroll",
      payload
    );

    return result;
  } catch (error) {
    throw error;
  }
}
