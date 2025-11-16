"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import AnimationContainer from "../UI/AnimationContainer";

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

interface EventsListProps {
  events: Event[];
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

const EventCard: React.FC<{
  event: Event;
  index: number;
}> = ({ event, index }) => {
  const router = useRouter();

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/events/${event.id}`);
  };

  return (
    <AnimationContainer animation="fadeUp" delay={index * 0.1}>
      <Link href={`/events/${event.id}`}>
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
                getStatusBadgeColor(event.status)
              )}
            >
              {event.status}
            </span>
          </div>

          {/* Image */}
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-alt transition-colors">
              {event.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {event.description}
            </p>

            {/* Details */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <span>📅</span>
                <span>{event.date}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleButtonClick}
              className={cn(
                "w-full py-2 px-4 rounded-lg font-medium transition-all duration-300",
                event.status === "live"
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              )}
            >
              {event.status === "live" ? "Watch Live" : "View Details"}
            </button>
          </div>
        </motion.div>
      </Link>
    </AnimationContainer>
  );
};

const EventsList: React.FC<EventsListProps> = ({
  events,
  selectedGame,
  selectedStatus,
}) => {
  const filteredEvents = events.filter((event) => {
    const matchesGame =
      selectedGame === "all" || event.gameCategory === selectedGame;
    const matchesStatus =
      selectedStatus === "all" || event.status === selectedStatus;
    return matchesGame && matchesStatus;
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`events-${selectedGame}-${selectedStatus}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredEvents.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default EventsList;
