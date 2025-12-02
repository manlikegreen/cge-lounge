import ApiClient from "@/lib/ApiClient";
import { Event } from "./get-events";

export type { Event };

/**
 * Get event by ID API utility function
 * Fetches a specific event by its ID
 */
export async function getEventById(id: number | string): Promise<Event> {
  try {
    const apiClient = ApiClient.getInstance();
    const result = await apiClient.get<Event>(`/event/${id}`);
    return result;
  } catch (error) {
    throw error;
  }
}
