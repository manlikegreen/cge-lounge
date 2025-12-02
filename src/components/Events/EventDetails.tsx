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
  getEventById,
  Event as BackendEvent,
} from "@/api/events/get-event-by-id";

interface EventDetails {
  id: string;
  title: string;
  image: string;
  status: "live" | "upcoming" | "completed";
  description?: string;
  location: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
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

// Map backend event to frontend details
const mapBackendEventToDetails = (backendEvent: BackendEvent): EventDetails => {
  const status = calculateStatus(backendEvent.startDate, backendEvent.endDate);

  return {
    id: backendEvent.id.toString(),
    title: backendEvent.eventName,
    image: backendEvent.banner || "",
    status,
    description: backendEvent.description,
    location: backendEvent.location,
    startDate: formatDate(backendEvent.startDate),
    endDate: formatDate(backendEvent.endDate),
    registrationDeadline: backendEvent.registrationDeadline
      ? formatDate(backendEvent.registrationDeadline)
      : formatDate(backendEvent.endDate), // Fallback to endDate if not provided
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

const EventDetails: React.FC = () => {
  const params = useParams();
  const eventId = (params?.id as string) || "";

  const [details, setDetails] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const eventData = await getEventById(eventId);
        setDetails(mapBackendEventToDetails(eventData));
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        setError("Failed to load event details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) {
      fetchDetails();
    }
  }, [eventId]);

  // Check if registration is still open
  const isRegistrationOpen = () => {
    if (!details || details.status !== "upcoming") return false;
    // Check if registration deadline has passed
    const deadline = new Date(details.registrationDeadline);
    const now = new Date();
    return now < deadline;
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
        <div className="text-gray-400 text-xl">Loading event details...</div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-400 text-xl">{error || "Event not found"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] overflow-hidden">
        <div className="mt-[8rem] lg:mt-[8rem]">
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
                  <span className="text-blue-400 font-medium text-sm">
                    EVENT
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
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span className="text-lg font-semibold">
                      {details.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{details.startDate}</span>
                  </div>
                </div>
              </div>
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
              {/* Description */}
              {details.description && (
                <InfoCard title="About This Event" index={0}>
                  <p className="text-gray-300 leading-relaxed">
                    {details.description}
                  </p>
                </InfoCard>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Key Dates */}
              <InfoCard title="Important Dates" index={1}>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-foreground/10">
                    <p className="text-gray-400 text-sm mb-1">Event Start</p>
                    <p className="text-white font-medium">
                      {details.startDate}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-lg border border-foreground/10">
                    <p className="text-gray-400 text-sm mb-1">Event End</p>
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

              {/* Location */}
              <InfoCard title="Location" index={2}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📍</span>
                  <p className="text-gray-300">{details.location}</p>
                </div>
              </InfoCard>

              {/* CTA Button */}
              <AnimationContainer animation="fadeUp" delay={0.5}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
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
                      Event Ended
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
        eventId={eventId}
        tournamentId={undefined}
        eventTitle={details.title}
        type="event"
        price={0} // Events are typically free
      />
    </div>
  );
};

export default EventDetails;
