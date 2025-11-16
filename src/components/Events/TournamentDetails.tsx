"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import AnimationContainer from "../UI/AnimationContainer";
import { Button } from "../UI/Button";
import RegistrationModal from "./RegistrationModal";

interface PrizeDistribution {
  position: string;
  amount: string;
  percentage: string;
}

interface PreviousWinner {
  year: string;
  winner: string;
  team?: string;
  prize: string;
}

interface TournamentDetails {
  id: string;
  title: string;
  image: string;
  status: "live" | "upcoming" | "completed";
  gameCategory: "cod" | "fifa" | "vr";
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
  previousWinners?: PreviousWinner[];
  brackets?: {
    round: string;
    date: string;
    format: string;
  }[];
  description?: string; // For events
  type: "event" | "tournament";
}

// Mock event data - In production, this would come from an API based on event ID
const getEventDetails = (id: string): TournamentDetails => {
  const eventData: Record<string, TournamentDetails> = {
    e1: {
      id: "e1",
      title: "Gaming Expo 2024",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
      status: "upcoming",
      gameCategory: "cod",
      description:
        "Join us for a free gaming expo featuring the latest games and equipment",
      registrationRequirements: [
        "Free entry for all ages",
        "No registration fee required",
        "Open to everyone",
      ],
      rules: [
        "Respectful behavior towards other attendees",
        "Follow venue rules and regulations",
        "No outside food or drinks",
      ],
      startDate: "December 15, 2025",
      endDate: "December 15, 2025",
      registrationDeadline: "December 14, 2025 - 11:59 PM EST",
      type: "event",
    },
    e2: {
      id: "e2",
      title: "VR Experience Day",
      image:
        "https://images.unsplash.com/photo-1593508512255-86ab42c8a178?w=1200",
      status: "upcoming",
      gameCategory: "vr",
      description:
        "Free VR gaming experience for all ages. Try the latest VR games!",
      registrationRequirements: [
        "Free entry for all ages",
        "No registration fee required",
        "Open to everyone",
      ],
      rules: [
        "Respectful behavior towards other attendees",
        "Follow venue rules and regulations",
        "VR equipment will be provided",
      ],
      startDate: "December 20, 2025",
      endDate: "December 20, 2025",
      registrationDeadline: "December 19, 2025 - 11:59 PM EST",
      type: "event",
    },
    e3: {
      id: "e3",
      title: "FIFA Watch Party",
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200",
      status: "live",
      gameCategory: "fifa",
      description: "Watch live FIFA matches with fellow gamers. Free entry!",
      registrationRequirements: [
        "Free entry for all ages",
        "No registration fee required",
        "Open to everyone",
      ],
      rules: [
        "Respectful behavior towards other attendees",
        "Follow venue rules and regulations",
      ],
      startDate: "December 12, 2025",
      endDate: "December 12, 2025",
      registrationDeadline: "December 11, 2025 - 11:59 PM EST",
      type: "event",
    },
    e4: {
      id: "e4",
      title: "Gaming Community Meetup",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
      status: "upcoming",
      gameCategory: "cod",
      description: "Connect with other gamers in our community. Free event!",
      registrationRequirements: [
        "Free entry for all ages",
        "No registration fee required",
        "Open to everyone",
      ],
      rules: [
        "Respectful behavior towards other attendees",
        "Follow venue rules and regulations",
      ],
      startDate: "December 25, 2025",
      endDate: "December 25, 2025",
      registrationDeadline: "December 24, 2025 - 11:59 PM EST",
      type: "event",
    },
  };

  return eventData[id] || eventData.e1;
};

// Mock tournament data - In production, this would come from an API based on tournament ID
const getTournamentDetails = (id: string): TournamentDetails => {
  // Base tournament details - will be customized based on ID
  const baseDetails: TournamentDetails = {
    type: "tournament",
    id: id || "1",
    title: "COD Championship Finals",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200",
    status: "live",
    gameCategory: "cod",
    prizePool: "$25,000 Prize Pool",
    totalPrizePool: 25000,
    prizeDistribution: [
      { position: "1st Place", amount: "$12,500", percentage: "50%" },
      { position: "2nd Place", amount: "$7,500", percentage: "30%" },
      { position: "3rd Place", amount: "$3,000", percentage: "12%" },
      { position: "4th Place", amount: "$1,500", percentage: "6%" },
      { position: "5th-8th Place", amount: "$250", percentage: "1%" },
    ],
    registrationRequirements: [
      "Must be 18 years or older",
      "Valid gaming account with minimum rank requirement",
      "Registration fee of $25 per team",
      "Team must consist of 4 players",
      "All players must be available for scheduled matches",
      "Stable internet connection (minimum 10 Mbps)",
      "Gaming equipment meeting tournament standards",
    ],
    tournamentFormat: "Double Elimination Bracket",
    rules: [
      "Matches are best-of-3 format until semi-finals",
      "Semi-finals and finals are best-of-5",
      "No cheating, hacking, or exploiting game bugs",
      "Players must be present 15 minutes before match time",
      "Disconnection during match may result in forfeit",
      "All decisions by tournament officials are final",
      "Respectful behavior towards opponents and staff required",
    ],
    startDate: "December 15, 2025",
    endDate: "December 17, 2025",
    registrationDeadline: "December 10, 2025 - 11:59 PM EST",
    checkInDeadline: "December 14, 2025 - 6:00 PM EST",
    maxPlayers: 128,
    currentPlayers: 128,
    previousWinners: [
      {
        year: "2024",
        winner: "Team Velocity",
        team: "Velocity",
        prize: "$20,000",
      },
      {
        year: "2023",
        winner: "Shadow Reapers",
        team: "Reapers",
        prize: "$18,000",
      },
      {
        year: "2022",
        winner: "Elite Warriors",
        team: "Warriors",
        prize: "$15,000",
      },
    ],
    brackets: [
      {
        round: "Round of 128",
        date: "Dec 15, 2025 - 8:00 AM EST",
        format: "Best of 1",
      },
      {
        round: "Round of 64",
        date: "Dec 15, 2025 - 2:00 PM EST",
        format: "Best of 1",
      },
      {
        round: "Round of 32",
        date: "Dec 16, 2025 - 10:00 AM EST",
        format: "Best of 3",
      },
      {
        round: "Round of 16",
        date: "Dec 16, 2025 - 2:00 PM EST",
        format: "Best of 3",
      },
      {
        round: "Quarter Finals",
        date: "Dec 16, 2025 - 6:00 PM EST",
        format: "Best of 3",
      },
      {
        round: "Semi Finals",
        date: "Dec 17, 2025 - 2:00 PM EST",
        format: "Best of 5",
      },
      {
        round: "Grand Finals",
        date: "Dec 17, 2025 - 8:00 PM EST",
        format: "Best of 5",
      },
    ],
  };

  // Customize based on tournament ID to match Tournaments component
  if (id === "2") {
    // FIFA Ultimate League - upcoming
    baseDetails.title = "FIFA Ultimate League";
    baseDetails.image =
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200";
    baseDetails.status = "upcoming";
    baseDetails.gameCategory = "fifa";
    baseDetails.prizePool = "$15,000 Prize Pool";
    baseDetails.totalPrizePool = 15000;
    baseDetails.startDate = "December 18, 2025";
    baseDetails.endDate = "December 20, 2025";
    baseDetails.registrationDeadline = "December 15, 2025 - 11:59 PM EST";
    baseDetails.checkInDeadline = "December 17, 2025 - 6:00 PM EST";
    baseDetails.maxPlayers = 128;
    baseDetails.currentPlayers = 89;
  } else if (id === "4") {
    // Warzone Battle Royale - upcoming
    baseDetails.title = "Warzone Battle Royale";
    baseDetails.image =
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200";
    baseDetails.status = "upcoming";
    baseDetails.gameCategory = "cod";
    baseDetails.prizePool = "$30,000 Prize Pool";
    baseDetails.totalPrizePool = 30000;
    baseDetails.startDate = "December 22, 2025";
    baseDetails.endDate = "December 24, 2025";
    baseDetails.registrationDeadline = "December 20, 2025 - 11:59 PM EST";
    baseDetails.checkInDeadline = "December 21, 2025 - 6:00 PM EST";
    baseDetails.maxPlayers = 200;
    baseDetails.currentPlayers = 156;
  } else if (id === "5") {
    // FIFA World Cup Series - completed
    baseDetails.title = "FIFA World Cup Series";
    baseDetails.image =
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200";
    baseDetails.status = "completed";
    baseDetails.gameCategory = "fifa";
    baseDetails.prizePool = "$20,000 Prize Pool";
    baseDetails.totalPrizePool = 20000;
    baseDetails.startDate = "December 10, 2024";
    baseDetails.endDate = "December 12, 2024";
    baseDetails.registrationDeadline = "December 5, 2024 - 11:59 PM EST";
    baseDetails.checkInDeadline = "December 9, 2024 - 6:00 PM EST";
    baseDetails.maxPlayers = 128;
    baseDetails.currentPlayers = 128;
  }

  return baseDetails;
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
  const itemId = (params?.id as string) || "1";

  // Determine if it's an event (starts with "e") or tournament
  const isEvent = itemId.startsWith("e");
  const details = isEvent
    ? getEventDetails(itemId)
    : getTournamentDetails(itemId);

  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Check if registration is still open
  const isRegistrationOpen = () => {
    if (details.status !== "upcoming") return false;

    // Parse registration deadline date
    const deadlineStr = details.registrationDeadline.split(" - ")[0];
    const deadlineDate = new Date(deadlineStr);
    const now = new Date();

    return now < deadlineDate;
  };

  const getStatusBadgeColor = () => {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] overflow-hidden">
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

        <div className="container mx-auto px-6 relative z-10 h-full flex flex-col justify-end pb-12">
          <AnimationContainer animation="fadeUp" delay={0.1}>
            <div className="max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <span
                  className={cn(
                    "px-4 py-1 rounded-full text-sm font-bold uppercase",
                    getStatusBadgeColor()
                  )}
                >
                  {details.status}
                </span>
                <span className="text-brand-alt font-medium">
                  {details.gameCategory.toUpperCase()}
                </span>
                {isEvent && (
                  <span className="text-blue-400 font-medium text-sm">
                    FREE EVENT
                  </span>
                )}
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
                {details.prizePool && (
                  <div className="flex items-center gap-2">
                    <span>🏆</span>
                    <span className="text-xl font-semibold">
                      {details.prizePool}
                    </span>
                  </div>
                )}
                {details.currentPlayers !== undefined &&
                  details.maxPlayers !== undefined && (
                    <div className="flex items-center gap-2">
                      <span>👥</span>
                      <span>
                        {details.currentPlayers}/{details.maxPlayers} Players
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
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Prize Distribution - Only for tournaments */}
              {details.prizeDistribution &&
                details.prizeDistribution.length > 0 && (
                  <InfoCard title="Prize Distribution" index={0}>
                    <div className="space-y-4">
                      {details.prizeDistribution.map((prize, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-foreground/10 hover:border-brand-alt/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center font-bold text-white",
                                idx === 0
                                  ? "bg-yellow-500"
                                  : idx === 1
                                  ? "bg-gray-400"
                                  : idx === 2
                                  ? "bg-orange-600"
                                  : "bg-gray-700"
                              )}
                            >
                              {idx + 1}
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {prize.position}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {prize.percentage} of prize pool
                              </p>
                            </div>
                          </div>
                          <p className="text-brand-alt text-xl font-bold">
                            {prize.amount}
                          </p>
                        </div>
                      ))}
                    </div>
                  </InfoCard>
                )}

              {/* Tournament Brackets - Only for tournaments */}
              {details.brackets && details.brackets.length > 0 && (
                <InfoCard title="Tournament Schedule & Brackets" index={1}>
                  <div className="space-y-4">
                    {details.brackets.map((bracket, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-foreground/10 hover:border-brand-alt/30 transition-colors"
                      >
                        <div>
                          <p className="text-white font-medium text-lg">
                            {bracket.round}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {bracket.date}
                          </p>
                        </div>
                        <span className="text-brand-alt font-medium">
                          {bracket.format}
                        </span>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Rules */}
              <InfoCard
                title={isEvent ? "Event Rules" : "Tournament Rules"}
                index={2}
              >
                <div className="space-y-3">
                  {details.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-brand-alt rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-300">{rule}</p>
                    </div>
                  ))}
                </div>
              </InfoCard>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Key Dates */}
              <InfoCard title="Important Dates" index={3}>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-foreground/10">
                    <p className="text-gray-400 text-sm mb-1">
                      {isEvent ? "Event Start" : "Tournament Start"}
                    </p>
                    <p className="text-white font-medium">
                      {details.startDate}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-foreground/10">
                    <p className="text-gray-400 text-sm mb-1">
                      {isEvent ? "Event End" : "Tournament End"}
                    </p>
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
                  {details.checkInDeadline && (
                    <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                      <p className="text-yellow-400 text-sm mb-1 font-medium">
                        Check-In Deadline
                      </p>
                      <p className="text-white font-medium">
                        {details.checkInDeadline}
                      </p>
                    </div>
                  )}
                </div>
              </InfoCard>

              {/* Registration Requirements */}
              <InfoCard title="Registration Requirements" index={4}>
                <div className="space-y-3">
                  {details.registrationRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-brand-alt rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">{req}</p>
                    </div>
                  ))}
                </div>
              </InfoCard>

              {/* Tournament Format - Only for tournaments */}
              {details.tournamentFormat && (
                <InfoCard title="Tournament Format" index={5}>
                  <p className="text-gray-300 mb-4">
                    {details.tournamentFormat}
                  </p>
                  <div className="p-4 bg-brand-alt/10 rounded-lg border border-brand-alt/30">
                    <p className="text-brand-alt font-medium mb-2">
                      Format Details
                    </p>
                    <p className="text-gray-300 text-sm">
                      Double elimination bracket system. Teams start in the
                      upper bracket. After a loss, teams move to the lower
                      bracket. Teams eliminated from the lower bracket are out
                      of the tournament.
                    </p>
                  </div>
                </InfoCard>
              )}

              {/* Previous Winners - Only for tournaments */}
              {details.previousWinners &&
                details.previousWinners.length > 0 && (
                  <InfoCard title="Previous Winners" index={6}>
                    <div className="space-y-4">
                      {details.previousWinners.map((winner, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-gray-800/30 rounded-lg border border-foreground/10 hover:border-brand-alt/30 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-brand-alt font-bold text-lg">
                              {winner.year}
                            </p>
                            <p className="text-white font-semibold">
                              {winner.prize}
                            </p>
                          </div>
                          <p className="text-white font-medium">
                            {winner.winner}
                          </p>
                          {winner.team && (
                            <p className="text-gray-400 text-sm">
                              {winner.team}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </InfoCard>
                )}

              {/* CTA Button */}
              <AnimationContainer animation="fadeUp" delay={0.7}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  {details.status === "upcoming" && isRegistrationOpen() ? (
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full text-lg py-6"
                      onClick={() => setShowRegistrationModal(true)}
                    >
                      Register Now
                    </Button>
                  ) : details.status === "live" ? (
                    <Button
                      variant="default"
                      size="lg"
                      className="w-full text-lg py-6 bg-red-500 hover:bg-red-600"
                    >
                      Watch Live
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full text-lg py-6"
                    >
                      View Results
                    </Button>
                  )}
                </motion.div>
              </AnimationContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        eventId={isEvent ? itemId : undefined}
        tournamentId={!isEvent ? itemId : undefined}
        eventTitle={details.title}
        type={isEvent ? "event" : "tournament"}
        price={500000} // Dummy price: ₦5,000 in kobo (for tournaments)
      />
    </div>
  );
};

export default TournamentDetails;
