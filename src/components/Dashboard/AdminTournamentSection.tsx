"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/UI/Button";
import CreateTournamentModal from "./CreateTournamentModal";
import {
  getTournaments,
  Tournament,
  TournamentEvent,
} from "@/api/events/get-tournaments";

const AdminTournamentSection: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tournamentsData = await getTournaments();
      setTournaments(tournamentsData);
    } catch (err) {
      console.error("Failed to fetch tournaments:", err);
      setError("Failed to load tournaments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleTournamentCreated = () => {
    // Refresh tournaments list after creating a new tournament
    fetchTournaments();
  };

  // Get event name from TournamentEvent object
  const getEventName = (event: TournamentEvent) => {
    return "name" in event ? event.name : "";
  };

  // Calculate total prize pool (sum of winner prizes)
  const calculateTotalPrizePool = (games: Tournament["games"]) => {
    if (!games || games.length === 0) return 0;
    return games.reduce((total, game) => {
      const winnerPrize =
        typeof game.winnerPrize === "string"
          ? parseFloat(game.winnerPrize)
          : game.winnerPrize;
      return total + winnerPrize;
    }, 0);
  };

  return (
    <>
      <div className="bg-background p-6 rounded-xl backdrop-blur container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-bold text-brand-bg">
            Tournament <span className="text-brand-alt">Management</span>
          </h2>
          <Button onClick={() => setIsModalOpen(true)} className="px-6 py-3">
            Create New Tournament
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 text-gray-400">
            Loading tournaments...
          </div>
        )}

        {/* Tournaments List */}
        {!isLoading && !error && (
          <>
            {tournaments.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-xl mb-4">No tournaments created yet</p>
                <p className="text-sm">
                  Click &quot;Create New Tournament&quot; to add your first
                  tournament
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map((tournament) => (
                  <motion.div
                    key={tournament.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0b1018] border border-foreground/20 rounded-lg p-6 backdrop-blur hover:border-brand-alt/50 transition-colors"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      {tournament.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {tournament.description}
                    </p>
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-400">
                          Event:
                        </span>
                        <span>{getEventName(tournament.event)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-400">
                          Games:
                        </span>
                        <span>{tournament.games?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-400">
                          Total Prize Pool:
                        </span>
                        <span>
                          ₦
                          {calculateTotalPrizePool(
                            tournament.games || []
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Tournament Modal */}
      <CreateTournamentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTournamentCreated={handleTournamentCreated}
      />
    </>
  );
};

export default AdminTournamentSection;
