import ApiClient from "@/lib/ApiClient";

// Types for the game API
export interface CreateGameRequest {
  gameTitle: string;
  description: string;
  requirements: string[];
}

export interface CreateGameResponse {
  message: string;
  success?: boolean;
  data?: {
    id: string;
    gameTitle: string;
    description: string;
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
 * Create a new game API utility function
 * Creates a new game that can be used in tournaments
 */
export async function createGame(
  gameData: CreateGameRequest
): Promise<CreateGameResponse> {
  try {
    const apiClient = ApiClient.getInstance();

    // Prepare the request payload
    const payload = {
      gameTitle: gameData.gameTitle.trim(),
      description: gameData.description.trim(),
      requirements: gameData.requirements.filter((req) => req.trim() !== ""),
    };

    // Make the API request using ApiClient
    const result = await apiClient.post<CreateGameResponse>("/game", payload);

    return result;
  } catch (error) {
    throw error;
  }
}
