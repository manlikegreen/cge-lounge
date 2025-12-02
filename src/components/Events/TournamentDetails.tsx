"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import AnimationContainer from "../UI/AnimationContainer";
import { Button } from "../UI/Button";
import RegistrationModal from "./RegistrationModal";
import {
  getTournamentById,
  getTournamentByTitle,
  Tournament as BackendTournament,
} from "@/api/events/get-tournaments";

interface PrizeDistribution {
  position: string;
  amount: string;
  percentage: string;
}

interface TournamentDetails {
  id: string;
  title: string;
  image: string;
  status: "live" | "upcoming" | "completed";
  gameCategory?: string;
  prizePool?: string;
  totalPrizePool?: number;
  prizeDistribution?: PrizeDistribution[];
  registrationRequirements: string[];
  tournamentFormat?: string;
  rules: string[];
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  checkInDeadline?: string;
  maxPlayers?: number;
  currentPlayers?: number;
  previousWinners?: PrizeDistribution[];
  brackets?: {
    round: string;
    date: string;
    format: string;
  }[];
  description?: string;
  type: "event" | "tournament";
  games?: Array<{
    id: number;
    gameTitle: string;
    description: string;
    requirements: string[];
    prize: number; // Entry fee
    winnerPrize: number;
  }>;
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

// Map backend tournament to frontend details
const mapBackendTournamentToDetails = (
  backendTournament: BackendTournament
): TournamentDetails => {
  const status = calculateStatus(
    backendTournament.event.startDate,
    backendTournament.event.endDate
  );

  // Calculate total prize pool from games if available (sum of winner prizes)
  const totalPrizePool = backendTournament.games?.reduce((sum, game) => {
    const winnerPrize =
      typeof game.winnerPrize === "string"
        ? parseFloat(game.winnerPrize)
        : game.winnerPrize;
    return sum + winnerPrize;
  }, 0);

  // Map games with proper structure
  const mappedGames = backendTournament.games?.map((game) => ({
    id: game.id,
    gameTitle: game.gameTitle,
    description: game.description,
    requirements: game.requirements || [],
    prize: typeof game.prize === "string" ? parseFloat(game.prize) : game.prize,
    winnerPrize:
      typeof game.winnerPrize === "string"
        ? parseFloat(game.winnerPrize)
        : game.winnerPrize,
  }));

  return {
    id: backendTournament.id.toString(),
    title: backendTournament.title,
    image: backendTournament.banner || "",
    status,
    description: backendTournament.description,
    registrationRequirements: backendTournament.requirements || [],
    rules: backendTournament.requirements || [], // Tournament-level requirements
    startDate: formatDate(backendTournament.event.startDate),
    endDate: formatDate(backendTournament.event.endDate),
    registrationDeadline: backendTournament.event.registrationDeadline
      ? formatDate(backendTournament.event.registrationDeadline)
      : formatDate(backendTournament.event.endDate), // Fallback to endDate if null
    type: "tournament",
    games: mappedGames,
    totalPrizePool,
  };
};

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  index: number;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  index,
  className,
}) => {
  return (
    <AnimationContainer animation="fadeUp" delay={index * 0.1}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={cn(
          "bg-[#0b1018] border border-foreground/20 rounded-xl p-6 backdrop-blur-sm",
          "hover:border-brand-alt/50 transition-all duration-300",
          "hover:shadow-lg hover:shadow-brand-alt/20",
          className
        )}
      >
        <h3 className="text-2xl font-bold text-brand-alt mb-4">{title}</h3>
        {children}
      </motion.div>
    </AnimationContainer>
  );
};

const TournamentDetails: React.FC = () => {
  const params = useParams();
  const tournamentId = (params?.id as string) || "";

  const [details, setDetails] = useState<TournamentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to fetch tournament by ID first, then by title if that fails
        let tournamentData: BackendTournament;
        try {
          tournamentData = await getTournamentById(tournamentId);
        } catch {
          // If ID fetch fails, try fetching by title/name
          try {
            tournamentData = await getTournamentByTitle(tournamentId);
          } catch {
            throw new Error("Tournament not found");
          }
        }
        setDetails(mapBackendTournamentToDetails(tournamentData));
      } catch (err) {
        console.error("Failed to fetch tournament details:", err);
        setError("Failed to load tournament details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (tournamentId) {
      fetchDetails();
    }
  }, [tournamentId]);

  // Check if registration is still open
  const isRegistrationOpen = () => {
    if (!details || details.status !== "upcoming") return false;
    // For now, allow registration if status is upcoming
    return true;
  };

  const getStatusBadgeColor = () => {
    if (!details) return "bg-gray-500 text-white";
    switch (details.status) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gray-400 text-xl">
          Loading tournament details...
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-400 text-xl">
          {error || "Tournament not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] pt-[8rem] pb-12 overflow-hidden">
        {details.image && (
          <div className="absolute inset-0">
            <Image
              src={details.image}
              alt={details.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
          </div>
        )}
        {!details.image && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        )}

        <div className="container mx-auto px-6 relative z-10 min-h-[60vh] flex flex-col justify-end pb-12">
          <div className="flex items-end justify-between gap-8 w-full">
            <AnimationContainer animation="fadeUp" delay={0.1}>
              <div className="max-w-4xl flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={cn(
                      "px-4 py-1 rounded-full text-sm font-bold uppercase",
                      getStatusBadgeColor()
                    )}
                  >
                    {details.status}
                  </span>
                  <span className="text-blue-400 font-medium text-sm">
                    TOURNAMENT
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                  {details.title}
                </h1>
                {details.description && (
                  <p className="text-white/80 text-lg mb-4 max-w-2xl">
                    {details.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-6 text-white/90">
                  {details.totalPrizePool && (
                    <div className="flex items-center gap-2">
                      <span>🏆</span>
                      <span className="text-xl font-semibold">
                        ₦{details.totalPrizePool.toLocaleString()} Prize Pool
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{details.startDate}</span>
                  </div>
                </div>
              </div>
            </AnimationContainer>

            {/* Registration Button */}
            <AnimationContainer animation="fadeUp" delay={0.2}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-shrink-0 ml-4 md:ml-0"
              >
                {details.status === "upcoming" && isRegistrationOpen() ? (
                  <Button
                    variant="default"
                    size="lg"
                    className="text-lg px-8 py-6 whitespace-nowrap hover:scale-100"
                    onClick={() => setShowRegistrationModal(true)}
                  >
                    Register Now
                  </Button>
                ) : details.status === "live" ? (
                  <Button
                    variant="default"
                    size="lg"
                    className="text-lg px-8 py-6 whitespace-nowrap bg-red-500 hover:bg-red-600 hover:scale-100"
                  >
                    Watch Live
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-lg px-8 py-6 whitespace-nowrap hover:scale-100"
                  >
                    View Results
                  </Button>
                )}
              </motion.div>
            </AnimationContainer>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Games List - Only for tournaments with games */}
              {details.games && details.games.length > 0 && (
                <InfoCard title="Tournament Games" index={0}>
                  <div className="space-y-6">
                    {details.games.map((game, idx) => (
                      <div
                        key={game.id || idx}
                        className="p-6 bg-gray-800/30 rounded-lg border border-foreground/10 hover:border-brand-alt/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-2">
                              {game.gameTitle}
                            </h4>
                            {game.description && (
                              <p className="text-gray-300 text-sm mb-3">
                                {game.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-brand-alt text-xl font-bold">
                              ₦{game.winnerPrize.toLocaleString()}
                            </p>
                            <p className="text-gray-400 text-xs">
                              Winner Prize
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              Fee: ₦{game.prize.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Game Rules */}
                        {game.requirements && game.requirements.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-foreground/10">
                            <p className="text-brand-alt font-semibold mb-2 text-sm">
                              Game Rules:
                            </p>
                            <div className="space-y-2">
                              {game.requirements.map((requirement, reqIdx) => (
                                <div
                                  key={reqIdx}
                                  className="flex items-start gap-2"
                                >
                                  <div className="w-1.5 h-1.5 bg-brand-alt rounded-full mt-2 flex-shrink-0" />
                                  <p className="text-gray-300 text-sm">
                                    {requirement}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Rules */}
              {details.rules && details.rules.length > 0 && (
                <InfoCard title="Tournament Rules" index={1}>
                  <div className="space-y-3">
                    {details.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-brand-alt rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-300">{rule}</p>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Key Dates */}
              <InfoCard title="Important Dates" index={2}>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-foreground/10">
                    <p className="text-gray-400 text-sm mb-1">
                      Tournament Start
                    </p>
                    <p className="text-white font-medium">
                      {details.startDate}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-foreground/10">
                    <p className="text-gray-400 text-sm mb-1">Tournament End</p>
                    <p className="text-white font-medium">{details.endDate}</p>
                  </div>
                  <div className="p-4 bg-red-500/20 rounded-lg border border-red-500/30">
                    <p className="text-red-400 text-sm mb-1 font-medium">
                      Registration Deadline
                    </p>
                    <p className="text-white font-medium">
                      {details.registrationDeadline}
                    </p>
                  </div>
                </div>
              </InfoCard>

              {/* Registration Requirements */}
              {details.registrationRequirements &&
                details.registrationRequirements.length > 0 && (
                  <InfoCard title="Registration Requirements" index={3}>
                    <div className="space-y-3">
                      {details.registrationRequirements.map((req, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-brand-alt rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-300 text-sm">{req}</p>
                        </div>
                      ))}
                    </div>
                  </InfoCard>
                )}
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        eventId={undefined}
        tournamentId={tournamentId}
        eventTitle={details.title}
        type="tournament"
        price={500000} // Dummy price: ₦5,000 in kobo (for tournaments)
      />
    </div>
  );
};

export default TournamentDetails;
