"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getEvents, Event } from "@/api/events/get-events";
import {
  getEventRegistrations,
  EventRegistration,
} from "@/api/events/get-event-registrations";

const EventRegistrations: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<
    string | number | null
  >(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoadingEvents(true);
        setError(null);
        const eventsData = await getEvents();
        setEvents(eventsData);
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events. Please try again.");
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // Fetch registrations when an event is selected
  useEffect(() => {
    if (selectedEventId) {
      const fetchRegistrations = async () => {
        try {
          setIsLoadingRegistrations(true);
          setError(null);
          const registrationsData = await getEventRegistrations(
            selectedEventId
          );
          setRegistrations(registrationsData);
        } catch (err) {
          console.error("Failed to fetch registrations:", err);
          setError("Failed to load registrations. Please try again.");
        } finally {
          setIsLoadingRegistrations(false);
        }
      };

      fetchRegistrations();
    } else {
      setRegistrations([]);
    }
  }, [selectedEventId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get selected event details
  const selectedEvent = events.find(
    (e) => e.id.toString() === selectedEventId?.toString()
  );

  return (
    <div className="bg-background p-6 rounded-xl backdrop-blur container mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-5xl font-bold text-brand-bg mb-2">
          Event <span className="text-brand-alt">Registrations</span>
        </h2>
        <p className="text-gray-400 text-sm">
          View all users registered for events
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Event Selection */}
      {!selectedEventId && (
        <>
          {isLoadingEvents ? (
            <div className="text-center py-12 text-gray-400">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl mb-4">No events available</p>
              <p className="text-sm">
                Create an event to start receiving registrations
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <motion.button
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedEventId(event.id)}
                  className="bg-[#0b1018] border border-foreground/20 rounded-lg p-6 backdrop-blur hover:border-brand-alt/50 transition-colors text-left w-full"
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    {event.eventName}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
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
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Registrations View */}
      {selectedEventId && (
        <div>
          {/* Back Button and Event Info */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedEventId(null);
                setRegistrations([]);
              }}
              className="text-brand-alt hover:text-brand-bg transition-colors font-medium"
            >
              ← Back to Events
            </button>
            {selectedEvent && (
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">
                  {selectedEvent.eventName}
                </h3>
                <p className="text-sm text-gray-400">
                  {registrations.length} registration
                  {registrations.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoadingRegistrations && (
            <div className="text-center py-12 text-gray-400">
              Loading registrations...
            </div>
          )}

          {/* Registrations Table */}
          {!isLoadingRegistrations && (
            <>
              {registrations.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-xl mb-4">No registrations yet</p>
                  <p className="text-sm">
                    No users have registered for this event
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-foreground/20">
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400 uppercase">
                          User
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400 uppercase">
                          Contact
                        </th>
                        <th className="text-left py-4 px-4 text-sm font-semibold text-gray-400 uppercase">
                          Registered At
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((registration, index) => (
                        <motion.tr
                          key={registration.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-foreground/10 hover:bg-[#0b1018]/50 transition-colors"
                        >
                          {/* User Info */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <Image
                                src={registration.profile.avatarUrl}
                                alt={registration.fullName}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="text-white font-medium">
                                  {registration.fullName}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  @{registration.profile.username}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Contact Info */}
                          <td className="py-4 px-4">
                            <div className="space-y-1">
                              <p className="text-white text-sm">
                                {registration.email}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {registration.phoneNumber}
                              </p>
                            </div>
                          </td>

                          {/* Registration Date */}
                          <td className="py-4 px-4">
                            <p className="text-gray-300 text-sm">
                              {formatDate(registration.createdAt)}
                            </p>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EventRegistrations;
