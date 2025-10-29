"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Player data interface
interface Player {
  id: string;
  name: string;
  rank: number;
  totalPoints: number;
  winLoss: { wins: number; losses: number };
  winRate: number;
  avatar: {
    background: string;
    character: string;
  };
}

// Mock data for the leaderboard
const mockPlayers: Player[] = [
  {
    id: "1",
    name: "CyberNinja_X",
    rank: 1,
    totalPoints: 15847,
    winLoss: { wins: 89, losses: 11 },
    winRate: 98,
    avatar: {
      background: "bg-blue-200",
      character: "👩‍💻",
    },
  },
  {
    id: "2",
    name: "QuantumStrike",
    rank: 2,
    totalPoints: 14923,
    winLoss: { wins: 89, losses: 11 },
    winRate: 98,
    avatar: {
      background: "bg-purple-200",
      character: "👨‍💼",
    },
  },
  {
    id: "3",
    name: "VoidHunter92",
    rank: 3,
    totalPoints: 13756,
    winLoss: { wins: 89, losses: 11 },
    winRate: 98,
    avatar: {
      background: "bg-yellow-200",
      character: "👨‍🎮",
    },
  },
];

// Rank badge component
const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-400 text-white";
      case 2:
        return "bg-gray-300 text-white";
      case 3:
        return "bg-orange-400 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div
      className={cn(
        "absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10",
        getRankStyle(rank)
      )}
    >
      {rank}
    </div>
  );
};

// Player card component
const PlayerCard: React.FC<{ player: Player; index: number }> = ({
  player,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-brand-alt/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-alt/20"
    >
      <RankBadge rank={player.rank} />

      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center text-4xl",
            player.avatar.background
          )}
        >
          {player.avatar.character}
        </div>
      </div>

      {/* Player Name */}
      <h3 className="text-brand-alt font-bold text-lg text-center mb-2">
        {player.name}
      </h3>

      {/* Total Points */}
      <div className="text-center mb-4">
        <div className="text-orange-400 font-bold text-2xl">
          {player.totalPoints.toLocaleString()}
        </div>
        <div className="text-gray-400 text-sm">Total Points</div>
      </div>

      {/* Stats Row */}
      <div className="flex justify-between text-sm text-gray-400">
        <span>
          W/L: {player.winLoss.wins}/{player.winLoss.losses}
        </span>
        <span>{player.winRate}% Win Rate</span>
      </div>
    </motion.div>
  );
};

// Main Leaderboards component
const Leaderboards: React.FC = () => {
  return (
    <section className="w-full py-16 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl font-bold"
          >
            <span className="text-white">Current </span>
            <span className="text-brand-alt">Leaderboard</span>
          </motion.h2>

          <motion.a
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            href="#"
            className="text-gray-400 hover:text-brand-alt transition-colors duration-300"
          >
            See more
          </motion.a>
        </div>

        {/* Player Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {mockPlayers.map((player, index) => (
            <PlayerCard key={player.id} player={player} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leaderboards;
