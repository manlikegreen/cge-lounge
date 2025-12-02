"use client";

import React, { useState, useEffect } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/UI/Button";
import { getEvents, Event as BackendEvent } from "@/api/events/get-events";

// Import placeholder images as fallback
import heroImg from "@/assets/Home/hero.jpg";
import brandingImg from "@/assets/Home/branding.jpg";
import productImg from "@/assets/Home/productDesignxManagement.jpg";

const placeholderImages = [heroImg, brandingImg, productImg];

type Event = {
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

// Map backend event to frontend event
const mapBackendEventToFrontend = (
  backendEvent: BackendEvent,
  index: number
): Event => {
  const status = calculateStatus(backendEvent.startDate, backendEvent.endDate);

  // Use banner if available, otherwise use placeholder images in rotation
  const imageSrc = backendEvent.banner
    ? backendEvent.banner
    : placeholderImages[index % placeholderImages.length];

  // Determine button text based on status
  const buttonText = status === "live" ? "Watch Live" : "Register";

  // Link to event details page
  const buttonLink = `/events/${backendEvent.id}`;

  return {
    id: backendEvent.id.toString(),
    imageSrc,
    title: backendEvent.eventName,
    description: backendEvent.description,
    date: formatDate(backendEvent.startDate),
    buttonText,
    buttonLink,
  };
};

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="flex flex-col rounded-xl border border-foreground/20 bg-[#0b1018] overflow-hidden hover:border-brand/30 transition-colors">
      <div className="relative w-full h-40 md:h-48">
        <Image
          src={event.imageSrc}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>
        <p className="text-sm text-white/80 mb-3 flex-grow leading-relaxed">
          {event.description}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-sm text-white/60 font-medium">
            {event.date}
          </span>
          <Link href={event.buttonLink}>
            <Button
              variant="default"
              size="default"
              className="bg-brand text-brand-bg hover:bg-brand/90 px-4 py-2 text-sm font-medium"
            >
              {event.buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

interface UpcomingEventsProps {
  className?: string;
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ className }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const eventsData = await getEvents();

        // Filter for upcoming/live events first, then map to frontend format
        const filteredAndMappedEvents = eventsData
          .filter((backendEvent) => {
            const status = calculateStatus(
              backendEvent.startDate,
              backendEvent.endDate
            );
            // Only show upcoming and live events on the home page
            return status === "upcoming" || status === "live";
          })
          .map((backendEvent, index) =>
            mapBackendEventToFrontend(backendEvent, index)
          );

        setEvents(filteredAndMappedEvents);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className={cn("container py-[5rem]", className)}>
      <div className="mb-12">
        <h3 className="text-5xl font-bold text-white mb-2">
          Upcoming <span className="text-brand-alt">Events</span>
        </h3>
        <p className="text-white/80 text-lg">
          Don&apos;t miss out on the action
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <p className="text-white/60 text-lg">Loading events...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/60 text-lg">
            No upcoming events at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
};

export default UpcomingEvents;
