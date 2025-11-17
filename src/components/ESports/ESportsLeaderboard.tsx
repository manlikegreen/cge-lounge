"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  GameController,
  Crosshair,
  Car,
  Crown,
  Lightning,
  Clock,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import Leaderboards from "../Dashboard/Leaderboards";
import RankingsTable from "./Rankings";

interface GameCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const gameCategories: GameCategory[] = [
  { id: "all", name: "All Games", icon: GameController },
  { id: "fps", name: "FPS Arena", icon: Crosshair },
  { id: "racing", name: "Racing", icon: Car },
  { id: "strategy", name: "Strategy", icon: Crown },
  { id: "fighting", name: "Fighting", icon: Lightning },
];

const ESportsLeaderboard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="mt-[7rem] lg:mt-[10rem]">
      {/* Header Section */}
      <section className="w-full py-10 bg-background">
        <div className="container mx-auto px-6">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-white">CGE Esport </span>
              <span className="text-brand-alt">LEADERBOARD</span>
            </h1>
            <p className="text-xl text-gray-300">
              Compete. Dominate. Rise to Glory.
            </p>
          </motion.div>

          {/* Tournament Info and Last Updated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
          >
            {/* Live Tournament */}
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="bg-brand-alt/10 border border-brand-alt/30 rounded-lg px-4 py-2">
                <span className="text-brand-alt font-medium">
                  Live Tournament: Winter Championship 2025
                </span>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-5 h-5" />
              <span>Last Updated: 2 minutes ago</span>
            </div>
          </motion.div>

          {/* Game Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {gameCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-medium",
                    selectedCategory === category.id
                      ? "bg-purple-600 border-2 border-brand-alt text-white"
                      : "bg-gray-800/50 border-2 border-gray-600 text-gray-300 hover:border-brand-alt/50 hover:text-brand-alt"
                  )}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Top Champions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-8">Top Champions</h2>
      </motion.div>

      {/* Enhanced Leaderboards Component */}
      <Leaderboards />

      {/* Full Rankings Table */}
      <RankingsTable selectedCategory={selectedCategory} />
    </div>
  );
};

export default ESportsLeaderboard;
