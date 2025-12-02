"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import EventsTournamentsTabs from "./EventsTournamentsTabs";
import EventsList from "./EventsList";
import TournamentsList from "./TournamentsList";
import RegistrationModal from "./RegistrationModal";
import { getEvents, Event as BackendEvent } from "@/api/events/get-events";
import {
  getTournaments,
  Tournament as BackendTournament,
} from "@/api/events/get-tournaments";

// Frontend interfaces matching component expectations
interface Tournament {
  id: string;
  title: string;
  image: string;
  status: "live" | "upcoming" | "completed";
  date: string;
  prizePool?: string;
  players?: string;
  gameCategory?: string; // Optional for now
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
  gameCategory?: string; // Optional for now
  buttonText: string;
  buttonVariant: "live" | "register" | "details";
}

// Helper function to calculate status from dates
const calculateStatus = (
  startDate: string,
  endDate: string
): "live" | "upcoming" | "completed" => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return "upcoming";
  } else if (now >= start && now <= end) {
    return "live";
  } else {
    return "completed";
  }
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Map backend event to frontend event
const mapBackendEventToFrontend = (backendEvent: BackendEvent): Event => {
  const status = calculateStatus(backendEvent.startDate, backendEvent.endDate);

  return {
    id: backendEvent.id.toString(),
    title: backendEvent.eventName,
    image: backendEvent.banner || "",
    status,
    date: formatDate(backendEvent.endDate),
    description: backendEvent.description,
    buttonText: status === "live" ? "Join Now" : "Register Now",
    buttonVariant: status === "live" ? "live" : "register",
  };
};

// Map backend tournament to frontend tournament
const mapBackendTournamentToFrontend = (
  backendTournament: BackendTournament
): Tournament => {
  const status = calculateStatus(
    backendTournament.event.startDate,
    backendTournament.event.endDate
  );

  return {
    id: backendTournament.id.toString(),
    title: backendTournament.title,
    image: backendTournament.banner || "",
    status,
    date: formatDate(backendTournament.event.endDate),
    buttonText: status === "live" ? "Watch live" : "View Details",
    buttonVariant: status === "live" ? "live" : "details",
  };
};

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
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationData, setRegistrationData] = useState<{
    id: string;
    title: string;
    type: "event" | "tournament";
  } | null>(null);

  // Data states
  const [events, setEvents] = useState<Event[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [eventsData, tournamentsData] = await Promise.all([
          getEvents(),
          getTournaments(),
        ]);

        setEvents(eventsData.map(mapBackendEventToFrontend));
        setTournaments(tournamentsData.map(mapBackendTournamentToFrontend));
      } catch (err) {
        console.error("Failed to fetch events/tournaments:", err);
        setError("Failed to load events and tournaments. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCloseModal = () => {
    setShowRegistrationModal(false);
    setRegistrationData(null);
  };

  // Get current items based on active tab
  const currentEvents = activeTab === "events" ? events : [];
  const currentTournaments = activeTab === "tournaments" ? tournaments : [];

  if (isLoading) {
    return (
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center py-20">
            <p className="text-red-400 text-xl">{error}</p>
          </div>
        </div>
      </section>
    );
  }

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
          className="flex flex-col md:flex-row justify-end items-center gap-6 mb-12"
        >
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
            selectedGame="all"
            selectedStatus={selectedStatus}
          />
        ) : (
          <TournamentsList
            tournaments={currentTournaments}
            selectedGame="all"
            selectedStatus={selectedStatus}
          />
        )}

        {/* Empty State */}
        {activeTab === "events" &&
          currentEvents.filter((event) => {
            const matchesStatus =
              selectedStatus === "all" || event.status === selectedStatus;
            return matchesStatus;
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
            const matchesStatus =
              selectedStatus === "all" || tournament.status === selectedStatus;
            return matchesStatus;
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
