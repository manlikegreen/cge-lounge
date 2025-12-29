"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { Button } from "../UI/Button";
import {
  enrollTournament,
  ApiError as TournamentApiError,
} from "@/api/events/enroll-tournament";
import {
  getTournamentById,
  TournamentGame,
  getTournaments,
  Tournament,
} from "@/api/events/get-tournaments";

interface Participant {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  selectedGames: string[];
}

interface SubmissionResult {
  participantId: string;
  success: boolean;
  error?: string;
}

interface ManualTournamentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess: () => void;
}

const ManualTournamentRegistrationModal: React.FC<
  ManualTournamentRegistrationModalProps
> = ({ isOpen, onClose, onRegistrationSuccess }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    string | number | null
  >(null);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [games, setGames] = useState<TournamentGame[]>([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(false);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [success, setSuccess] = useState(false);

  // Tournament submission state
  const [submissionProgress, setSubmissionProgress] = useState<{
    current: number;
    total: number;
    isSubmitting: boolean;
  } | null>(null);
  const [submissionResults, setSubmissionResults] = useState<
    SubmissionResult[]
  >([]);
  const [failedParticipants, setFailedParticipants] = useState<Participant[]>(
    []
  );

  // Fetch tournaments when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoadingTournaments(true);
      const fetchTournaments = async () => {
        try {
          const tournamentsData = await getTournaments();
          setTournaments(tournamentsData);
        } catch (err) {
          console.error("Failed to fetch tournaments:", err);
          setError("Failed to load tournaments. Please try again.");
        } finally {
          setIsLoadingTournaments(false);
        }
      };

      fetchTournaments();
    }
  }, [isOpen]);

  // Fetch tournament games when a tournament is selected
  useEffect(() => {
    if (isOpen && selectedTournamentId) {
      setIsLoadingGames(true);
      setGames([]);
      const fetchGames = async () => {
        try {
          const tournamentData = await getTournamentById(selectedTournamentId);
          setGames(tournamentData.games || []);
          setSelectedTournament(tournamentData);
        } catch (err) {
          console.error("Failed to fetch tournament games:", err);
          setError("Failed to load tournament games. Please try again.");
        } finally {
          setIsLoadingGames(false);
        }
      };

      fetchGames();
    } else {
      setGames([]);
      setSelectedTournament(null);
    }
  }, [isOpen, selectedTournamentId]);

  // Generate unique participant ID
  const generateParticipantId = (): string => {
    return `participant-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTournamentId(null);
      setSelectedTournament(null);
      setParticipants([
        {
          id: generateParticipantId(),
          fullName: "",
          email: "",
          phoneNumber: "",
          selectedGames: [],
        },
      ]);
      setGames([]);
      setError(null);
      setRegistrationError(null);
      setSuccess(false);
      setSubmissionProgress(null);
      setSubmissionResults([]);
      setFailedParticipants([]);
    }
  }, [isOpen]);

  // Add new participant
  const addParticipant = () => {
    setParticipants([
      ...participants,
      {
        id: generateParticipantId(),
        fullName: "",
        email: "",
        phoneNumber: "",
        selectedGames: [],
      },
    ]);
  };

  // Remove participant
  const removeParticipant = (participantId: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== participantId));
    }
  };

  // Update participant field
  const updateParticipant = (
    participantId: string,
    field: keyof Participant,
    value: string | string[]
  ) => {
    setParticipants(
      participants.map((p) =>
        p.id === participantId ? { ...p, [field]: value } : p
      )
    );
  };

  // Toggle game selection for participant
  const toggleGameSelection = (participantId: string, gameId: string) => {
    setParticipants(
      participants.map((p) => {
        if (p.id === participantId) {
          const selectedGames = p.selectedGames.includes(gameId)
            ? p.selectedGames.filter((id) => id !== gameId)
            : [...p.selectedGames, gameId];
          return { ...p, selectedGames };
        }
        return p;
      })
    );
  };

  // Get the UUID for a game (prefers UUID fields over numeric id)
  const getGameUuid = (game: TournamentGame): string => {
    return game.gameId || game.tournamentGameId || game.id.toString();
  };

  // Validate tournament form (same as regular registration)
  const validateTournamentForm = (): string | null => {
    if (participants.length === 0) {
      return "At least one participant is required";
    }

    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (!p.fullName.trim()) {
        return `Participant ${i + 1}: Full name is required`;
      }
      if (!p.email.trim()) {
        return `Participant ${i + 1}: Email is required`;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(p.email)) {
        return `Participant ${i + 1}: Please enter a valid email address`;
      }
      if (!p.phoneNumber.trim()) {
        return `Participant ${i + 1}: Phone number is required`;
      }
      if (p.selectedGames.length === 0) {
        return `Participant ${i + 1}: Please select at least one game`;
      }
    }

    return null;
  };

  // Submit participant with retry logic
  const submitParticipantWithRetry = async (
    participant: Participant,
    retries = 3
  ): Promise<{ success: boolean; error?: string }> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await enrollTournament({
          fullName: participant.fullName.trim(),
          email: participant.email.trim(),
          phoneNumber: participant.phoneNumber.trim(),
          tournamentId: selectedTournamentId!.toString(),
          selectedGames: participant.selectedGames,
        });
        return { success: true };
      } catch (err) {
        const apiError = err as TournamentApiError;
        const errorMessage = apiError.message || "Registration failed";

        if (attempt === retries) {
          return { success: false, error: errorMessage };
        }
        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
    return { success: false, error: "Registration failed after retries" };
  };

  // Retry failed participant
  const retryFailedParticipant = async (participant: Participant) => {
    setFailedParticipants(
      failedParticipants.filter((p) => p.id !== participant.id)
    );

    setSubmissionProgress({
      current: 0,
      total: 1,
      isSubmitting: true,
    });

    const result = await submitParticipantWithRetry(participant);
    const submissionResult: SubmissionResult = {
      participantId: participant.id,
      success: result.success,
      error: result.error,
    };
    setSubmissionResults([submissionResult]);

    if (result.success) {
      setSubmissionProgress(null);
      // Refresh registrations
      onRegistrationSuccess();
      // Check if all participants are done
      if (failedParticipants.length === 1) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      }
    } else {
      setFailedParticipants([...failedParticipants, participant]);
      setSubmissionProgress(null);
    }
  };

  // Handle tournament registration submission
  const handleTournamentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRegistrationError(null);

    // Validate form
    const validationError = validateTournamentForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check if tournament is selected
    if (!selectedTournamentId) {
      setError("Please select a tournament");
      return;
    }

    // Check if at least one game is selected
    const hasSelectedGames = participants.some(
      (p) => p.selectedGames.length > 0
    );
    if (!hasSelectedGames) {
      setError("Please select at least one game");
      return;
    }

    setIsSubmitting(true);
    setSubmissionProgress({
      current: 0,
      total: participants.length,
      isSubmitting: true,
    });
    setSubmissionResults([]);
    setFailedParticipants([]);

    const results: SubmissionResult[] = [];
    const failed: Participant[] = [];

    // Submit each participant sequentially
    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];
      setSubmissionProgress({
        current: i + 1,
        total: participants.length,
        isSubmitting: true,
      });

      const result = await submitParticipantWithRetry(participant);
      results.push({
        participantId: participant.id,
        success: result.success,
        error: result.error,
      });

      if (!result.success) {
        failed.push(participant);
      }
    }

    setSubmissionResults(results);
    setFailedParticipants(failed);
    setSubmissionProgress(null);
    setIsSubmitting(false);

    if (failed.length === 0) {
      // All registrations successful
      setSuccess(true);
      onRegistrationSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } else {
      // Some registrations failed
      setRegistrationError(
        `${failed.length} of ${participants.length} registration(s) failed. Please retry the failed ones.`
      );
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-dashed border-brand-alt/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 lg:p-8 z-[101]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>

            <div>
              {/* Title */}
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Manual Tournament Registration
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm mb-3">
                  Register users for tournaments without payment
                </p>
              </div>

              {/* Tournament Selection */}
              <div className="mb-6">
                <Label
                  htmlFor="tournament-select"
                  className="text-white mb-2 block"
                >
                  Select Tournament *
                </Label>
                {isLoadingTournaments ? (
                  <div className="p-3 bg-blue-500/20 border border-blue-500 text-blue-400 rounded-lg text-sm text-center">
                    Loading tournaments...
                  </div>
                ) : (
                  <select
                    id="tournament-select"
                    value={selectedTournamentId?.toString() || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedTournamentId(
                        value
                          ? isNaN(Number(value))
                            ? value
                            : Number(value)
                          : null
                      );
                      setParticipants([
                        {
                          id: generateParticipantId(),
                          fullName: "",
                          email: "",
                          phoneNumber: "",
                          selectedGames: [],
                        },
                      ]);
                      setError(null);
                    }}
                    className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:border-brand-alt focus:outline-none"
                  >
                    <option value="">-- Select a tournament --</option>
                    {tournaments.map((tournament) => (
                      <option key={tournament.id} value={tournament.id}>
                        {tournament.title}
                      </option>
                    ))}
                  </select>
                )}
                {selectedTournament && (
                  <p className="text-gray-400 text-sm mt-2">
                    {selectedTournament.description}
                  </p>
                )}
              </div>

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg text-center"
                >
                  <p className="font-medium">Registration Successful!</p>
                  <p className="text-sm mt-1">
                    All participants have been registered for this tournament.
                  </p>
                </motion.div>
              )}

              {/* Registration Error */}
              {registrationError && !success && (
                <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500 text-yellow-400 rounded-lg text-sm">
                  {registrationError}
                </div>
              )}

              {/* Error Message */}
              {error && !success && !registrationError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submission Progress */}
              {submissionProgress && (
                <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-blue-400 font-medium">
                      Submitting participant {submissionProgress.current} of{" "}
                      {submissionProgress.total}...
                    </p>
                    <span className="text-blue-300 text-sm">
                      {Math.round(
                        (submissionProgress.current /
                          submissionProgress.total) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (submissionProgress.current /
                            submissionProgress.total) *
                          100
                        }%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Failed Participants Retry */}
              {failedParticipants.length > 0 && !success && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                  <p className="text-red-400 font-medium mb-3">
                    Failed Registrations ({failedParticipants.length})
                  </p>
                  <div className="space-y-2">
                    {failedParticipants.map((participant) => {
                      const result = submissionResults.find(
                        (r) => r.participantId === participant.id
                      );
                      return (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-3 bg-gray-800/50 rounded"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {participant.fullName}
                            </p>
                            <p className="text-red-300 text-sm">
                              {result?.error || "Registration failed"}
                            </p>
                          </div>
                          <Button
                            onClick={() => retryFailedParticipant(participant)}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm"
                          >
                            Retry
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form */}
              {!success && (
                <form onSubmit={handleTournamentSubmit}>
                  {!selectedTournamentId ? (
                    <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500 text-yellow-400 rounded-lg text-sm text-center">
                      Please select a tournament to continue
                    </div>
                  ) : isLoadingGames ? (
                    <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 text-blue-400 rounded-lg text-sm text-center">
                      Loading tournament games...
                    </div>
                  ) : (
                    <>
                      {/* Participants */}
                      <div className="space-y-6 mb-6">
                        {participants.map((participant, index) => (
                          <div
                            key={participant.id}
                            className="p-4 sm:p-6 bg-gray-800/30 rounded-lg border border-gray-700"
                          >
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                              <h3 className="text-lg sm:text-xl font-bold text-white">
                                Participant {index + 1}
                              </h3>
                              {participants.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeParticipant(participant.id)
                                  }
                                  className="text-red-400 hover:text-red-300 text-sm"
                                >
                                  Remove
                                </button>
                              )}
                            </div>

                            <div className="space-y-3 sm:space-y-4 mb-4">
                              <div>
                                <Label
                                  htmlFor={`fullName-${participant.id}`}
                                  className="text-white mb-2 block"
                                >
                                  Full Name
                                </Label>
                                <Input
                                  id={`fullName-${participant.id}`}
                                  type="text"
                                  placeholder="Enter full name"
                                  value={participant.fullName}
                                  onChange={(e) =>
                                    updateParticipant(
                                      participant.id,
                                      "fullName",
                                      e.target.value
                                    )
                                  }
                                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                                  required
                                  disabled={
                                    !selectedTournamentId || isLoadingGames
                                  }
                                />
                              </div>

                              <div>
                                <Label
                                  htmlFor={`email-${participant.id}`}
                                  className="text-white mb-2 block"
                                >
                                  Email
                                </Label>
                                <Input
                                  id={`email-${participant.id}`}
                                  type="email"
                                  placeholder="Enter email address"
                                  value={participant.email}
                                  onChange={(e) =>
                                    updateParticipant(
                                      participant.id,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                                  required
                                  disabled={
                                    !selectedTournamentId || isLoadingGames
                                  }
                                />
                              </div>

                              <div>
                                <Label
                                  htmlFor={`phone-${participant.id}`}
                                  className="text-white mb-2 block"
                                >
                                  Phone Number
                                </Label>
                                <Input
                                  id={`phone-${participant.id}`}
                                  type="tel"
                                  placeholder="Enter phone number"
                                  value={participant.phoneNumber}
                                  onChange={(e) =>
                                    updateParticipant(
                                      participant.id,
                                      "phoneNumber",
                                      e.target.value
                                    )
                                  }
                                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                                  required
                                  disabled={
                                    !selectedTournamentId || isLoadingGames
                                  }
                                />
                              </div>
                            </div>

                            {/* Game Selection */}
                            <div>
                              <Label className="text-white mb-3 block">
                                Select Games (at least 1 required)
                              </Label>
                              {games.length === 0 ? (
                                <p className="text-gray-400 text-sm">
                                  No games available for this tournament.
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {games.map((game) => {
                                    const prize =
                                      typeof game.prize === "string"
                                        ? parseFloat(game.prize)
                                        : game.prize;
                                    const gameUuid = getGameUuid(game);
                                    const isSelected =
                                      participant.selectedGames.includes(
                                        gameUuid
                                      );
                                    return (
                                      <label
                                        key={gameUuid}
                                        className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border cursor-pointer transition-colors ${
                                          isSelected
                                            ? "bg-brand-alt/20 border-brand-alt"
                                            : "bg-gray-800/30 border-gray-700 hover:border-gray-600"
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() =>
                                            toggleGameSelection(
                                              participant.id,
                                              gameUuid
                                            )
                                          }
                                          className="mt-1 w-4 h-4 text-brand-alt border-gray-600 rounded focus:ring-brand-alt flex-shrink-0"
                                          disabled={
                                            !selectedTournamentId ||
                                            isLoadingGames
                                          }
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                                            <p className="text-white font-medium text-sm sm:text-base">
                                              {game.gameTitle}
                                            </p>
                                            <p className="text-brand-alt font-bold text-sm sm:text-base">
                                              ₦{prize.toLocaleString()}
                                            </p>
                                          </div>
                                          {game.description && (
                                            <p className="text-gray-400 text-sm mt-1">
                                              {game.description}
                                            </p>
                                          )}
                                        </div>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Participant Button */}
                      <Button
                        type="button"
                        onClick={addParticipant}
                        className="w-full mb-6 py-2 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                        disabled={!selectedTournamentId || isLoadingGames}
                      >
                        + Add Participant
                      </Button>

                      {/* Submit Button */}
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          onClick={onClose}
                          className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={
                            isSubmitting ||
                            isLoadingGames ||
                            !selectedTournamentId
                          }
                          className="flex-1 py-3 bg-brand text-brand-bg hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting
                            ? "Registering..."
                            : isLoadingGames
                            ? "Loading..."
                            : "Register Participants"}
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Render modal using portal to ensure it's centered on screen
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default ManualTournamentRegistrationModal;
