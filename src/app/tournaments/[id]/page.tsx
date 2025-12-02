"use client";

import React, { Suspense } from "react";
import TournamentDetails from "@/components/Events/TournamentDetails";

const TournamentDetailsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-white">Loading tournament details...</div>
        </div>
      }
    >
      <TournamentDetails />
    </Suspense>
  );
};

export default TournamentDetailsPage;
