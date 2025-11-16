"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "../UI/Button";

const LoungeHero: React.FC = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background with gaming-themed gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand/20 via-background to-brand-alt/10" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-40 left-10 w-32 h-32 bg-brand-alt/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-40 right-10 w-40 h-40 bg-brand/10 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 mt-[8rem] lg:mt-[9rem]">
              <span className="text-white">CGE </span>
              <span className="text-brand-alt">Lounge</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the ultimate gaming destination at Bonny Island&apos;s
              premier esports lounge
            </p>
          </motion.div>

          {/* Gaming icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center items-center gap-8 mb-12 flex-wrap"
          >
            <div className="text-4xl">🎮</div>
            <div className="text-4xl">🕹️</div>
            <div className="text-4xl">🎯</div>
            <div className="text-4xl">🏆</div>
            <div className="text-4xl">🎪</div>
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button size="lg" variant="default" className="text-lg px-8 py-4">
              Book Your Session
            </Button>
            <Button size="lg" variant="ghost" className="text-lg px-8 py-4">
              View Gallery
            </Button>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-3xl mb-3">🎮</div>
              <h3 className="text-xl font-bold text-brand-alt mb-2">
                Premium Gaming
              </h3>
              <p className="text-gray-400">
                Latest PS5, Xbox, and PC gaming setups
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🥽</div>
              <h3 className="text-xl font-bold text-brand-alt mb-2">
                VR Experience
              </h3>
              <p className="text-gray-400">
                Immersive virtual reality adventures
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="text-xl font-bold text-brand-alt mb-2">
                Tournaments
              </h3>
              <p className="text-gray-400">
                Regular esports competitions and events
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-brand-alt rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-brand-alt rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LoungeHero;
