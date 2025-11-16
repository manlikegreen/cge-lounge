"use client";

import React from "react";
import { motion } from "framer-motion";
import AnimationContainer from "../UI/AnimationContainer";

interface StatBoxProps {
  value: string;
  label: string;
  color: string;
  delay?: number;
}

const StatBox: React.FC<StatBoxProps> = ({
  value,
  label,
  color,
  delay = 0,
}) => {
  return (
    <AnimationContainer animation="fadeUp" delay={delay}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        className="bg-[#0b1018]/80 backdrop-blur-md border border-foreground/20 rounded-lg p-6 flex flex-col justify-center items-center min-h-[140px] hover:border-brand-alt/30 transition-colors"
      >
        <p
          className="text-4xl md:text-5xl font-bold text-center mb-2"
          style={{ color }}
        >
          {value}
        </p>
        <p className="text-sm md:text-base text-brand-bg/80 text-center font-medium">
          {label}
        </p>
      </motion.div>
    </AnimationContainer>
  );
};

const EventsHero: React.FC = () => {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background with dark gaming atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-indigo-900/30" />

      {/* Blurred background elements to simulate gaming figures */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Left blurred figure */}
        <motion.div
          animate={{
            x: [0, 20, 0],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />

        {/* Right blurred figure with gaming headset effect */}
        <motion.div
          animate={{
            x: [0, -20, 0],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-96 bg-gradient-to-l from-teal-500/20 to-cyan-500/20 rounded-full blur-3xl"
        />

        {/* Neon accent lights */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-1/4 w-32 h-32 bg-brand-alt/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-20 right-1/4 w-40 h-40 bg-red-500/20 rounded-full blur-2xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 py-20 mt-[5rem] lg:mt-[8rem]">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main heading */}
          <AnimationContainer animation="fadeDown" delay={0.1}>
            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-brand-alt uppercase tracking-wide"
            >
              EVENTS & TOURNAMENTS
            </motion.h1>
          </AnimationContainer>

          {/* Body text */}
          <AnimationContainer animation="fadeUp" delay={0.3}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              Compete in the most exciting gaming tournaments across COD, FIFA,
              and VR. Join thousands of players battling for glory and massive
              prize pools.
            </motion.p>
          </AnimationContainer>

          {/* Statistics boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
            <StatBox
              value="2,847"
              label="Active Players"
              color="#fbbf24" // yellow/amber
              delay={0.5}
            />
            <StatBox
              value="8,429"
              label="Registered Participants"
              color="#f97316" // orange
              delay={0.7}
            />
            <StatBox
              value="$125K"
              label="Total Prize Pool"
              color="#ffffff" // white
              delay={0.9}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsHero;
