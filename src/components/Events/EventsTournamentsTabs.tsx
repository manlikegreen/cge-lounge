"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EventsTournamentsTabsProps {
  activeTab: "events" | "tournaments";
  onTabChange: (tab: "events" | "tournaments") => void;
}

const EventsTournamentsTabs: React.FC<EventsTournamentsTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex gap-2 mb-8 bg-gray-800/30 p-1 rounded-lg border border-foreground/20 w-fit">
      <button
        onClick={() => onTabChange("events")}
        className={cn(
          "px-6 py-2 rounded-md font-medium transition-all duration-300 relative",
          activeTab === "events"
            ? "text-white"
            : "text-gray-400 hover:text-gray-300"
        )}
      >
        {activeTab === "events" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-brand rounded-md"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10">Events</span>
      </button>
      <button
        onClick={() => onTabChange("tournaments")}
        className={cn(
          "px-6 py-2 rounded-md font-medium transition-all duration-300 relative",
          activeTab === "tournaments"
            ? "text-white"
            : "text-gray-400 hover:text-gray-300"
        )}
      >
        {activeTab === "tournaments" && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-brand rounded-md"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        <span className="relative z-10">Tournaments</span>
      </button>
    </div>
  );
};

export default EventsTournamentsTabs;

