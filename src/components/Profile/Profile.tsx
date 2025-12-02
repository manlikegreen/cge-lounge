"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Input } from "@/components/UI/Input";
import { Label } from "@/components/UI/Label";
import { Button } from "@/components/UI/Button";
import { cn } from "@/lib/utils";
import { createProfile, ApiError } from "@/api/profile/profile";

interface ProfileSetupProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string; // Kept for backward compatibility but not used
  onComplete?: () => void;
  initialProfileData?: {
    username?: string;
    bio?: string;
    avatarUrl?: string;
    phoneNumber?: string;
    role?: "user" | "admin" | "moderator";
  } | null;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialProfileData,
}) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<"user" | "admin" | "moderator">("user");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!initialProfileData;

  // Initialize form with existing profile data or generate new avatar
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialProfileData) {
        // Pre-fill form with existing profile data
        setUsername(initialProfileData.username || "");
        setBio(initialProfileData.bio || "");
        setPhoneNumber(initialProfileData.phoneNumber || "");
        setAvatarUrl(initialProfileData.avatarUrl || "");
        setRole(initialProfileData.role || "user");
      } else {
        // Generate random avatar for new profile
        const randomSeed = Math.random().toString(36).substring(7);
        const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
        setAvatarUrl(newAvatarUrl);
        // Reset form fields for new profile
        setUsername("");
        setBio("");
        setPhoneNumber("");
        setRole("user");
      }
    } else {
      // Reset form when modal closes
      setUsername("");
      setBio("");
      setPhoneNumber("");
      setAvatarUrl("");
      setRole("user");
      setError(null);
    }
  }, [isOpen, isEditMode, initialProfileData]);

  // Regenerate avatar
  const regenerateAvatar = () => {
    console.log("🔄 Regenerating avatar...");
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`;
    console.log("✅ New avatar generated with seed:", randomSeed);
    console.log("🖼️ New Avatar URL:", newAvatarUrl);
    setAvatarUrl(newAvatarUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📝 Profile form submitted");
    setError(null);

    // Validation
    console.log("🔍 Validating form fields...");
    console.log("📋 Form values:", {
      username: username,
      phoneNumber: phoneNumber,
      bio: bio || "(empty)",
      avatarUrl: avatarUrl ? "Set" : "Not set",
      role: role,
    });

    if (!username || !phoneNumber) {
      console.warn("⚠️ Validation failed: Missing required fields");
      setError(
        "Please fill in all required fields (Username and Phone Number)"
      );
      return;
    }

    // Basic phone number validation
    if (phoneNumber.trim().length < 10) {
      console.warn("⚠️ Validation failed: Invalid phone number length");
      setError("Please enter a valid phone number");
      return;
    }

    if (!avatarUrl) {
      console.warn("⚠️ Validation failed: Avatar URL not set");
      setError("Please wait for avatar to load or regenerate it");
      return;
    }

    console.log("✅ Form validation passed");
    console.log("💾 Starting profile save process...");
    setIsSaving(true);

    try {
      const profilePayload = {
        username: username.trim(),
        bio: bio.trim() || "", // Send empty string if bio is not provided
        avatarUrl: avatarUrl,
        phoneNumber: phoneNumber.trim(),
        role: role,
      };

      // Log token state (but let ApiClient handle token initialization)
      console.log("🔐 ========== TOKEN STATE CHECK ==========");
      const tokenCheck = localStorage.getItem("token");
      console.log(
        "🔐 Token in localStorage:",
        tokenCheck ? `Found (${tokenCheck.substring(0, 20)}...)` : "NOT FOUND"
      );
      console.log(
        "🔐 Note: ApiClient will handle token initialization from localStorage or cookies"
      );

      console.log("📤 Calling createProfile API with payload:", profilePayload);

      // Call the create profile API
      const result = await createProfile(profilePayload);

      console.log("✅ Profile API call completed successfully");
      console.log("📥 API Response:", result);

      // Update user data in localStorage
      console.log("💾 Updating localStorage with profile data...");
      const userData = {
        username: username.trim(),
        bio: bio.trim() || "",
        avatar: avatarUrl,
        phoneNumber: phoneNumber.trim(),
        role: role,
        profileComplete: true,
      };

      console.log("📦 User data to store:", userData);

      const existingUser = localStorage.getItem("user");
      if (existingUser) {
        console.log("🔄 Updating existing user data in localStorage");
        const parsedUser = JSON.parse(existingUser);
        const updatedUser = { ...parsedUser, ...userData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        console.log("✅ User data updated in localStorage");
      } else {
        console.log("🆕 Creating new user data in localStorage");
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("✅ User data saved to localStorage");
      }

      console.log("🎉 Profile setup completed successfully!");

      // Call onComplete callback if provided
      if (onComplete) {
        console.log("📞 Calling onComplete callback...");
        onComplete();
      }

      // Only redirect to dashboard if it's a new profile (not edit mode)
      if (!isEditMode) {
        console.log("🔀 Redirecting to /dashboard");
        window.location.href = "/dashboard";
      } else {
        // For edit mode, just close the modal
        console.log("✅ Profile updated, closing modal");
        onClose();
      }
    } catch (err) {
      console.error("❌ Profile save failed!");
      console.error("💥 Error caught:", err);

      // Check if it's a CORS error
      let errorMessage: string;
      if (
        err instanceof TypeError &&
        (err.message.includes("Failed to fetch") ||
          err.message.includes("CORS") ||
          err.message.includes("blocked"))
      ) {
        errorMessage =
          "CORS Error: Backend needs to allow credentials. Please contact backend team to fix CORS configuration.";
      } else {
        const apiError = err as ApiError;
        errorMessage =
          apiError.message || "Failed to save profile. Please try again.";
      }

      console.error("📝 Error message to display:", errorMessage);
      setError(errorMessage);
    } finally {
      console.log("🏁 Profile save process completed");
      setIsSaving(false);
    }
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
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-gray-900/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border-2 border-dashed border-brand-alt/50 w-full max-w-2xl mx-4 z-[101]"
        >
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">
              {isEditMode ? "Edit Profile" : "Profile Set Up"}
            </h1>
            <p className="text-gray-300 text-lg">
              {isEditMode
                ? "Update your profile information"
                : "Choose your gaming avatar"}
            </p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-yellow-200 border-4 border-brand-alt/50 overflow-hidden flex items-center justify-center relative">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="text-4xl">👤</div>
                )}
              </div>
              <button
                onClick={regenerateAvatar}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-brand-alt text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-brand-alt/90 transition-colors"
              >
                Regenerate
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Username */}
              <div>
                <Label htmlFor="username" className="text-white mb-2 block">
                  Enter Username <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                />
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phoneNumber" className="text-white mb-2 block">
                  Phone Number <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-brand-alt"
                />
              </div>

              {/* Role */}
              <div className="md:col-span-2">
                <Label htmlFor="role" className="text-white mb-2 block">
                  Role <span className="text-red-400">*</span>
                </Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "user" | "admin" | "moderator")
                  }
                  className={cn(
                    "w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white",
                    "focus:border-brand-alt focus:outline-none focus:ring-2 focus:ring-brand-alt/20",
                    "cursor-pointer"
                  )}
                >
                  <option value="user" className="bg-gray-800">
                    User
                  </option>
                  <option value="admin" className="bg-gray-800">
                    Admin
                  </option>
                  <option value="moderator" className="bg-gray-800">
                    Moderator
                  </option>
                </select>
              </div>

              {/* Bio - Optional */}
              <div className="md:col-span-2">
                <Label htmlFor="bio" className="text-white mb-2 block">
                  Bio <span className="text-gray-400 text-sm">(Optional)</span>
                </Label>
                <textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className={cn(
                    "w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white",
                    "focus:border-brand-alt focus:outline-none focus:ring-2 focus:ring-brand-alt/20",
                    "placeholder:text-gray-400 resize-none"
                  )}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full md:w-auto px-12 py-3 bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : isEditMode
                  ? "Update Profile"
                  : "Save profile"}
              </Button>
            </div>
          </form>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
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

export default ProfileSetup;
