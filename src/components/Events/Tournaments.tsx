"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import EventsTournamentsTabs from "./EventsTournamentsTabs";
import EventsList from "./EventsList";
import TournamentsList from "./TournamentsList";
import RegistrationModal from "./RegistrationModal";

interface Tournament {
  id: string;
  title: string;
  image: string;
  status: "live" | "upcoming" | "completed";
  date: string;
  prizePool: string;
  players: string;
  gameCategory: "cod" | "fifa" | "vr";
  buttonText: string;
  buttonVariant: "live" | "register" | "details";
}

interface Event {
  id: string;
  title: string;
  image: string;
  status: "live" | "upcoming" | "completed";
  date: string;
  description: string;
  gameCategory: "cod" | "fifa" | "vr";
  buttonText: string;
  buttonVariant: "live" | "register" | "details";
}

// Dummy events data (free events)
const events: Event[] = [
  {
    id: "e1",
    title: "Gaming Expo 2024",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    status: "upcoming",
    date: "Dec 15, 2025 - 10:00 AM EST",
    description:
      "Join us for a free gaming expo featuring the latest games and equipment",
    gameCategory: "cod",
    buttonText: "Register Now",
    buttonVariant: "register",
  },
  {
    id: "e2",
    title: "VR Experience Day",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42c8a178?w=800",
    status: "upcoming",
    date: "Dec 20, 2025 - 2:00 PM EST",
    description:
      "Free VR gaming experience for all ages. Try the latest VR games!",
    gameCategory: "vr",
    buttonText: "Register Now",
    buttonVariant: "register",
  },
  {
    id: "e3",
    title: "FIFA Watch Party",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    status: "live",
    date: "Dec 12, 2025 - 6:00 PM EST",
    description: "Watch live FIFA matches with fellow gamers. Free entry!",
    gameCategory: "fifa",
    buttonText: "Join Now",
    buttonVariant: "live",
  },
  {
    id: "e4",
    title: "Gaming Community Meetup",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    status: "upcoming",
    date: "Dec 25, 2025 - 4:00 PM EST",
    description: "Connect with other gamers in our community. Free event!",
    gameCategory: "cod",
    buttonText: "Register Now",
    buttonVariant: "register",
  },
];

// Dummy tournaments data (paid tournaments)
const tournaments: Tournament[] = [
  {
    id: "1",
    title: "COD Championship Finals",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    status: "live",
    date: "Dec 15, 2024 - 8:00 PM EST",
    prizePool: "$25,000 Prize Pool",
    players: "128/128 Players",
    gameCategory: "cod",
    buttonText: "Watch live",
    buttonVariant: "live",
  },
  {
    id: "2",
    title: "FIFA Ultimate League",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    status: "upcoming",
    date: "Dec 18, 2024 - 7:00 PM EST",
    prizePool: "$15,000 Prize Pool",
    players: "89/128 Players",
    gameCategory: "fifa",
    buttonText: "Register Now",
    buttonVariant: "register",
  },
  {
    id: "3",
    title: "VR Beat Saber Masters",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42c8a178?w=800",
    status: "live",
    date: "Dec 20, 2024 - 6:00 PM EST",
    prizePool: "$8,000 Prize Pool",
    players: "45/64 Players",
    gameCategory: "vr",
    buttonText: "Register Now",
    buttonVariant: "register",
  },
  {
    id: "4",
    title: "Warzone Battle Royale",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    status: "upcoming",
    date: "Dec 22, 2024 - 9:00 PM EST",
    prizePool: "$30,000 Prize Pool",
    players: "156/200 Players",
    gameCategory: "cod",
    buttonText: "Register Now",
    buttonVariant: "register",
  },
  {
    id: "5",
    title: "FIFA World Cup Series",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    status: "completed",
    date: "Dec 10, 2024 - Completed",
    prizePool: "$20,000 Prize Pool",
    players: "128/128 Players",
    gameCategory: "fifa",
    buttonText: "See details",
    buttonVariant: "details",
  },
  {
    id: "6",
    title: "VR Racing Championship",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42c8a178?w=800",
    status: "live",
    date: "Dec 15, 2024 - 7:30 PM EST",
    prizePool: "$12,000 Prize Pool",
    players: "32/32 Players",
    gameCategory: "vr",
    buttonText: "Watch live",
    buttonVariant: "live",
  },
];

const gameCategories = [
  { id: "all", name: "All Games" },
  { id: "cod", name: "COD" },
  { id: "fifa", name: "FIFA" },
  { id: "vr", name: "VR GAMES" },
];

const eventStatuses = [
  { id: "all", name: "All Status" },
  { id: "upcoming", name: "Upcoming" },
  { id: "live", name: "Live" },
  { id: "completed", name: "Completed" },
];

const Tournaments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"events" | "tournaments">(
    "tournaments"
  );
  const [selectedGame, setSelectedGame] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationData, setRegistrationData] = useState<{
    id: string;
    title: string;
    type: "event" | "tournament";
  } | null>(null);

  const handleCloseModal = () => {
    setShowRegistrationModal(false);
    setRegistrationData(null);
  };

  // Get current items based on active tab
  const currentEvents = activeTab === "events" ? events : [];
  const currentTournaments = activeTab === "tournaments" ? tournaments : [];

  return (
    <section className="w-full py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Tabs */}
        <EventsTournamentsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Filter Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12"
        >
          {/* Game Categories */}
          <div className="flex flex-wrap gap-3">
            {gameCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedGame(category.id)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-300",
                  selectedGame === category.id
                    ? "bg-brand text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-brand-alt"
                )}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Event Statuses */}
          <div className="flex flex-wrap gap-3">
            {eventStatuses.map((status) => (
              <button
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-all duration-300",
                  selectedStatus === status.id
                    ? "bg-brand text-white"
                    : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-brand-alt"
                )}
              >
                {status.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content based on active tab */}
        {activeTab === "events" ? (
          <EventsList
            events={currentEvents}
            selectedGame={selectedGame}
            selectedStatus={selectedStatus}
          />
        ) : (
          <TournamentsList
            tournaments={currentTournaments}
            selectedGame={selectedGame}
            selectedStatus={selectedStatus}
          />
        )}

        {/* Empty State */}
        {activeTab === "events" &&
          currentEvents.filter((event) => {
            const matchesGame =
              selectedGame === "all" || event.gameCategory === selectedGame;
            const matchesStatus =
              selectedStatus === "all" || event.status === selectedStatus;
            return matchesGame && matchesStatus;
          }).length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-xl">No events found</p>
            </motion.div>
          )}

        {activeTab === "tournaments" &&
          currentTournaments.filter((tournament) => {
            const matchesGame =
              selectedGame === "all" ||
              tournament.gameCategory === selectedGame;
            const matchesStatus =
              selectedStatus === "all" || tournament.status === selectedStatus;
            return matchesGame && matchesStatus;
          }).length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-gray-400 text-xl">No tournaments found</p>
            </motion.div>
          )}
      </div>

      {/* Registration Modal */}
      {registrationData && (
        <RegistrationModal
          isOpen={showRegistrationModal}
          onClose={handleCloseModal}
          eventId={
            registrationData.type === "event" ? registrationData.id : undefined
          }
          tournamentId={
            registrationData.type === "tournament"
              ? registrationData.id
              : undefined
          }
          eventTitle={registrationData.title}
          type={registrationData.type}
          price={500000} // Dummy price: ₦5,000 in kobo (for tournaments)
        />
      )}
    </section>
  );
};

export default Tournaments;
