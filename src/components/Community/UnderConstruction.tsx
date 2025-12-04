"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Storefront,
  ChatCircle,
  ArrowsClockwise,
  GameController,
  Users,
  Sparkle,
} from "@phosphor-icons/react";

const UnderConstruction: React.FC = () => {
  const features = [
    {
      icon: Storefront,
      title: "Post Your Games",
      description: "List games you want to sell or trade",
    },
    {
      icon: ChatCircle,
      title: "Connect & Message",
      description: "Send messages to other gamers",
    },
    {
      icon: ArrowsClockwise,
      title: "Buy, Sell & Swap",
      description: "Trade games with community members",
    },
  ];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-background py-20">
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

      <div className="container mx-auto px-6 relative z-10 mt-[5rem]">
        <div className="max-w-4xl mx-auto">
          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#0b1018] border border-foreground/20 rounded-2xl p-8 md:p-12 shadow-2xl"
          >
            {/* Icon and Title */}
            <div className="text-center mb-8">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-brand/20 border border-brand/30"
              >
                <GameController
                  className="w-12 h-12 text-brand-alt"
                  weight="fill"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-2 mb-4"
              >
                <Sparkle className="w-6 h-6 text-brand-alt" weight="fill" />
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Community <span className="text-brand-alt">Marketplace</span>
                </h1>
                <Sparkle className="w-6 h-6 text-brand-alt" weight="fill" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-alt/10 border border-brand-alt/30"
              >
                <span className="text-brand-alt font-semibold text-sm md:text-base">
                  Coming Soon
                </span>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-white/80 text-lg md:text-xl mb-12 leading-relaxed"
            >
              We&apos;re building an interactive marketplace where gamers can
              connect, trade, and build a thriving community. Get ready to buy,
              sell, and swap games with fellow players!
            </motion.p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex flex-col items-center text-center p-6 rounded-xl border border-foreground/20 bg-background/50 hover:border-brand-alt/30 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-brand-alt" weight="fill" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Community Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-center pt-6 border-t border-foreground/20"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Users className="w-5 h-5 text-brand-alt" weight="fill" />
                <p className="text-white/60 text-sm md:text-base">
                  Join our community and stay tuned for updates!
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UnderConstruction;
