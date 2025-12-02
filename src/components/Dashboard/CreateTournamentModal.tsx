"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/UI/Input";
import { Label } from "@/components/UI/Label";
import { Button } from "@/components/UI/Button";
import { cn } from "@/lib/utils";
import {
  createTournament,
  ApiError,
  TournamentGame,
} from "@/api/events/create-tournament";
import { getEvents, Event } from "@/api/events/get-events";
import { getGames, Game } from "@/api/events/games/get-games";
import CreateEventModal from "./CreateEventModal";

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTournamentCreated?: () => void; // Callback to refresh tournaments list
}

// Local interface for frontend use - uses "fee" instead of "prize"
interface LocalTournamentGame {
  gameId: string;
  fee: number; // Frontend uses "fee" terminology
  winnerPrize: number;
}

const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  isOpen,
  onClose,
  onTournamentCreated,
}) => {
  const [title, setTitle] = useState("");
  const [banner, setBanner] = useState("");
  const [description, setDescription] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [games, setGames] = useState<LocalTournamentGame[]>([]);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Data fetching states
  const [events, setEvents] = useState<Event[]>([]);
  const [availableGames, setAvailableGames] = useState<Game[]>([]);

  // Event creation modal state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Fetch events and games when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchEvents();
      fetchGames();
    }
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && !showSuccess) {
      setTitle("");
      setBanner("");
      setDescription("");
      setSelectedEvent("");
      setGames([]);
      setRequirements([""]);
      setError(null);
    }
  }, [isOpen, showSuccess]);

  const fetchEvents = async () => {
    try {
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load events. Please try again.");
    }
  };

  const fetchGames = async () => {
    try {
      const gamesData = await getGames();
      setAvailableGames(gamesData);
    } catch (err) {
      console.error("Failed to fetch games:", err);
      setError("Failed to load games. Please try again.");
    }
  };

  const addGame = () => {
    setGames([
      ...games,
      {
        gameId: "",
        fee: 0,
        winnerPrize: 0,
      },
    ]);
  };

  const removeGame = (index: number) => {
    const newGames = games.filter((_, i) => i !== index);
    setGames(newGames);
  };

  const updateGame = (
    index: number,
    field: keyof LocalTournamentGame,
    value: string | number
  ) => {
    const newGames = [...games];
    newGames[index] = { ...newGames[index], [field]: value };
    setGames(newGames);
  };

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      const newRequirements = requirements.filter((_, i) => i !== index);
      setRequirements(newRequirements);
    }
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const handleEventCreated = (newEventId?: string) => {
    // Refresh events list and pre-select the new event if provided
    fetchEvents();
    if (newEventId) {
      setSelectedEvent(newEventId);
    }
    setIsEventModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (!selectedEvent) {
      setError("Please select an event");
      return;
    }

    // Validate games
    const validGames = games.filter(
      (game) => game.gameId && game.fee > 0 && game.winnerPrize > 0
    );

    if (validGames.length === 0) {
      setError("At least one game with valid fee and winner prize is required");
      return;
    }

    // Filter out empty requirements
    const validRequirements = requirements.filter((req) => req.trim() !== "");

    if (validRequirements.length === 0) {
      setError("At least one requirement is required");
      return;
    }

    setIsSaving(true);

    try {
      // Transform local games (with "fee") to API format (with "prize")
      const apiGames: TournamentGame[] = validGames.map((game) => ({
        gameId: game.gameId,
        prize: game.fee, // Transform fee -> prize for backend
        winnerPrize: game.winnerPrize,
      }));

      const tournamentPayload = {
        title: title.trim(),
        banner: banner.trim() || undefined,
        description: description.trim(),
        event: selectedEvent,
        games: apiGames,
        requirements: validRequirements,
      };

      await createTournament(tournamentPayload);

      // Show success message
      setShowSuccess(true);

      // Call callback to refresh tournaments list if provided
      if (onTournamentCreated) {
        onTournamentCreated();
      }
    } catch (err) {
      console.error("Failed to create tournament:", err);
      const apiError = err as ApiError;
      setError(
        apiError.message || "Failed to create tournament. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setTitle("");
    setBanner("");
    setDescription("");
    setSelectedEvent("");
    setGames([]);
    setRequirements([""]);
    setError(null);
  };

  const handleClose = () => {
    setShowSuccess(false);
    setTitle("");
    setBanner("");
    setDescription("");
    setSelectedEvent("");
    setGames([]);
    setRequirements([""]);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop with blur effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-dashed border-brand-alt/50 w-full max-w-3xl mx-4 z-[101] max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">
              Create New Tournament
            </h1>
            <p className="text-gray-300 text-lg">
              Set up a new tournament with games and requirements
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg"
            >
              <p className="font-medium mb-4">
                Tournament created successfully! 🎉
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={handleCreateAnother}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white hover:scale-100"
                >
                  Create Another Tournament
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex-1 bg-brand text-brand-bg hover:bg-inherit hover:text-brand-bg hover:scale-100"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}

          {/* Form - Hide when success is shown */}
          {!showSuccess && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 mb-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-white mb-2 block">
                    Tournament Title <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Champions Cup"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="description"
                    className="text-white mb-2 block"
                  >
                    Description <span className="text-red-400">*</span>
                  </Label>
                  <textarea
                    id="description"
                    placeholder="An exciting gaming tournament featuring multiple competitive games..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    required
                    className={cn(
                      "w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white",
                      "focus:border-brand-alt focus:outline-none focus:ring-2 focus:ring-brand-alt/20",
                      "placeholder:text-gray-400 resize-none"
                    )}
                  />
                </div>

                {/* Banner URL */}
                <div>
                  <Label htmlFor="banner" className="text-white mb-2 block">
                    Banner URL{" "}
                    <span className="text-gray-400 text-sm">(Optional)</span>
                  </Label>
                  <Input
                    id="banner"
                    type="url"
                    placeholder="https://example.com/banner.jpg"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                  />
                </div>

                {/* Event Selection */}
                <div>
                  <Label htmlFor="event" className="text-white mb-2 block">
                    Event <span className="text-red-400">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <select
                      id="event"
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                      required
                      className={cn(
                        "flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white",
                        "focus:border-brand-alt focus:outline-none focus:ring-2 focus:ring-brand-alt/20",
                        "cursor-pointer"
                      )}
                    >
                      <option value="" className="bg-gray-800">
                        Select an event
                      </option>
                      {events.map((event) => (
                        <option
                          key={event.id}
                          value={event.id.toString()}
                          className="bg-gray-800"
                        >
                          {event.eventName}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      onClick={() => setIsEventModalOpen(true)}
                      variant="ghost"
                      className="whitespace-nowrap hover:scale-100"
                    >
                      + Create Event
                    </Button>
                  </div>
                </div>

                {/* Games */}
                <div>
                  <Label className="text-white mb-2 block">
                    Games <span className="text-red-400">*</span>
                  </Label>
                  <div className="space-y-4">
                    {games.map((game, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-800/30 rounded-lg border border-gray-700"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-white font-medium">
                            Game {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeGame(index)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label
                              htmlFor={`game-${index}`}
                              className="text-gray-300 text-sm mb-1 block"
                            >
                              Select Game
                            </Label>
                            <select
                              id={`game-${index}`}
                              value={game.gameId}
                              onChange={(e) =>
                                updateGame(index, "gameId", e.target.value)
                              }
                              required
                              className={cn(
                                "w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white",
                                "focus:border-brand-alt focus:outline-none focus:ring-2 focus:ring-brand-alt/20",
                                "cursor-pointer"
                              )}
                            >
                              <option value="" className="bg-gray-800">
                                Choose a game
                              </option>
                              {availableGames.map((g) => (
                                <option
                                  key={g.id}
                                  value={g.id}
                                  className="bg-gray-800"
                                >
                                  {g.gameTitle}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label
                                htmlFor={`fee-${index}`}
                                className="text-gray-300 text-sm mb-1 block"
                              >
                                Fee (₦)
                              </Label>
                              <Input
                                id={`fee-${index}`}
                                type="number"
                                min="0"
                                step="1"
                                placeholder="50000"
                                value={game.fee || ""}
                                onChange={(e) =>
                                  updateGame(
                                    index,
                                    "fee",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                required
                                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                              />
                            </div>
                            <div>
                              <Label
                                htmlFor={`winnerPrize-${index}`}
                                className="text-gray-300 text-sm mb-1 block"
                              >
                                Winner Prize (₦)
                              </Label>
                              <Input
                                id={`winnerPrize-${index}`}
                                type="number"
                                min="0"
                                step="1"
                                placeholder="200000"
                                value={game.winnerPrize || ""}
                                onChange={(e) =>
                                  updateGame(
                                    index,
                                    "winnerPrize",
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                required
                                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addGame}
                      variant="ghost"
                      className="w-full border-dashed border-gray-600 hover:border-brand-alt hover:scale-100"
                    >
                      + Add Game
                    </Button>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <Label className="text-white mb-2 block">
                    Requirements <span className="text-red-400">*</span>
                  </Label>
                  <div className="space-y-3">
                    {requirements.map((requirement, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          type="text"
                          placeholder={`Requirement ${index + 1}`}
                          value={requirement}
                          onChange={(e) =>
                            updateRequirement(index, e.target.value)
                          }
                          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                        />
                        {requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addRequirement}
                      variant="ghost"
                      className="w-full border-dashed border-gray-600 hover:border-brand-alt hover:scale-100"
                    >
                      + Add Requirement
                    </Button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full md:w-auto px-12 py-3 bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 hover:scale-100"
                >
                  {isSaving ? "Creating..." : "Create Tournament"}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  // Render modal using portal to ensure it's centered on screen
  if (typeof window !== "undefined") {
    return (
      <>
        {createPortal(modalContent, document.body)}
        <CreateEventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
          onEventCreated={(newEventId) => handleEventCreated(newEventId)}
        />
      </>
    );
  }

  return null;
};

export default CreateTournamentModal;
