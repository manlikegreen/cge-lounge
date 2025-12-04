"use client";

import React, { useState, useEffect } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/UI/Button";
import {
  getTournaments,
  Tournament as BackendTournament,
} from "@/api/events/get-tournaments";

// Import placeholder images as fallback
import heroImg from "@/assets/Home/hero.jpg";
import brandingImg from "@/assets/Home/branding.jpg";
import productImg from "@/assets/Home/productDesignxManagement.jpg";

const placeholderImages = [heroImg, brandingImg, productImg];

type Tournament = {
  id: string;
  imageSrc: string | StaticImageData;
  title: string;
  description: string;
  date: string;
  buttonText: string;
  buttonLink: string;
};

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
    month: "short",
    day: "numeric",
  });
};

// Map backend tournament to frontend tournament
const mapBackendTournamentToFrontend = (
  backendTournament: BackendTournament,
  index: number
): Tournament => {
  const status = calculateStatus(
    backendTournament.event.startDate,
    backendTournament.event.endDate
  );

  // Use banner if available, otherwise use placeholder images in rotation
  const imageSrc = backendTournament.banner
    ? backendTournament.banner
    : placeholderImages[index % placeholderImages.length];

  // Determine button text based on status
  const buttonText = status === "live" ? "Watch Live" : "Register";

  // Link to tournament details page
  const buttonLink = `/tournaments/${backendTournament.id}`;

  return {
    id: backendTournament.id.toString(),
    imageSrc,
    title: backendTournament.title,
    description: backendTournament.description,
    date: formatDate(backendTournament.event.startDate),
    buttonText,
    buttonLink,
  };
};

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  return (
    <div className="flex flex-col rounded-xl border border-foreground/20 bg-[#0b1018] overflow-hidden hover:border-brand/30 transition-colors">
      <div className="relative w-full h-40 md:h-48">
        <Image
          src={tournament.imageSrc}
          alt={tournament.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-xl font-bold text-white mb-2">
          {tournament.title}
        </h4>
        <p className="text-sm text-white/80 mb-3 flex-grow leading-relaxed">
          {tournament.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-white/60 font-medium">
            {tournament.date}
          </span>
          <Link href={tournament.buttonLink}>
            <Button
              variant="default"
              size="default"
              className="bg-brand text-brand-bg hover:bg-brand/90 px-4 py-2 text-sm font-medium"
            >
              {tournament.buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

interface UpcomingTournamentsProps {
  className?: string;
}

const UpcomingTournaments: React.FC<UpcomingTournamentsProps> = ({
  className,
}) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const tournamentsData = await getTournaments();

        // Filter for upcoming/live tournaments first, then map to frontend format
        const filteredAndMappedTournaments = tournamentsData
          .filter((backendTournament) => {
            const status = calculateStatus(
              backendTournament.event.startDate,
              backendTournament.event.endDate
            );
            // Only show upcoming and live tournaments on the home page
            return status === "upcoming" || status === "live";
          })
          .map((backendTournament, index) =>
            mapBackendTournamentToFrontend(backendTournament, index)
          );

        setTournaments(filteredAndMappedTournaments);
      } catch (err) {
        console.error("Failed to fetch tournaments:", err);
        setError("Failed to load tournaments. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <section className={cn("container py-[5rem]", className)}>
      <div className="mb-12">
        <h3 className="text-5xl font-bold text-white mb-2">
          Upcoming <span className="text-brand-alt">Tournaments</span>
        </h3>
        <p className="text-white/80 text-lg">
          Compete for prizes and glory. Register and pay the entrance fee to
          stand a chance at winning our prize pool.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <p className="text-white/60 text-lg">Loading tournaments...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      ) : tournaments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/60 text-lg">
            No upcoming tournaments at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      )}
    </section>
  );
};

export default UpcomingTournaments;
