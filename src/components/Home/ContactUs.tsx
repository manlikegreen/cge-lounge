"use client";

import { FaMapMarkerAlt, FaClock, FaPhone } from "react-icons/fa";

const ContactUs: React.FC = () => {
  return (
    <section className="bg-brand-secondary py-16">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Main Heading */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Visit Our <span className="text-brand-alt">Gaming Lounge</span>
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Located in the heart of Bonny Island, our state-of-the-art
              facility is ready to welcome you.
            </p>
          </div>

          {/* Information Blocks */}
          <div className="space-y-6">
            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="text-black text-xl" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Location</h3>
                <p className="text-white/80">
                  1 IT WILLIAMS STREET, AKIAMA ROAD, BONNY ISLAND RIVERS STATE,
                  NIGERIA
                </p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <FaClock className="text-black text-xl" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">
                  Operating Hours
                </h3>
                <p className="text-white/80">Mon-Sun: 10:00 AM – 2:00 AM</p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <FaPhone className="text-black text-xl" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Contact</h3>
                <p className="text-white/80">+2348160658509</p>
                <p className="text-white/80">creativegamingent@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Small Stay Updated Form */}
          <div className="bg-brand-ash rounded-xl p-6">
            <h3 className="text-white font-bold text-xl mb-2">Stay Updated</h3>
            <p className="text-white/80 text-sm mb-4">
              Get notified about tournaments, events, and special offers
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter Email address"
                className="flex-1 bg-brand-ash text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-gray-600 focus:border-brand-alt focus:outline-none transition-colors"
              />
              <button className="bg-brand text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-alt/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Main Contact Form */}
        <div className="bg-brand-ash rounded-xl p-8">
          <h3 className="text-white font-bold text-2xl text-center mb-8">
            Stay Updated
          </h3>

          <div className="space-y-6">
            {/* Email Input Fields */}
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter Email address"
                className="w-full bg-brand-ash text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-gray-600 focus:border-brand-alt focus:outline-none transition-colors"
              />
              <input
                type="phoneNumber"
                placeholder="Enter Phone Number"
                className="w-full bg-brand-ash text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-gray-600 focus:border-brand-alt focus:outline-none transition-colors"
              />
            </div>

            {/* Message Textarea */}
            <div>
              <textarea
                placeholder="Your message"
                rows={6}
                className="w-full bg-brand-ash text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-gray-600 focus:border-brand-alt focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button className="w-full bg-brand text-white py-4 rounded-lg font-medium text-lg hover:bg-brand-alt/90 transition-colors">
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
