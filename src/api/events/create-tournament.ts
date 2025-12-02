import ApiClient from "@/lib/ApiClient";

// Types for the tournament API
export interface TournamentGame {
  gameId: string;
  prize: number;
  winnerPrize: number;
}

export interface CreateTournamentRequest {
  title: string;
  banner?: string;
  description: string;
  event: string; // Event ID as string
  games: TournamentGame[];
  requirements: string[];
}

export interface CreateTournamentResponse {
  message: string;
  success?: boolean;
  data?: {
    id: string;
    title: string;
    banner?: string;
    description: string;
    event: string;
    games: TournamentGame[];
    requirements: string[];
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Create a new tournament API utility function
 * Creates a new tournament with games and requirements
 */
export async function createTournament(
  tournamentData: CreateTournamentRequest
): Promise<CreateTournamentResponse> {
  try {
    const apiClient = ApiClient.getInstance();

    // Prepare the request payload
    const payload = {
      title: tournamentData.title.trim(),
      banner: tournamentData.banner?.trim() || "",
      description: tournamentData.description.trim(),
      event: tournamentData.event,
      games: tournamentData.games,
      requirements: tournamentData.requirements.filter(
        (req) => req.trim() !== ""
      ),
    };

    // Make the API request using ApiClient
    const result = await apiClient.post<CreateTournamentResponse>(
      "/tournaments",
      payload
    );

    return result;
  } catch (error) {
    throw error;
  }
}
