"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import logo from "@/assets/cgeLogo.png";

const Footer: React.FC = () => {
  return (
    <footer className="py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Information */}

          <div className="lg:col-span-1 ">
            <div className="flex items-center gap-3 mb-4">
              <Image src={logo} alt="CGE Logo" width={100} height={100} />
              <h3 className="text-2xl flex gap-2 items-center">
                <div className="flex flex-col">
                  <span className="text-brand-bg text-sm">CREATIVE</span>
                  <span className="text-brand-bg text-sm">GAMING</span>
                  <span className="text-brand-bg text-sm">ENTERTAINMENT</span>
                </div>
              </h3>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              The ultimate destination for console gaming, VR experiences, and
              competitive Esports tournaments.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.facebook.com/share/1CgoozEdN8/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://www.instagram.com/cge_lounge"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
            </div>
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
