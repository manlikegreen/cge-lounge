"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CaretUp, CaretDown, CaretRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface Player {
  id: string;
  rank: number;
  name: string;
  team: string;
  avatarUrl: string;
  score: number;
  wins: number;
  kdRatio: number;
  winRate: number;
  streak: number;
  rankChange: "up" | "down" | "stable";
}

interface RankingsProps {
  selectedCategory: string;
}

// Generate DiceBear avatar URL from player name
const getAvatarUrl = (playerName: string) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    playerName
  )}`;
};

// Mock data for different game categories
const getPlayersByCategory = (category: string): Player[] => {
  const basePlayers: Player[] = [
    {
      id: "1",
      rank: 1,
      name: "ShadowReaper",
      team: "Team Velocity",
      avatarUrl: getAvatarUrl("ShadowReaper"),
      score: 15847,
      wins: 89,
      kdRatio: 3.42,
      winRate: 98,
      streak: 12,
      rankChange: "up",
    },
    {
      id: "2",
      rank: 2,
      name: "QuantumStrike",
      team: "Team Nexus",
      avatarUrl: getAvatarUrl("QuantumStrike"),
      score: 14923,
      wins: 87,
      kdRatio: 3.28,
      winRate: 96,
      streak: 8,
      rankChange: "down",
    },
    {
      id: "3",
      rank: 3,
      name: "VoidHunter92",
      team: "Team Apex",
      avatarUrl: getAvatarUrl("VoidHunter92"),
      score: 13756,
      wins: 82,
      kdRatio: 2.95,
      winRate: 94,
      streak: 5,
      rankChange: "down",
    },
    {
      id: "4",
      rank: 4,
      name: "NeonBlaze",
      team: "Team Storm",
      avatarUrl: getAvatarUrl("NeonBlaze"),
      score: 12984,
      wins: 78,
      kdRatio: 2.87,
      winRate: 92,
      streak: 15,
      rankChange: "up",
    },
    {
      id: "5",
      rank: 5,
      name: "CyberNinja_X",
      team: "Team Velocity",
      avatarUrl: getAvatarUrl("CyberNinja_X"),
      score: 12456,
      wins: 75,
      kdRatio: 2.73,
      winRate: 90,
      streak: 3,
      rankChange: "stable",
    },
    {
      id: "6",
      rank: 6,
      name: "ThunderBolt",
      team: "Team Lightning",
      avatarUrl: getAvatarUrl("ThunderBolt"),
      score: 11892,
      wins: 72,
      kdRatio: 2.65,
      winRate: 88,
      streak: 7,
      rankChange: "up",
    },
    {
      id: "7",
      rank: 7,
      name: "FrostByte",
      team: "Team Ice",
      avatarUrl: getAvatarUrl("FrostByte"),
      score: 11234,
      wins: 68,
      kdRatio: 2.58,
      winRate: 86,
      streak: 2,
      rankChange: "down",
    },
    {
      id: "8",
      rank: 8,
      name: "PhoenixRise",
      team: "Team Fire",
      avatarUrl: getAvatarUrl("PhoenixRise"),
      score: 10876,
      wins: 65,
      kdRatio: 2.45,
      winRate: 84,
      streak: 9,
      rankChange: "up",
    },
  ];

  // Return different players based on category
  switch (category) {
    case "fps":
      return basePlayers.slice(0, 6).map((player) => ({
        ...player,
        name: player.name + "_FPS",
        team: player.team + " FPS",
      }));
    case "racing":
      return basePlayers.slice(1, 7).map((player) => ({
        ...player,
        name: player.name + "_Racing",
        team: player.team + " Racing",
      }));
    case "strategy":
      return basePlayers.slice(2, 8).map((player) => ({
        ...player,
        name: player.name + "_Strategy",
        team: player.team + " Strategy",
      }));
    case "fighting":
      return basePlayers.slice(0, 5).map((player) => ({
        ...player,
        name: player.name + "_Fighting",
        team: player.team + " Fighting",
      }));
    default:
      return basePlayers;
  }
};

const RankingsTable: React.FC<RankingsProps> = ({ selectedCategory }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const playersPerPage = 10;

  const players = getPlayersByCategory(selectedCategory);
  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPlayers.length / playersPerPage);
  const startIndex = (currentPage - 1) * playersPerPage;
  const paginatedPlayers = filteredPlayers.slice(
    startIndex,
    startIndex + playersPerPage
  );

  const getRankChangeIcon = (change: string) => {
    switch (change) {
      case "up":
        return CaretUp;
      case "down":
        return CaretDown;
      default:
        return CaretRight;
    }
  };

  const getRankChangeColor = (change: string) => {
    switch (change) {
      case "up":
        return "text-green-400";
      case "down":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <section className="w-full py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header with Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col xl:flex-row justify-between items-center mb-8 gap-4"
        >
          <h2 className="text-2xl xl:text-4xl font-bold text-white">
            Full Rankings
          </h2>

          <div className="flex items-center gap-4 w-full xl:w-auto">
            <div className="relative flex-1 xl:flex-none">
              <input
                type="text"
                placeholder="Search Players"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-brand-alt focus:outline-none w-full xl:w-48"
              />
            </div>
            <button className="bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 hover:border-brand-alt hover:text-brand-alt transition-colors whitespace-nowrap">
              Filters
            </button>
          </div>
        </motion.div>

        {/* Rankings Table - Desktop (xl and above, > 1024px) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden xl:block bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden"
        >
          {/* Table Header */}
          <div className="bg-gray-800/50 px-6 py-4 border-b border-gray-700/50">
            <div className="grid grid-cols-7 gap-4 text-sm font-bold text-white">
              <div>Rank</div>
              <div>Player</div>
              <div>Score</div>
              <div>Wins</div>
              <div>K/D Ratio</div>
              <div>Win Rate</div>
              <div>Streak</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700/50">
            {paginatedPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-6 py-4 hover:bg-gray-800/20 transition-colors"
              >
                <div className="grid grid-cols-7 gap-4 items-center">
                  {/* Rank */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{player.rank}</span>
                    <span
                      className={cn(
                        "text-sm",
                        getRankChangeColor(player.rankChange)
                      )}
                    >
                      {(() => {
                        const IconComponent = getRankChangeIcon(
                          player.rankChange
                        );
                        return <IconComponent className="w-4 h-4" />;
                      })()}
                    </span>
                  </div>

                  {/* Player */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={player.avatarUrl}
                        alt={player.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <div className="font-medium text-brand-alt">
                        {player.name}
                      </div>
                      <div className="text-sm text-gray-400">{player.team}</div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="font-bold text-orange-400">
                    {player.score.toLocaleString()}
                  </div>

                  {/* Wins */}
                  <div className="text-white">{player.wins}</div>

                  {/* K/D Ratio */}
                  <div className="text-white">{player.kdRatio}</div>

                  {/* Win Rate */}
                  <div className="text-white">{player.winRate}%</div>

                  {/* Streak */}
                  <div className="text-white">{player.streak}W</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Rankings Cards - Mobile, Tablet, and screens ≤ 1024px */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:hidden space-y-4"
        >
          {paginatedPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-4 hover:bg-gray-800/40 transition-colors"
            >
              {/* Card Header - Rank and Player Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-lg">
                      #{player.rank}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        getRankChangeColor(player.rankChange)
                      )}
                    >
                      {(() => {
                        const IconComponent = getRankChangeIcon(
                          player.rankChange
                        );
                        return <IconComponent className="w-4 h-4" />;
                      })()}
                    </span>
                  </div>

                  {/* Player Avatar */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={player.avatarUrl}
                      alt={player.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Player Name and Team */}
                  <div>
                    <div className="font-medium text-brand-alt text-base">
                      {player.name}
                    </div>
                    <div className="text-xs text-gray-400">{player.team}</div>
                  </div>
                </div>

                {/* Score - Prominent on Mobile */}
                <div className="text-right">
                  <div className="text-xs text-gray-400 mb-1">Score</div>
                  <div className="font-bold text-orange-400 text-lg">
                    {player.score.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Wins</div>
                  <div className="text-white font-semibold">{player.wins}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">K/D Ratio</div>
                  <div className="text-white font-semibold">
                    {player.kdRatio}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Win Rate</div>
                  <div className="text-white font-semibold">
                    {player.winRate}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Streak</div>
                  <div className="text-white font-semibold">
                    {player.streak}W
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center items-center gap-4 mt-8"
        >
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-300 hover:border-brand-alt hover:text-brand-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>

          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-800/50 border border-gray-600 text-gray-300 hover:border-brand-alt hover:text-brand-alt disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default RankingsTable;
