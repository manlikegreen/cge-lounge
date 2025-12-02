"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/UI/Input";
import { Label } from "@/components/UI/Label";
import { Button } from "@/components/UI/Button";
import { cn } from "@/lib/utils";
import { createGame, ApiError } from "@/api/events/games/create-game";

interface CreateGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameCreated?: () => void; // Callback to refresh games list
}

const CreateGameModal: React.FC<CreateGameModalProps> = ({
  isOpen,
  onClose,
  onGameCreated,
}) => {
  const [gameTitle, setGameTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (isOpen && !showSuccess) {
      setGameTitle("");
      setDescription("");
      setRequirements([""]);
      setError(null);
    }
  }, [isOpen, showSuccess]);

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      const newRequirements = requirements.filter((_, i) => i !== index);
      setRequirements(newRequirements);
    }
  };

  const updateRequirement = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!gameTitle.trim()) {
      setError("Game title is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    // Filter out empty requirements
    const validRequirements = requirements.filter((req) => req.trim() !== "");

    if (validRequirements.length === 0) {
      setError("At least one requirement is required");
      return;
    }

    setIsSaving(true);

    try {
      const gamePayload = {
        gameTitle: gameTitle.trim(),
        description: description.trim(),
        requirements: validRequirements,
      };

      await createGame(gamePayload);

      // Show success message
      setShowSuccess(true);

      // Call callback to refresh games list if provided
      if (onGameCreated) {
        onGameCreated();
      }
    } catch (err) {
      console.error("Failed to create game:", err);
      const apiError = err as ApiError;
      setError(apiError.message || "Failed to create game. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setGameTitle("");
    setDescription("");
    setRequirements([""]);
    setError(null);
  };

  const handleViewGames = () => {
    setShowSuccess(false);
    onClose();
  };

  const handleClose = () => {
    setShowSuccess(false);
    setGameTitle("");
    setDescription("");
    setRequirements([""]);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
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
              Create New Game
            </h1>
            <p className="text-gray-300 text-lg">
              Add a new game that can be used in tournaments
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500 text-green-400 rounded-lg"
            >
              <p className="font-medium mb-4">Game created successfully! 🎉</p>
              <div className="flex gap-3">
                <Button
                  onClick={handleCreateAnother}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white hover:scale-100"
                >
                  Create Another Game
                </Button>
                <Button
                  onClick={handleViewGames}
                  className="flex-1 bg-brand text-brand-bg hover:bg-inherit hover:text-brand-bg hover:scale-100"
                >
                  View Games List
                </Button>
              </div>
            </motion.div>
          )}

          {/* Form - Hide when success is shown */}
          {!showSuccess && (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 mb-6">
                {/* Game Title */}
                <div>
                  <Label htmlFor="gameTitle" className="text-white mb-2 block">
                    Game Title <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="gameTitle"
                    type="text"
                    placeholder="e.g., FIFA 25"
                    value={gameTitle}
                    onChange={(e) => setGameTitle(e.target.value)}
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
                    placeholder="A brief description of the game..."
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

                {/* Requirements */}
                <div>
                  <Label className="text-white mb-2 block">
                    Requirements <span className="text-red-400">*</span>
                  </Label>
                  <div className="space-y-3">
                    {requirements.map((requirement, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          type="text"
                          placeholder={`Requirement ${index + 1}`}
                          value={requirement}
                          onChange={(e) =>
                            updateRequirement(index, e.target.value)
                          }
                          className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                        />
                        {requirements.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={addRequirement}
                      variant="ghost"
                      className="w-full border-dashed border-gray-600 hover:border-brand-alt"
                    >
                      + Add Requirement
                    </Button>
                  </div>
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
                  className="w-full md:w-auto px-12 py-3 bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
                >
                  {isSaving ? "Creating..." : "Create Game"}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  // Render modal using portal to ensure it's centered on screen
  if (typeof window !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return null;
};

export default CreateGameModal;
