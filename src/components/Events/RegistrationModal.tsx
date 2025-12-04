"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { Button } from "../UI/Button";
import {
  enrollEvent,
  ApiError as EventApiError,
} from "@/api/events/enroll-event";
import {
  enrollTournament,
  ApiError as TournamentApiError,
} from "@/api/events/enroll-tournament";
import { getUserProfile } from "@/api/profile/get-user-profile";
import { initializePaystack, generateReference } from "@/lib/paystack";
import {
  getTournamentById,
  TournamentGame,
} from "@/api/events/get-tournaments";

type RegistrationType = "event" | "tournament";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  tournamentId?: string;
  eventTitle: string;
  type: RegistrationType;
  price?: number; // Price in kobo (for tournaments only) - deprecated, will calculate from games
}

interface Participant {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  selectedGames: string[]; // Array of game IDs as strings
}

interface SubmissionResult {
  participantId: string;
  success: boolean;
  error?: string;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  eventId,
  tournamentId,
  eventTitle,
  type,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  price: _price = 500000, // Default 5000 Naira in kobo (for tournaments) - deprecated, kept for backward compatibility
}) => {
  const router = useRouter();

  // Event registration state (simple form)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Tournament registration state
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [games, setGames] = useState<TournamentGame[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);

  // Common state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [success, setSuccess] = useState(false);

  // Tournament submission state
  const [submissionProgress, setSubmissionProgress] = useState<{
    current: number;
    total: number;
    isSubmitting: boolean;
  } | null>(null);
  const [submissionResults, setSubmissionResults] = useState<
    SubmissionResult[]
  >([]);
  const [failedParticipants, setFailedParticipants] = useState<Participant[]>(
    []
  );

  // Fetch user profile data and tournament games
  useEffect(() => {
    if (isOpen) {
      setIsLoadingUserData(true);

      const fetchData = async () => {
        try {
          // Fetch user profile
          try {
            const profileData = await getUserProfile();
            const userEmail = profileData.user?.email || "";
            const userFullName = profileData.user?.fullName || "";
            const userPhone = profileData.phoneNumber || "";

            if (type === "event") {
              // Simple event registration - use single form fields
              if (userFullName) setFullName(userFullName);
              if (userEmail) setEmail(userEmail);
              if (userPhone) setPhoneNumber(userPhone);
            } else {
              // Tournament registration - initialize first participant
              setParticipants([
                {
                  id: `participant-${Date.now()}`,
                  fullName: userFullName,
                  email: userEmail,
                  phoneNumber: userPhone,
                  selectedGames: [],
                },
              ]);
            }
          } catch {
            // Fall back to localStorage
            const userData = localStorage.getItem("user");
            if (userData) {
              try {
                const user = JSON.parse(userData);
                const fullNameFromParts = user.fullName || "";

                if (type === "event") {
                  setFullName(fullNameFromParts);
                  setEmail(user.email || "");
                  setPhoneNumber(user.phoneNumber || "");
                } else {
                  setParticipants([
                    {
                      id: `participant-${Date.now()}`,
                      fullName: fullNameFromParts,
                      email: user.email || "",
                      phoneNumber: user.phoneNumber || "",
                      selectedGames: [],
                    },
                  ]);
                }
              } catch (parseError) {
                console.error("Error parsing user data:", parseError);
              }
            }
          }

          // Fetch tournament games if tournament
          if (type === "tournament" && tournamentId) {
            setIsLoadingGames(true);
            try {
              const tournamentData = await getTournamentById(tournamentId);
              setGames(tournamentData.games || []);
            } catch (err) {
              console.error("Failed to fetch tournament games:", err);
              setError("Failed to load tournament games. Please try again.");
            } finally {
              setIsLoadingGames(false);
            }
          }
        } finally {
          setIsLoadingUserData(false);
        }
      };

      fetchData();
    }
  }, [isOpen, type, tournamentId]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setParticipants([]);
      setGames([]);
      setError(null);
      setRegistrationError(null);
      setSuccess(false);
      setIsProcessingPayment(false);
      setSubmissionProgress(null);
      setSubmissionResults([]);
      setFailedParticipants([]);
    }
  }, [isOpen]);

  // Calculate total price for tournament registration
  const calculateTotalPrice = (): number => {
    let total = 0;
    participants.forEach((participant) => {
      participant.selectedGames.forEach((gameId) => {
        const game = games.find((g) => g.id.toString() === gameId);
        if (game) {
          const prize =
            typeof game.prize === "string"
              ? parseFloat(game.prize)
              : game.prize;
          total += prize * 100; // Convert to kobo
        }
      });
    });
    return total;
  };

  // Add new participant
  const addParticipant = () => {
    setParticipants([
      ...participants,
      {
        id: `participant-${Date.now()}-${Math.random()}`,
        fullName: "",
        email: "",
        phoneNumber: "",
        selectedGames: [],
      },
    ]);
  };

  // Remove participant
  const removeParticipant = (participantId: string) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== participantId));
    }
  };

  // Update participant field
  const updateParticipant = (
    participantId: string,
    field: keyof Participant,
    value: string | string[]
  ) => {
    setParticipants(
      participants.map((p) =>
        p.id === participantId ? { ...p, [field]: value } : p
      )
    );
  };

  // Toggle game selection for participant
  const toggleGameSelection = (participantId: string, gameId: string) => {
    setParticipants(
      participants.map((p) => {
        if (p.id === participantId) {
          const selectedGames = p.selectedGames.includes(gameId)
            ? p.selectedGames.filter((id) => id !== gameId)
            : [...p.selectedGames, gameId];
          return { ...p, selectedGames };
        }
        return p;
      })
    );
  };

  // Validate tournament form
  const validateTournamentForm = (): string | null => {
    if (participants.length === 0) {
      return "At least one participant is required";
    }

    for (let i = 0; i < participants.length; i++) {
      const p = participants[i];
      if (!p.fullName.trim()) {
        return `Participant ${i + 1}: Full name is required`;
      }
      if (!p.email.trim()) {
        return `Participant ${i + 1}: Email is required`;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(p.email)) {
        return `Participant ${i + 1}: Please enter a valid email address`;
      }
      if (!p.phoneNumber.trim()) {
        return `Participant ${i + 1}: Phone number is required`;
      }
      if (p.selectedGames.length === 0) {
        return `Participant ${i + 1}: Please select at least one game`;
      }
    }

    return null;
  };

  // Submit participant with retry logic
  const submitParticipantWithRetry = async (
    participant: Participant,
    retries = 3
  ): Promise<{ success: boolean; error?: string }> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await enrollTournament({
          fullName: participant.fullName.trim(),
          email: participant.email.trim(),
          phoneNumber: participant.phoneNumber.trim(),
          tournamentId: tournamentId!,
          selectedGames: participant.selectedGames,
        });
        return { success: true };
      } catch (err) {
        const apiError = err as TournamentApiError;
        const errorMessage = apiError.message || "Registration failed";

        if (attempt === retries) {
          return { success: false, error: errorMessage };
        }
        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }
    return { success: false, error: "Registration failed after retries" };
  };

  // Handle event registration (simple)
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await enrollEvent({
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        eventId: eventId!,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 30000);
    } catch (err) {
      const apiError = err as EventApiError;
      setError(
        apiError.message || "Failed to register for event. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle tournament registration (complex)
  const handleTournamentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRegistrationError(null);

    // Validate form
    const validationError = validateTournamentForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Calculate total price
    const totalPrice = calculateTotalPrice();
    if (totalPrice === 0) {
      setError("Please select at least one game");
      return;
    }

    // Get logged-in user's email for payment
    let paymentEmail = "";
    try {
      const profileData = await getUserProfile();
      paymentEmail = profileData.user?.email || "";
    } catch {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          paymentEmail = user.email || "";
        } catch {}
      }
    }

    if (!paymentEmail && participants.length > 0) {
      paymentEmail = participants[0].email;
    }

    if (!paymentEmail) {
      setError("Email is required for payment");
      return;
    }

    // Process payment
    setIsProcessingPayment(true);
    const reference = generateReference();

    try {
      const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!paystackPublicKey) {
        throw new Error(
          "Paystack public key not configured. Please add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to your .env.local file."
        );
      }

      await initializePaystack({
        key: paystackPublicKey,
        email: paymentEmail.trim(),
        amount: totalPrice,
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Tournament",
              variable_name: "tournament_id",
              value: tournamentId!,
            },
            {
              display_name: "Participants",
              variable_name: "participants_count",
              value: participants.length.toString(),
            },
          ],
        },
      });

      // Payment successful, now register participants
      setIsProcessingPayment(false);
      setIsSubmitting(true);
      setSubmissionProgress({
        current: 0,
        total: participants.length,
        isSubmitting: true,
      });
      setSubmissionResults([]);
      setFailedParticipants([]);

      const results: SubmissionResult[] = [];
      const failed: Participant[] = [];

      // Submit each participant sequentially
      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];
        setSubmissionProgress({
          current: i + 1,
          total: participants.length,
          isSubmitting: true,
        });

        const result = await submitParticipantWithRetry(participant);
        results.push({
          participantId: participant.id,
          success: result.success,
          error: result.error,
        });

        if (!result.success) {
          failed.push(participant);
        }
      }

      setSubmissionResults(results);
      setFailedParticipants(failed);
      setSubmissionProgress(null);
      setIsSubmitting(false);

      if (failed.length === 0) {
        // All succeeded
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
          router.push(`/tournaments/${tournamentId}`);
        }, 2000);
      } else {
        // Some failed
        setRegistrationError(
          `Payment was successful, but ${failed.length} participant(s) failed to register. Please retry the failed participants.`
        );
      }
    } catch (paymentErr) {
      setIsProcessingPayment(false);
      if (
        paymentErr instanceof Error &&
        paymentErr.message === "Payment cancelled by user"
      ) {
        setError("Payment was cancelled. Please try again.");
      } else {
        const errorMessage =
          paymentErr instanceof Error
            ? paymentErr.message
            : "Payment failed. Please try again.";
        setError(errorMessage);
        console.error("Payment error:", paymentErr);
      }
    }
  };

  // Retry failed participant
  const retryFailedParticipant = async (participant: Participant) => {
    setError(null);
    setRegistrationError(null);
    setIsSubmitting(true);

    const result = await submitParticipantWithRetry(participant);

    if (result.success) {
      // Remove from failed list
      setFailedParticipants(
        failedParticipants.filter((p) => p.id !== participant.id)
      );
      // Update submission results
      setSubmissionResults(
        submissionResults.map((r) =>
          r.participantId === participant.id
            ? { ...r, success: true, error: undefined }
            : r
        )
      );

      // Check if all are now successful
      const updatedFailed = failedParticipants.filter(
        (p) => p.id !== participant.id
      );
      if (updatedFailed.length === 0) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
          router.push(`/tournaments/${tournamentId}`);
        }, 2000);
      }
    } else {
      setError(
        `Failed to register ${participant.fullName}: ${
          result.error || "Unknown error"
        }`
      );
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  const totalPrice = type === "tournament" ? calculateTotalPrice() : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-dashed border-brand-alt/50 ${
            type === "tournament"
              ? "w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 lg:p-8"
              : "w-full max-w-md p-6 sm:p-8"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>

          {type === "event" ? (
            // Simple Event Registration Form
            <div className="w-full">
              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Register for Event
                </h2>
                <p className="text-gray-300 text-sm">{eventTitle}</p>
              </div>

              {/* Success Message */}
              {success && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg text-center"
                  >
                    <p className="font-medium">Registration Successful!</p>
                    <p className="text-sm mt-1">
                      You have been registered for this event.
                    </p>
                  </motion.div>

                  {/* Tournament Banner */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4 p-4 bg-brand-alt/20 border border-brand-alt/50 rounded-lg"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex-1 text-center sm:text-left">
                        <p className="font-medium text-brand-alt mb-1">
                          Want to participate in tournaments?
                        </p>
                        <p className="text-sm text-gray-300">
                          Participate in tournaments and compete for prizes!
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          router.push("/events");
                          onClose();
                        }}
                        className="px-6 py-2 bg-brand-alt hover:bg-brand-alt/90 text-white whitespace-nowrap transition-colors"
                      >
                        View Tournaments
                      </Button>
                    </div>
                  </motion.div>
                </>
              )}

              {/* Error Message */}
              {error && !success && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Form */}
              {!success && (
                <form onSubmit={handleEventSubmit}>
                  {isLoadingUserData && (
                    <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 text-blue-400 rounded-lg text-sm text-center">
                      Loading your information...
                    </div>
                  )}
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label
                        htmlFor="fullName"
                        className="text-white mb-2 block"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                        disabled={isLoadingUserData}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-white mb-2 block">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                        disabled={isLoadingUserData}
                        required
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="phoneNumber"
                        className="text-white mb-2 block"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                        disabled={isLoadingUserData}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || isLoadingUserData}
                    className="w-full py-3 bg-brand text-brand-bg hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "Registering..."
                      : isLoadingUserData
                      ? "Loading..."
                      : "Register"}
                  </Button>
                </form>
              )}
            </div>
          ) : (
            // Tournament Registration Form
            <div className="w-full">
              {/* Title */}
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Register for Tournament
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm mb-3">
                  {eventTitle}
                </p>
                {totalPrice > 0 && (
                  <div className="inline-block px-4 py-2 bg-brand-alt/20 border border-brand-alt/50 rounded-lg">
                    <p className="text-brand-alt font-bold text-lg sm:text-xl">
                      Total: ₦{(totalPrice / 100).toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {participants.length} participant
                      {participants.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                )}
              </div>

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg text-center"
                >
                  <p className="font-medium">
                    Payment & Registration Successful!
                  </p>
                  <p className="text-sm mt-1">
                    All participants have been registered for this tournament.
                  </p>
                </motion.div>
              )}

              {/* Registration Error */}
              {registrationError && !success && (
                <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500 text-yellow-400 rounded-lg text-sm">
                  {registrationError}
                </div>
              )}

              {/* Error Message */}
              {error && !success && !registrationError && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Submission Progress */}
              {submissionProgress && (
                <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-blue-400 font-medium">
                      Submitting participant {submissionProgress.current} of{" "}
                      {submissionProgress.total}...
                    </p>
                    <span className="text-blue-300 text-sm">
                      {Math.round(
                        (submissionProgress.current /
                          submissionProgress.total) *
                          100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (submissionProgress.current /
                            submissionProgress.total) *
                          100
                        }%`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Failed Participants Retry */}
              {failedParticipants.length > 0 && !success && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                  <p className="text-red-400 font-medium mb-3">
                    Failed Registrations ({failedParticipants.length})
                  </p>
                  <div className="space-y-2">
                    {failedParticipants.map((participant) => {
                      const result = submissionResults.find(
                        (r) => r.participantId === participant.id
                      );
                      return (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between p-3 bg-gray-800/50 rounded"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {participant.fullName}
                            </p>
                            <p className="text-red-300 text-sm">
                              {result?.error || "Registration failed"}
                            </p>
                          </div>
                          <Button
                            onClick={() => retryFailedParticipant(participant)}
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm"
                          >
                            Retry
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Form */}
              {!success && (
                <form onSubmit={handleTournamentSubmit}>
                  {isLoadingUserData || isLoadingGames ? (
                    <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 text-blue-400 rounded-lg text-sm text-center">
                      {isLoadingGames
                        ? "Loading tournament games..."
                        : "Loading your information..."}
                    </div>
                  ) : (
                    <>
                      {/* Participants */}
                      <div className="space-y-6 mb-6">
                        {participants.map((participant, index) => (
                          <div
                            key={participant.id}
                            className="p-4 sm:p-6 bg-gray-800/30 rounded-lg border border-gray-700"
                          >
                            <div className="flex items-center justify-between mb-3 sm:mb-4">
                              <h3 className="text-lg sm:text-xl font-bold text-white">
                                Participant {index + 1}
                              </h3>
                              {participants.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeParticipant(participant.id)
                                  }
                                  className="text-red-400 hover:text-red-300 text-sm"
                                >
                                  Remove
                                </button>
                              )}
                            </div>

                            <div className="space-y-3 sm:space-y-4 mb-4">
                              <div>
                                <Label
                                  htmlFor={`fullName-${participant.id}`}
                                  className="text-white mb-2 block"
                                >
                                  Full Name
                                </Label>
                                <Input
                                  id={`fullName-${participant.id}`}
                                  type="text"
                                  placeholder="Enter full name"
                                  value={participant.fullName}
                                  onChange={(e) =>
                                    updateParticipant(
                                      participant.id,
                                      "fullName",
                                      e.target.value
                                    )
                                  }
                                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                                  required
                                />
                              </div>

                              <div>
                                <Label
                                  htmlFor={`email-${participant.id}`}
                                  className="text-white mb-2 block"
                                >
                                  Email
                                </Label>
                                <Input
                                  id={`email-${participant.id}`}
                                  type="email"
                                  placeholder="Enter email"
                                  value={participant.email}
                                  onChange={(e) =>
                                    updateParticipant(
                                      participant.id,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                                  required
                                />
                              </div>

                              <div>
                                <Label
                                  htmlFor={`phone-${participant.id}`}
                                  className="text-white mb-2 block"
                                >
                                  Phone Number
                                </Label>
                                <Input
                                  id={`phone-${participant.id}`}
                                  type="tel"
                                  placeholder="Enter phone number"
                                  value={participant.phoneNumber}
                                  onChange={(e) =>
                                    updateParticipant(
                                      participant.id,
                                      "phoneNumber",
                                      e.target.value
                                    )
                                  }
                                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                                  required
                                />
                              </div>
                            </div>

                            {/* Game Selection */}
                            <div>
                              <Label className="text-white mb-3 block">
                                Select Games (at least 1 required)
                              </Label>
                              {games.length === 0 ? (
                                <p className="text-gray-400 text-sm">
                                  No games available for this tournament.
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {games.map((game) => {
                                    const prize =
                                      typeof game.prize === "string"
                                        ? parseFloat(game.prize)
                                        : game.prize;
                                    const isSelected =
                                      participant.selectedGames.includes(
                                        game.id.toString()
                                      );
                                    return (
                                      <label
                                        key={game.id}
                                        className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border cursor-pointer transition-colors ${
                                          isSelected
                                            ? "bg-brand-alt/20 border-brand-alt"
                                            : "bg-gray-800/30 border-gray-700 hover:border-gray-600"
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() =>
                                            toggleGameSelection(
                                              participant.id,
                                              game.id.toString()
                                            )
                                          }
                                          className="mt-1 w-4 h-4 text-brand-alt border-gray-600 rounded focus:ring-brand-alt flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                                            <p className="text-white font-medium text-sm sm:text-base">
                                              {game.gameTitle}
                                            </p>
                                            <p className="text-brand-alt font-bold text-sm sm:text-base">
                                              ₦{prize.toLocaleString()}
                                            </p>
                                          </div>
                                          {game.description && (
                                            <p className="text-gray-400 text-sm mt-1">
                                              {game.description}
                                            </p>
                                          )}
                                        </div>
                                      </label>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add Participant Button */}
                      <Button
                        type="button"
                        onClick={addParticipant}
                        className="w-full mb-6 py-2 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                      >
                        + Add Participant
                      </Button>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={
                          isSubmitting ||
                          isLoadingUserData ||
                          isLoadingGames ||
                          isProcessingPayment
                        }
                        className="w-full py-3 bg-brand text-brand-bg hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessingPayment
                          ? "Processing Payment..."
                          : isSubmitting
                          ? "Registering..."
                          : isLoadingUserData || isLoadingGames
                          ? "Loading..."
                          : `Pay ₦${(
                              totalPrice / 100
                            ).toLocaleString()} & Register`}
                      </Button>
                    </>
                  )}
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RegistrationModal;
