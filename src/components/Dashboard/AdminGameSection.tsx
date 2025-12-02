"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/UI/Button";
import CreateGameModal from "./CreateGameModal";
import { getGames, Game } from "@/api/events/games/get-games";

const AdminGameSection: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const gamesData = await getGames();
      setGames(gamesData);
    } catch (err) {
      console.error("Failed to fetch games:", err);
      setError("Failed to load games. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleGameCreated = () => {
    // Refresh games list after creating a new game
    fetchGames();
  };

  return (
    <>
      <div className="bg-background p-6 rounded-xl backdrop-blur container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-bold text-brand-bg">
            Game <span className="text-brand-alt">Management</span>
          </h2>
          <Button onClick={() => setIsModalOpen(true)} className="px-6 py-3">
            Create New Game
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
            Loading games...
          </div>
        )}

        {/* Games List */}
        {!isLoading && !error && (
          <>
            {games.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-xl mb-4">No games created yet</p>
                <p className="text-sm">
                  Click &quot;Create New Game&quot; to add your first game
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0b1018] border border-foreground/20 rounded-lg p-6 backdrop-blur hover:border-brand-alt/50 transition-colors"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      {game.gameTitle}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {game.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{game.requirements?.length || 0} requirements</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Game Modal */}
      <CreateGameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGameCreated={handleGameCreated}
      />
    </>
  );
};

export default AdminGameSection;
