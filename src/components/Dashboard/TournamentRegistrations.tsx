"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTournaments, Tournament } from "@/api/events/get-tournaments";
import {
  getTournamentRegistrations,
  TournamentRegistration,
} from "@/api/events/get-tournament-registrations";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { Button } from "@/components/UI/Button";
import ManualTournamentRegistrationModal from "./ManualTournamentRegistrationModal";

const TournamentRegistrations: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    string | number | null
  >(null);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>(
    []
  );
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isManualRegistrationModalOpen, setIsManualRegistrationModalOpen] =
    useState(false);

  // Generate initials from full name
  const getInitials = (fullName: string): string => {
    if (!fullName) return "??";
    const names = fullName.trim().split(/\s+/);
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Toggle row expansion
  const toggleRow = (registrationId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(registrationId)) {
        newSet.delete(registrationId);
      } else {
        newSet.add(registrationId);
      }
      return newSet;
    });
  };

  // Fetch tournaments on component mount
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoadingTournaments(true);
        setError(null);
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
  }, []);

  // Fetch registrations when a tournament is selected
  const fetchRegistrations = useCallback(async () => {
    if (!selectedTournamentId) {
      setRegistrations([]);
      return;
    }

    try {
      setIsLoadingRegistrations(true);
      setError(null);
      const registrationsData = await getTournamentRegistrations(
        selectedTournamentId
      );
      setRegistrations(registrationsData);
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
      setError("Failed to load registrations. Please try again.");
    } finally {
      setIsLoadingRegistrations(false);
    }
  }, [selectedTournamentId]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Handle manual registration success
  const handleManualRegistrationSuccess = useCallback(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get selected tournament details
  const selectedTournament = tournaments.find(
    (t) => t.id.toString() === selectedTournamentId?.toString()
  );

  return (
    <div className="bg-background p-6 rounded-xl backdrop-blur container mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-5xl font-bold text-brand-bg mb-2">
            Tournament <span className="text-brand-alt">Registrations</span>
          </h2>
          <p className="text-gray-400 text-sm">
            View all users registered for tournaments
          </p>
        </div>
        <Button
          onClick={() => setIsManualRegistrationModalOpen(true)}
          className="px-6 py-3"
        >
          Register User Manually
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Tournament Selection */}
      {!selectedTournamentId && (
        <>
          {isLoadingTournaments ? (
            <div className="text-center py-12 text-gray-400">
              Loading tournaments...
            </div>
          ) : tournaments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl mb-4">No tournaments available</p>
              <p className="text-sm">
                Create a tournament to start receiving registrations
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <motion.button
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedTournamentId(tournament.id)}
                  className="bg-[#0b1018] border border-foreground/20 rounded-lg p-6 backdrop-blur hover:border-brand-alt/50 transition-colors text-left w-full"
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    {tournament.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {tournament.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium text-gray-400">Event:</span>
                    <span>
                      {"name" in tournament.event ? tournament.event.name : ""}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Registrations View */}
      {selectedTournamentId && (
        <div>
          {/* Back Button and Tournament Info */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedTournamentId(null);
                setRegistrations([]);
              }}
              className="text-brand-alt hover:text-brand-bg transition-colors font-medium"
            >
              ← Back to Tournaments
            </button>
            {selectedTournament && (
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">
                  {selectedTournament.title}
                </h3>
                <p className="text-sm text-gray-400">
                  {registrations.length} registration
                  {registrations.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoadingRegistrations && (
            <div className="text-center py-12 text-gray-400">
              Loading registrations...
            </div>
          )}

          {/* Registrations Table */}
          {!isLoadingRegistrations && (
            <>
              {registrations.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-xl mb-4">No registrations yet</p>
                  <p className="text-sm">
                    No users have registered for this tournament
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-foreground/20">
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400 uppercase">
                          User
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400 uppercase">
                          Games
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400 uppercase">
                          Payment Status
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400 uppercase">
                          Registered At
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((registration, index) => {
                        const isExpanded = expandedRows.has(registration.id);
                        const games = registration.games || [];
                        const gamesCount = games.length;

                        return (
                          <React.Fragment key={registration.id}>
                            <motion.tr
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-foreground/10 hover:bg-[#0b1018]/50 transition-colors cursor-pointer"
                              onClick={() => toggleRow(registration.id)}
                            >
                              {/* User Info */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-brand-alt/20 flex items-center justify-center text-brand-alt font-bold text-sm">
                                    {getInitials(registration.fullName || "")}
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">
                                      {registration.fullName || "N/A"}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                      {registration.email || "N/A"}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-0.5">
                                      {registration.phoneNumber || "N/A"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Games Info */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-alt/20 text-brand-alt border border-brand-alt/30">
                                    {gamesCount}{" "}
                                    {gamesCount === 1 ? "game" : "games"}
                                  </span>
                                  {isExpanded ? (
                                    <MdExpandLess className="text-gray-400 text-lg" />
                                  ) : (
                                    <MdExpandMore className="text-gray-400 text-lg" />
                                  )}
                                </div>
                              </td>

                              {/* Payment Status */}
                              <td className="py-4 px-4">
                                {registration.paidAt ? (
                                  <>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                      Paid
                                    </span>
                                    <p className="text-gray-400 text-xs mt-1">
                                      {formatDate(registration.paidAt)}
                                    </p>
                                  </>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                    Manual
                                  </span>
                                )}
                              </td>

                              {/* Registration Date */}
                              <td className="py-4 px-4">
                                <p className="text-gray-300 text-sm">
                                  {registration.createdAt
                                    ? formatDate(registration.createdAt)
                                    : "N/A"}
                                </p>
                              </td>
                            </motion.tr>

                            {/* Expanded Games Details */}
                            <AnimatePresence>
                              {isExpanded && games.length > 0 && (
                                <motion.tr
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="border-b border-foreground/10"
                                >
                                  <td
                                    colSpan={4}
                                    className="py-4 px-4 bg-[#0b1018]/30"
                                  >
                                    <div className="space-y-3">
                                      <p className="text-sm font-semibold text-gray-400 uppercase mb-2">
                                        Registered Games
                                      </p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {games.map((game) => (
                                          <div
                                            key={game.tournamentGameId}
                                            className="bg-[#0b1018] border border-foreground/20 rounded-lg p-4"
                                          >
                                            <h4 className="text-white font-medium mb-2">
                                              {game.gameTitle || "N/A"}
                                            </h4>
                                            <div className="space-y-1 text-xs">
                                              <div className="flex justify-between">
                                                <span className="text-gray-400">
                                                  Entry Fee:
                                                </span>
                                                <span className="text-brand-alt font-medium">
                                                  ₦
                                                  {parseFloat(
                                                    game.prize || "0"
                                                  ).toLocaleString()}
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-400">
                                                  Winner Prize:
                                                </span>
                                                <span className="text-green-400 font-medium">
                                                  ₦
                                                  {parseFloat(
                                                    game.winnerPrize || "0"
                                                  ).toLocaleString()}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Manual Registration Modal */}
      <ManualTournamentRegistrationModal
        isOpen={isManualRegistrationModalOpen}
        onClose={() => setIsManualRegistrationModalOpen(false)}
        onRegistrationSuccess={handleManualRegistrationSuccess}
      />
    </div>
  );
};

export default TournamentRegistrations;
