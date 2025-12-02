"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/UI/Button";
import CreateEventModal from "./CreateEventModal";
import { getEvents, Event } from "@/api/events/get-events";

const AdminEventSection: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventCreated = () => {
    // Refresh events list after creating a new event
    fetchEvents();
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="bg-background p-6 rounded-xl backdrop-blur container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-5xl font-bold text-brand-bg">
            Event <span className="text-brand-alt">Management</span>
          </h2>
          <Button onClick={() => setIsModalOpen(true)} className="px-6 py-3">
            Create New Event
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 text-gray-400">
            Loading events...
          </div>
        )}

        {/* Events List */}
        {!isLoading && !error && (
          <>
            {events.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-xl mb-4">No events created yet</p>
                <p className="text-sm">
                  Click &quot;Create New Event&quot; to add your first event
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0b1018] border border-foreground/20 rounded-lg p-6 backdrop-blur hover:border-brand-alt/50 transition-colors"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      {event.eventName}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-400">
                          Location:
                        </span>
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-400">
                          Event Date:
                        </span>
                        <span>{formatDate(event.endDate)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={handleEventCreated}
      />
    </>
  );
};

export default AdminEventSection;
