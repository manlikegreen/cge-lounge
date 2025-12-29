import ApiClient from "@/lib/ApiClient";

// Types for the tournaments list API
export interface TournamentGame {
  id: number; // Legacy numeric ID (may still exist)
  gameId?: string; // UUID for game selection (primary)
  tournamentGameId?: string; // UUID for tournament-game relationship (alternative)
  gameTitle: string;
  description: string;
  requirements: string[];
  prize: string | number; // Can be string "5000.00" or number
  winnerPrize: string | number; // Can be string "100000.00" or number
}

export interface TournamentEvent {
  id: number;
  name: string; // Changed from eventName
  description: string;
  banner?: string;
  location?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string | null;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Tournament {
  id: number | string; // Can be number (legacy) or UUID string
  title: string;
  banner?: string;
  description: string;
  event: TournamentEvent;
  games?: TournamentGame[]; // Optional for now
  requirements: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GetTournamentsResponse {
  message?: string;
  success?: boolean;
  data?: Tournament[];
  // Sometimes API might return array directly
}

/**
 * Get all tournaments API utility function
 * Fetches the list of all tournaments
 */
export async function getTournaments(): Promise<Tournament[]> {
  try {
    const apiClient = ApiClient.getInstance();

    // Make the API request using ApiClient
    const result = await apiClient.get<GetTournamentsResponse | Tournament[]>(
      "/tournaments"
    );

    // Handle both response formats: { data: [...] } or [...]
    if (Array.isArray(result)) {
      return result;
    } else if (result.data && Array.isArray(result.data)) {
      return result.data;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Get tournament by ID API utility function
 * Fetches a specific tournament by its ID
 */
export async function getTournamentById(
  id: number | string
): Promise<Tournament> {
  try {
    const apiClient = ApiClient.getInstance();
    const result = await apiClient.get<Tournament>(`/tournaments/${id}`);
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * Get tournament by title/name API utility function
 * Fetches a specific tournament by its title
 */
export async function getTournamentByTitle(title: string): Promise<Tournament> {
  try {
    const apiClient = ApiClient.getInstance();
    const result = await apiClient.get<Tournament>(
      `/tournaments/name/${encodeURIComponent(title)}`
    );
    return result;
  } catch (error) {
    throw error;
  }
}
