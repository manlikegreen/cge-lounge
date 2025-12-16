"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getTournaments, Tournament } from "@/api/events/get-tournaments";
import {
  getTournamentRegistrations,
  TournamentRegistration,
} from "@/api/events/get-tournament-registrations";

const TournamentRegistrations: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState<
    string | number | null
  >(null);
  const [registrations, setRegistrations] = useState<TournamentRegistration[]>(
    []
  );
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tournaments on component mount
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoadingTournaments(true);
        setError(null);
        const tournamentsData = await getTournaments();
        setTournaments(tournamentsData);
      } catch (err) {
        console.error("Failed to fetch tournaments:", err);
        setError("Failed to load tournaments. Please try again.");
      } finally {
        setIsLoadingTournaments(false);
      }
    };

    fetchTournaments();
  }, []);

  // Fetch registrations when a tournament is selected
  useEffect(() => {
    if (selectedTournamentId) {
      const fetchRegistrations = async () => {
        try {
          setIsLoadingRegistrations(true);
          setError(null);
          const registrationsData = await getTournamentRegistrations(
            selectedTournamentId
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
  }, [selectedTournamentId]);

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

  // Get selected tournament details
  const selectedTournament = tournaments.find(
    (t) => t.id.toString() === selectedTournamentId?.toString()
  );

  return (
    <div className="bg-background p-6 rounded-xl backdrop-blur container mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-5xl font-bold text-brand-bg mb-2">
          Tournament <span className="text-brand-alt">Registrations</span>
        </h2>
        <p className="text-gray-400 text-sm">
          View all users registered for tournaments
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Tournament Selection */}
      {!selectedTournamentId && (
        <>
          {isLoadingTournaments ? (
            <div className="text-center py-12 text-gray-400">
              Loading tournaments...
            </div>
          ) : tournaments.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl mb-4">No tournaments available</p>
              <p className="text-sm">
                Create a tournament to start receiving registrations
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <motion.button
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setSelectedTournamentId(tournament.id)}
                  className="bg-[#0b1018] border border-foreground/20 rounded-lg p-6 backdrop-blur hover:border-brand-alt/50 transition-colors text-left w-full"
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    {tournament.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {tournament.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium text-gray-400">Event:</span>
                    <span>
                      {"name" in tournament.event ? tournament.event.name : ""}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Registrations View */}
      {selectedTournamentId && (
        <div>
          {/* Back Button and Tournament Info */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedTournamentId(null);
                setRegistrations([]);
              }}
              className="text-brand-alt hover:text-brand-bg transition-colors font-medium"
            >
              ← Back to Tournaments
            </button>
            {selectedTournament && (
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">
                  {selectedTournament.title}
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
                    No users have registered for this tournament
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
                          Payment Status
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

                          {/* Payment Status */}
                          <td className="py-4 px-4">
                            {registration.paidAt ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                Pending
                              </span>
                            )}
                            {registration.paidAt && (
                              <p className="text-gray-400 text-xs mt-1">
                                {formatDate(registration.paidAt)}
                              </p>
                            )}
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

export default TournamentRegistrations;
