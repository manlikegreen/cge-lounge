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

type RegistrationType = "event" | "tournament";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId?: string;
  tournamentId?: string;
  eventTitle: string;
  type: RegistrationType;
  price?: number; // Price in kobo (for tournaments only)
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  eventId,
  tournamentId,
  eventTitle,
  type,
  price = 500000, // Default 5000 Naira in kobo (for tournaments)
}) => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(
    null
  );
  const [success, setSuccess] = useState(false);

  // Fetch user profile data from API and load from localStorage
  useEffect(() => {
    if (isOpen) {
      setIsLoadingUserData(true);

      // First, try to fetch from API to get the most up-to-date profile
      const fetchUserProfile = async () => {
        try {
          const profileData = await getUserProfile();

          // Use profile data from API
          if (profileData.user?.fullName) {
            setFullName(profileData.user.fullName);
          }
          if (profileData.user?.email) {
            setEmail(profileData.user.email);
          }
          if (profileData.phoneNumber) {
            setPhoneNumber(profileData.phoneNumber);
          }
        } catch {
          // If API fails, fall back to localStorage
          console.log("Could not fetch profile from API, using localStorage");

          const userData = localStorage.getItem("user");
          if (userData) {
            try {
              const user = JSON.parse(userData);

              // Construct fullName from firstName and lastName if available
              const firstName = user.firstName || "";
              const lastName = user.lastName || "";
              const fullNameFromParts =
                firstName && lastName
                  ? `${firstName} ${lastName}`
                  : firstName || "";

              setFullName(user.fullName || fullNameFromParts || "");
              setEmail(user.email || "");
              setPhoneNumber(user.phoneNumber || "");
            } catch (parseError) {
              console.error(
                "Error parsing user data from localStorage:",
                parseError
              );
            }
          }
        } finally {
          setIsLoadingUserData(false);
        }
      };

      fetchUserProfile();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setError(null);
      setRegistrationError(null);
      setSuccess(false);
      setIsProcessingPayment(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRegistrationError(null);

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }

    // For events, register directly
    if (type === "event") {
      setIsSubmitting(true);
      try {
        await enrollEvent({
          fullName: fullName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          eventId: eventId!,
        });

        // Show success message
        setSuccess(true);

        // Close modal after 2 seconds
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      } catch (err) {
        const apiError = err as EventApiError;
        setError(
          apiError.message || "Failed to register for event. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // For tournaments, process payment first
    if (type === "tournament") {
      setIsProcessingPayment(true);
      const reference = generateReference();

      try {
        // Initialize Paystack payment
        const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
        if (!paystackPublicKey) {
          throw new Error(
            "Paystack public key not configured. Please add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY to your .env.local file."
          );
        }

        const paymentResponse = await initializePaystack({
          key: paystackPublicKey,
          email: email.trim(),
          amount: price, // Amount in kobo
          ref: reference,
          metadata: {
            custom_fields: [
              {
                display_name: "Full Name",
                variable_name: "full_name",
                value: fullName.trim(),
              },
              {
                display_name: "Phone Number",
                variable_name: "phone_number",
                value: phoneNumber.trim(),
              },
            ],
          },
        });

        // Payment successful, now register for tournament
        setIsProcessingPayment(false);
        setIsSubmitting(true);

        try {
          await enrollTournament({
            fullName: fullName.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            tournamentId: tournamentId!,
          });

          // Show success message
          setSuccess(true);

          // Redirect to tournament details page after 2 seconds
          setTimeout(() => {
            setSuccess(false);
            onClose();
            router.push(`/events/${tournamentId}`);
          }, 2000);
        } catch (registrationErr) {
          // Payment succeeded but registration failed
          const apiError = registrationErr as TournamentApiError;
          setRegistrationError(
            `Payment was successful, but registration failed. Please contact admin with your payment reference: ${
              paymentResponse.reference
            }. Error: ${apiError.message || "Unknown error"}`
          );
          setIsSubmitting(false);
        }
      } catch (paymentErr) {
        // Payment failed or was cancelled
        setIsProcessingPayment(false);
        if (
          paymentErr instanceof Error &&
          paymentErr.message === "Payment cancelled by user"
        ) {
          setError("Payment was cancelled. Please try again.");
        } else {
          // Show the actual error message for debugging
          const errorMessage =
            paymentErr instanceof Error
              ? paymentErr.message
              : "Payment failed. Please try again.";
          setError(errorMessage);
          console.error("Payment error:", paymentErr);
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
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
          className="relative bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-dashed border-brand-alt/50 w-full max-w-md mx-4"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              Register for {type === "tournament" ? "Tournament" : "Event"}
            </h2>
            <p className="text-gray-300 text-sm">{eventTitle}</p>
            {type === "tournament" && (
              <p className="text-brand-alt text-sm mt-2 font-medium">
                Registration Fee: ₦{(price / 100).toLocaleString()}
              </p>
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
                {type === "tournament"
                  ? "Payment & Registration Successful!"
                  : "Registration Successful!"}
              </p>
              <p className="text-sm mt-1">
                {type === "tournament"
                  ? "You have been registered for this tournament."
                  : "You have been registered for this event."}
              </p>
            </motion.div>
          )}

          {/* Registration Error (Payment succeeded but registration failed) */}
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

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit}>
              {isLoadingUserData && (
                <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 text-blue-400 rounded-lg text-sm text-center">
                  Loading your information...
                </div>
              )}
              <div className="space-y-4 mb-6">
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName" className="text-white mb-2 block">
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

                {/* Email */}
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

                {/* Phone Number */}
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  isSubmitting || isLoadingUserData || isProcessingPayment
                }
                className="w-full py-3 bg-brand text-brand-bg hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessingPayment
                  ? "Processing Payment..."
                  : isSubmitting
                  ? "Registering..."
                  : isLoadingUserData
                  ? "Loading..."
                  : type === "tournament"
                  ? `Pay ₦${(price / 100).toLocaleString()} & Register`
                  : "Register"}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RegistrationModal;
