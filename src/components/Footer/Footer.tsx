"use client";

import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Information */}
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-bold text-white uppercase mb-4">
              CGE
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              The ultimate destination for console gaming, VR experiences, and
              competitive Esports tournaments.
            </p>
          </div>

          {/* Quick Link Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Quick Link</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Gaming Services Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">
              Gaming Services
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/vr-gaming"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  VR Gaming
                </Link>
              </li>
              <li>
                <Link
                  href="/console-gaming"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Console Gaming
                </Link>
              </li>
              <li>
                <Link
                  href="/esports-tournaments"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Esports Tournaments
                </Link>
              </li>
              <li>
                <Link
                  href="/private-parties"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Private Parties
                </Link>
              </li>
              <li>
                <Link
                  href="/gaming-lessons"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Gaming Lessons
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/live-chat"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Live Chat
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/troubleshooting"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Troubleshooting
                </Link>
              </li>
              <li>
                <Link
                  href="/open-ticket"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  Open Ticket
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
