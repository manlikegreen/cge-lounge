import Stats from "@/components/Dashboard/Stats";
import Leaderboards from "@/components/Dashboard/Leaderboards";
import React from "react";
import UpcomingEvents from "@/components/Home/UpcomingEvents";
import NewsUpdates from "@/components/Home/NewsUpdates";

const Dashboard = () => {
  return (
    <div className="mt-[7rem] lg:mt-[10rem]">
      <Stats />
      <Leaderboards />
      <UpcomingEvents />
      <NewsUpdates />
    </div>
  );
};

export default Dashboard;
