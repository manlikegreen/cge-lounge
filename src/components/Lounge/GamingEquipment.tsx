"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GameController,
  Target,
  EyeSlash,
  Laptop,
  Joystick,
  Sparkle,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface GamingEquipment {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  category: "console" | "vr" | "pc" | "arcade";
}

const gamingEquipment: GamingEquipment[] = [
  {
    id: "1",
    name: "PlayStation 5",
    description: "Experience next-gen gaming with the latest PS5 consoles",
    icon: GameController,
    features: [
      "4K Gaming",
      "Ray Tracing",
      "SSD Storage",
      "DualSense Controller",
    ],
    category: "console",
  },
  {
    id: "2",
    name: "Xbox Series X",
    description: "Microsoft's most powerful console for ultimate gaming",
    icon: Target,
    features: ["4K Gaming", "120 FPS", "Quick Resume", "Game Pass"],
    category: "console",
  },
  {
    id: "3",
    name: "VR Gaming Setup",
    description: "Immersive virtual reality experiences with Meta Quest",
    icon: EyeSlash,
    features: ["Wireless VR", "Hand Tracking", "Room Scale", "Multiplayer VR"],
    category: "vr",
  },
  {
    id: "4",
    name: "High-End PC Gaming",
    description: "Custom-built gaming PCs with RTX graphics",
    icon: Laptop,
    features: [
      "RTX 4080",
      "32GB RAM",
      "144Hz Monitors",
      "Mechanical Keyboards",
    ],
    category: "pc",
  },
  {
    id: "5",
    name: "Arcade Classics",
    description: "Retro arcade machines and classic gaming",
    icon: Joystick,
    features: ["Street Fighter", "Pac-Man", "Donkey Kong", "Pinball"],
    category: "arcade",
  },
  {
    id: "6",
    name: "Nintendo Switch",
    description: "Portable gaming with family-friendly titles",
    icon: Sparkle,
    features: ["Mario Games", "Zelda Series", "Multiplayer", "Portable Mode"],
    category: "console",
  },
];

const GamingEquipmentCard: React.FC<{
  equipment: GamingEquipment;
  index: number;
}> = ({ equipment, index }) => {
  const getCategoryColor = () => {
    return "border-gray-500/50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "bg-gray-800/50 rounded-xl p-6 border backdrop-blur-sm",
        "hover:bg-gray-800/70 transition-all duration-300",
        "hover:shadow-lg hover:shadow-brand-alt/20 hover:border-brand-alt/50",
        getCategoryColor()
      )}
    >
      {/* Icon and Title */}
      <div className="text-center mb-4">
        <div className="flex justify-center mb-3">
          <equipment.icon className="w-12 h-12 text-brand-bg" />
        </div>
        <h3 className="text-xl font-bold text-brand-alt mb-2">
          {equipment.name}
        </h3>
        <p className="text-gray-400 text-sm">{equipment.description}</p>
      </div>

      {/* Features */}
      <div className="space-y-2">
        {equipment.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-alt rounded-full" />
            <span className="text-sm text-gray-300">{feature}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const GamingEquipment: React.FC = () => {
  return (
    <section className="w-full py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6">
            <span className="text-white">Gaming </span>
            <span className="text-brand-alt">Equipment</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            State-of-the-art gaming setups featuring the latest consoles, VR
            technology, and high-performance PCs for the ultimate gaming
            experience
          </p>
        </motion.div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {gamingEquipment.map((equipment, index) => (
            <GamingEquipmentCard
              key={equipment.id}
              equipment={equipment}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-400 mb-6">
            Ready to experience these amazing gaming setups?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-brand-alt text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-alt/90 transition-colors"
          >
            Book Your Gaming Session
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default GamingEquipment;
