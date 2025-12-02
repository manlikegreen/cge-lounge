"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import AnimationContainer from "../UI/AnimationContainer";

interface Tournament {
  id: string;
  title: string;
  image: string;
  status: "live" | "upcoming" | "completed";
  date: string;
  prizePool?: string; // Optional for now
  players?: string; // Optional for now
  gameCategory?: string; // Optional
  buttonText: string;
  buttonVariant: "live" | "register" | "details";
}

interface TournamentsListProps {
  tournaments: Tournament[];
  selectedGame: string;
  selectedStatus: string;
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "live":
      return "bg-red-500 text-white";
    case "upcoming":
      return "bg-green-500 text-white";
    case "completed":
      return "bg-gray-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// const getButtonStyles = (variant: string) => {
//   switch (variant) {
//     case "live":
//       return "bg-red-500 hover:bg-red-600 text-white";
//     case "register":
//       return "bg-brand hover:bg-brand/90 text-white";
//     case "details":
//       return "bg-gray-700 hover:bg-gray-600 text-white";
//     default:
//       return "bg-brand hover:bg-brand/90 text-white";
//   }
// };

const TournamentCard: React.FC<{
  tournament: Tournament;
  index: number;
}> = ({ tournament, index }) => {
  const router = useRouter();

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/tournaments/${tournament.id}`);
  };

  return (
    <AnimationContainer animation="fadeUp" delay={index * 0.1}>
      <Link href={`/tournaments/${tournament.id}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="relative bg-[#0b1018] border border-foreground/20 rounded-lg overflow-hidden hover:border-brand-alt/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-alt/20 group cursor-pointer"
        >
          {/* Status Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase",
                getStatusBadgeColor(tournament.status)
              )}
            >
              {tournament.status}
            </span>
          </div>

          {/* Image - Only show if image exists */}
          {tournament.image && (
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={tournament.image}
                alt={tournament.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-alt transition-colors">
              {tournament.title}
            </h3>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <span>📅</span>
                <span>{tournament.date}</span>
              </div>
              {tournament.prizePool && (
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <span>🏆</span>
                  <span>{tournament.prizePool}</span>
                </div>
              )}
              {tournament.players && (
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <span>👥</span>
                  <span>{tournament.players}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleButtonClick}
              className={cn(
                "w-full py-2 px-4 rounded-lg font-medium transition-all duration-300",
                tournament.status === "live"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              )}
            >
              {tournament.status === "live" ? "Watch Live" : "View Details"}
            </button>
          </div>
        </motion.div>
      </Link>
    </AnimationContainer>
  );
};

const TournamentsList: React.FC<TournamentsListProps> = ({
  tournaments,
  selectedGame,
  selectedStatus,
}) => {
  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesGame =
      selectedGame === "all" || tournament.gameCategory === selectedGame;
    const matchesStatus =
      selectedStatus === "all" || tournament.status === selectedStatus;
    return matchesGame && matchesStatus;
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`tournaments-${selectedGame}-${selectedStatus}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredTournaments.map((tournament, index) => (
          <TournamentCard
            key={tournament.id}
            tournament={tournament}
            index={index}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default TournamentsList;
