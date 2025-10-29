"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "../UI/Button";

interface PricingTier {
  id: string;
  name: string;
  price: string;
  duration: string;
  features: string[];
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: "1",
    name: "Hourly Pass",
    price: "₦2,500",
    duration: "Per Hour",
    features: [
      "Access to all gaming stations",
      "High-speed internet",
      "Basic refreshments",
      "Gaming library access",
    ],
  },
  {
    id: "2",
    name: "Half Day Pass",
    price: "₦8,000",
    duration: "4 Hours",
    features: [
      "Everything in Hourly Pass",
      "Premium refreshments",
      "Priority booking",
      "Tournament participation",
      "10% discount on snacks",
    ],
    popular: true,
  },
  {
    id: "3",
    name: "Full Day Pass",
    price: "₦15,000",
    duration: "8 Hours",
    features: [
      "Everything in Half Day Pass",
      "Private room access",
      "Unlimited refreshments",
      "Free tournament entry",
      "20% discount on snacks",
      "Group booking benefits",
    ],
  },
  {
    id: "4",
    name: "Monthly Membership",
    price: "₦45,000",
    duration: "Per Month",
    features: [
      "Unlimited access",
      "All premium features",
      "Exclusive events",
      "Member-only tournaments",
      "50% discount on snacks",
      "Priority support",
      "Guest passes included",
    ],
  },
];

const PricingCard: React.FC<{ tier: PricingTier; index: number }> = ({
  tier,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative bg-gray-800/50 rounded-xl p-6 border backdrop-blur-sm flex flex-col h-full",
        "hover:bg-gray-800/70 transition-all duration-300",
        "hover:shadow-lg hover:shadow-brand-alt/20",
        tier.popular
          ? "border-brand-alt/50 ring-2 ring-brand-alt/20"
          : "border-gray-700/50 hover:border-brand-alt/50"
      )}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-brand-alt text-white px-4 py-1 rounded-full text-sm font-bold">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-brand-alt mb-2">{tier.name}</h3>
        <div className="text-3xl font-bold text-white mb-1">{tier.price}</div>
        <div className="text-gray-400 text-sm">{tier.duration}</div>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6 flex-grow">
        {tier.features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-alt rounded-full" />
            <span className="text-sm text-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <Button variant={"default"} className="w-full mt-auto">
        {tier.popular ? "Choose Plan" : "Select Plan"}
      </Button>
    </motion.div>
  );
};

const BookingInfo: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  const timeSlots = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
  ];

  const durations = ["1 Hour", "2 Hours", "4 Hours", "8 Hours"];

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
            <span className="text-white">Pricing & </span>
            <span className="text-brand-alt">Booking</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your gaming experience. Book your
            session and get ready for an unforgettable time at CGE Lounge
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={tier.id} tier={tier} index={index} />
          ))}
        </div>

        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-brand-alt mb-6 text-center">
              Book Your Session
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-brand-alt focus:outline-none"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-brand-alt focus:outline-none"
                >
                  <option value="">Choose time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-brand-alt focus:outline-none"
                >
                  <option value="">Choose duration</option>
                  {durations.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-brand-alt focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:border-brand-alt focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button size="lg" variant="default" className="px-8 py-4">
                Confirm Booking
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-brand/20 to-brand-alt/20 rounded-xl p-8 border border-brand-alt/30">
            <h3 className="text-2xl font-bold text-brand-alt mb-4">
              Need Help Booking?
            </h3>
            <p className="text-gray-300 text-lg mb-4">
              Contact us directly for assistance or group bookings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <span className="text-brand-alt font-bold">
                📞 +234 123 456 7890
              </span>
              <span className="text-brand-alt font-bold">
                ✉️ info@cgelounge.com
              </span>
              <span className="text-brand-alt font-bold">
                📍 Bonny Island, Rivers State
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingInfo;
