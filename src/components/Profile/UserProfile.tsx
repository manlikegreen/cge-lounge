"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import DropDownIcon from "../Icons/DropDownIcon";
import {
  getUserProfile,
  UserProfileResponse,
} from "@/api/profile/get-user-profile";
import ProfileSetup from "./Profile";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  onLogout?: () => void;
}

const UserProfile = ({ onLogout }: UserProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    // Close dropdown
    setIsOpen(false);

    // Call the logout function from Navbar (which handles clearing all session data)
    if (onLogout) {
      onLogout();
    }
  };

  const handleEditProfile = () => {
    setIsOpen(false);
    setShowEditProfile(true);
  };

  const handleProfileUpdate = async () => {
    // Refresh profile data after update
    try {
      const profileData = await getUserProfile();
      setProfile(profileData);
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
    }
    setShowEditProfile(false);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  if (isLoading) {
    return <div className="w-10 h-10 rounded-full bg-gray-600 animate-pulse" />;
  }

  if (!profile) {
    return null;
  }

  const avatarUrl = profile.avatarUrl || "/default-avatar.png";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar and Arrow Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-alt/50 rounded-full transition-all duration-200 hover:opacity-80"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        {/* Avatar */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-brand-alt/50 hover:border-brand-alt transition-colors">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={profile.username || "User avatar"}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium">
              {profile.username?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>

        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <DropDownIcon className="text-brand-alt w-4 h-4" />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-48 bg-background/95 backdrop-blur-md border border-foreground/20 rounded-lg shadow-xl z-50 overflow-hidden"
            >
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-foreground/10">
                <p className="text-sm font-medium text-brand-bg truncate">
                  {profile.username || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile.user?.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={handleEditProfile}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm text-brand-bg hover:bg-brand-alt/10 transition-colors",
                    "focus:outline-none focus:bg-brand-alt/10"
                  )}
                >
                  Edit Profile
                </button>

                <button
                  onClick={handleLogout}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors",
                    "focus:outline-none focus:bg-red-500/10"
                  )}
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <ProfileSetup
        isOpen={showEditProfile}
        onClose={handleCloseEditProfile}
        onComplete={handleProfileUpdate}
        initialProfileData={profile}
      />
    </div>
  );
};

export default UserProfile;
