import ApiClient from "@/lib/ApiClient";

// Types for the games list API
export interface Game {
  id: string;
  gameTitle: string;
  description: string;
  requirements: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GetGamesResponse {
  message?: string;
  success?: boolean;
  data?: Game[];
  // Sometimes API might return array directly
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Get all games API utility function
 * Fetches the list of all games available for tournaments
 */
export async function getGames(): Promise<Game[]> {
  try {
    const apiClient = ApiClient.getInstance();

    // Make the API request using ApiClient
    const result = await apiClient.get<GetGamesResponse | Game[]>("/game");

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
