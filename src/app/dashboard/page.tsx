"use client";

import Stats from "@/components/Dashboard/Stats";
import AdminGameSection from "@/components/Dashboard/AdminGameSection";
import AdminEventSection from "@/components/Dashboard/AdminEventSection";
import AdminTournamentSection from "@/components/Dashboard/AdminTournamentSection";
import Leaderboards from "@/components/Dashboard/Leaderboards";
import React, { useState, useEffect } from "react";
import UpcomingEvents from "@/components/Home/UpcomingEvents";
import NewsUpdates from "@/components/Home/NewsUpdates";
import {
  getUserProfile,
  // UserProfileResponse,
} from "@/api/profile/get-user-profile";

const Dashboard = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setUserRole(profileData.user?.role || "user");
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Default to "user" if API call fails
        setUserRole("user");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="mt-[7rem] lg:mt-[10rem] flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mt-[7rem] lg:mt-[10rem]">
      {/* Show AdminGameSection for admins, Stats for regular users */}
      {userRole === "admin" ? <AdminGameSection /> : <Stats />}
      {/* Show AdminEventSection for admins after Game Management */}
      {userRole === "admin" && <AdminEventSection />}
      {/* Show AdminTournamentSection for admins, Leaderboards for regular users */}
      {userRole === "admin" ? <AdminTournamentSection /> : <Leaderboards />}
      <UpcomingEvents />
      <NewsUpdates />
    </div>
  );
};

export default Dashboard;
