"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/UI/Input";
import { Label } from "@/components/UI/Label";
import { Button } from "@/components/UI/Button";
import { cn } from "@/lib/utils";
import { createEvent, ApiError } from "@/api/events/create-event";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated?: (eventId?: string) => void; // Callback to refresh events list, optionally with new event ID
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onEventCreated,
}) => {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen && !showSuccess) {
      setEventName("");
      setDescription("");
      setBanner("");
      setLocation("");
      setStartDate("");
      setEndDate("");
      setRegistrationDeadline("");
      setError(null);
    }
  }, [isOpen, showSuccess]);

  // Convert datetime-local format to ISO string
  const formatToISO = (dateTimeLocal: string): string => {
    if (!dateTimeLocal) return "";
    // datetime-local format: "YYYY-MM-DDTHH:mm"
    // Convert to ISO: "YYYY-MM-DDTHH:mm:ss.sssZ"
    const date = new Date(dateTimeLocal);
    return date.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!eventName.trim()) {
      setError("Event name is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (!location.trim()) {
      setError("Location is required");
      return;
    }

    if (!startDate) {
      setError("Start date is required");
      return;
    }

    if (!endDate) {
      setError("Event date is required");
      return;
    }

    if (!registrationDeadline) {
      setError("Registration deadline is required");
      return;
    }

    // Validate that endDate is after startDate
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const registrationDeadlineDateTime = new Date(registrationDeadline);

    if (endDateTime <= startDateTime) {
      setError("Event date must be after start date");
      return;
    }

    // Validate that registration deadline is before startDate and endDate
    if (registrationDeadlineDateTime >= startDateTime) {
      setError("Registration deadline must be before start date");
      return;
    }

    if (registrationDeadlineDateTime >= endDateTime) {
      setError("Registration deadline must be before end date");
      return;
    }

    setIsSaving(true);

    try {
      const eventPayload = {
        eventName: eventName.trim(),
        description: description.trim(),
        banner: banner.trim() || undefined,
        location: location.trim(),
        startDate: formatToISO(startDate),
        endDate: formatToISO(endDate),
        registrationDeadline: formatToISO(registrationDeadline),
      };

      const result = await createEvent(eventPayload);

      // Show success message briefly, then close
      setShowSuccess(true);

      // Call callback to refresh events list if provided, pass the new event ID
      if (onEventCreated) {
        const newEventId = result.data?.id?.toString();
        onEventCreated(newEventId);
      }

      // Close modal after showing success for 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        handleClose();
      }, 2000);
    } catch (err) {
      console.error("Failed to create event:", err);
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to create event. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setShowSuccess(false);
    setEventName("");
    setDescription("");
    setBanner("");
    setLocation("");
    setStartDate("");
    setEndDate("");
    setRegistrationDeadline("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        #startDate::-webkit-calendar-picker-indicator,
        #endDate::-webkit-calendar-picker-indicator,
        #registrationDeadline::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: invert(1);
          opacity: 1;
          position: absolute;
          right: 8px;
          width: 20px;
          height: 20px;
        }
        #startDate::-webkit-calendar-picker-indicator:hover,
        #endDate::-webkit-calendar-picker-indicator:hover,
        #registrationDeadline::-webkit-calendar-picker-indicator:hover {
          opacity: 0.8;
        }
        #startDate,
        #endDate,
        #registrationDeadline {
          position: relative;
          padding-right: 40px;
        }
      `,
        }}
      />
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-dashed border-brand-alt/50 w-full max-w-2xl mx-4 z-[101] max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl"
            >
              ✕
            </button>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-white mb-2">
                Create New Event
              </h1>
              <p className="text-gray-300 text-lg">
                Add a new event that can be used for tournaments
              </p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg"
              >
                <p className="font-medium text-center">
                  Event created successfully! 🎉
                </p>
              </motion.div>
            )}

            {/* Form - Hide when success is shown */}
            {!showSuccess && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6 mb-6">
                  {/* Event Name */}
                  <div>
                    <Label
                      htmlFor="eventName"
                      className="text-white mb-2 block"
                    >
                      Event Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="eventName"
                      type="text"
                      placeholder="e.g., Summer Gaming Championship"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      required
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label
                      htmlFor="description"
                      className="text-white mb-2 block"
                    >
                      Description <span className="text-red-400">*</span>
                    </Label>
                    <textarea
                      id="description"
                      placeholder="A brief description of the event..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      required
                      className={cn(
                        "w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white",
                        "focus:border-brand-alt focus:outline-none focus:ring-2 focus:ring-brand-alt/20",
                        "placeholder:text-gray-400 resize-none"
                      )}
                    />
                  </div>

                  {/* Banner URL */}
                  <div>
                    <Label htmlFor="banner" className="text-white mb-2 block">
                      Banner URL{" "}
                      <span className="text-gray-400 text-sm">(Optional)</span>
                    </Label>
                    <Input
                      id="banner"
                      type="url"
                      placeholder="https://example.com/banner.jpg"
                      value={banner}
                      onChange={(e) => setBanner(e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <Label htmlFor="location" className="text-white mb-2 block">
                      Location <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="e.g., New York City"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <Label
                      htmlFor="startDate"
                      className="text-white mb-2 block"
                    >
                      Start Date <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                    />
                  </div>

                  {/* Event Date */}
                  <div>
                    <Label htmlFor="endDate" className="text-white mb-2 block">
                      End Date <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      min={startDate || undefined}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Must be after start date
                    </p>
                  </div>

                  {/* Registration Deadline */}
                  <div>
                    <Label
                      htmlFor="registrationDeadline"
                      className="text-white mb-2 block"
                    >
                      Registration Deadline{" "}
                      <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="registrationDeadline"
                      type="datetime-local"
                      value={registrationDeadline}
                      onChange={(e) => setRegistrationDeadline(e.target.value)}
                      required
                      max={startDate || undefined}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Must be before start date and end date
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full md:w-auto px-12 py-3 bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 hover:scale-100"
                  >
                    {isSaving ? "Creating..." : "Create Event"}
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </AnimatePresence>
    </>
  );

  // Render modal using portal to ensure it's centered on screen
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default CreateEventModal;
