"use client";

import React from "react";
import { motion } from "framer-motion";

interface Amenity {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

const amenities: Amenity[] = [
  {
    id: "1",
    title: "Comfortable Gaming Stations",
    description: "Ergonomic seating and spacious gaming areas",
    icon: "🪑",
    features: [
      "Ergonomic Chairs",
      "Adjustable Desks",
      "Personal Space",
      "Cable Management",
    ],
  },
  {
    id: "2",
    title: "High-Speed Internet",
    description: "Ultra-fast WiFi for seamless online gaming",
    icon: "📶",
    features: [
      "Fiber Internet",
      "Low Latency",
      "Stable Connection",
      "Multiple Devices",
    ],
  },
  {
    id: "3",
    title: "Refreshments & Snacks",
    description: "Gaming fuel to keep you going",
    icon: "🍕",
    features: ["Energy Drinks", "Snacks", "Pizza Delivery", "Cold Beverages"],
  },
  {
    id: "4",
    title: "Tournament Area",
    description: "Dedicated space for competitive gaming events",
    icon: "🏆",
    features: [
      "Large Screens",
      "Spectator Seating",
      "Prize Pool",
      "Live Streaming",
    ],
  },
  {
    id: "5",
    title: "Private Gaming Rooms",
    description: "Exclusive spaces for groups and parties",
    icon: "🚪",
    features: ["Group Bookings", "Privacy", "Custom Setup", "Party Packages"],
  },
  {
    id: "6",
    title: "Gaming Library",
    description: "Access to hundreds of games across all platforms",
    icon: "📚",
    features: [
      "Latest Releases",
      "Classic Games",
      "All Platforms",
      "Free Play",
    ],
  },
];

const AmenityCard: React.FC<{ amenity: Amenity; index: number }> = ({
  amenity,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/70 hover:border-brand-alt/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-alt/20"
    >
      {/* Icon and Title */}
      <div className="text-center mb-4">
        <div className="text-4xl mb-3">{amenity.icon}</div>
        <h3 className="text-xl font-bold text-brand-alt mb-2">
          {amenity.title}
        </h3>
        <p className="text-gray-400 text-sm">{amenity.description}</p>
      </div>

      {/* Features */}
      <div className="space-y-2">
        {amenity.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-alt rounded-full" />
            <span className="text-sm text-gray-300">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const FacilityAmenities: React.FC = () => {
  return (
    <section className="w-full py-20 bg-gray-900/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6">
            <span className="text-white">Facility </span>
            <span className="text-brand-alt">Amenities</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need for the perfect gaming experience. From
            comfortable seating to high-speed internet, we&apos;ve got you
            covered
          </p>
        </motion.div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {amenities.map((amenity, index) => (
            <AmenityCard key={amenity.id} amenity={amenity} index={index} />
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-brand/20 to-brand-alt/20 rounded-xl p-8 border border-brand-alt/30">
            <h3 className="text-2xl font-bold text-brand-alt mb-4">
              More Than Just Gaming
            </h3>
            <p className="text-gray-300 text-lg max-w-4xl mx-auto">
              Our lounge is designed to be a community hub where gamers can
              connect, compete, and create lasting memories. Whether you&apos;re
              a casual player or a competitive esports enthusiast, you&apos;ll
              find your place here.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FacilityAmenities;
