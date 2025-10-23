"use client";

import React, { useState } from "react";
import SignUpForm from "@/components/Auth/SignUpForm";
import VerifyOTP from "@/components/Auth/Verify-OTP";
import Link from "next/link";

const SignupPage = () => {
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userToken, setUserToken] = useState("");

  const handleSignupSuccess = (email: string, token: string) => {
    setUserEmail(email);
    setUserToken(token);
    setShowOTPModal(true);
  };

  const handleCloseOTP = () => {
    setShowOTPModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          filter: "blur(8px)",
          transform: "scale(1.1)",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="container relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Register Modal */}
          <div className="bg-brand-secondary backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Create an account
              </h1>
              <p className="text-brand-bg">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-brand-alt hover:text-brand-alt/80 transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>
            <SignUpForm onSignupSuccess={handleSignupSuccess} />
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <VerifyOTP
          isOpen={showOTPModal}
          onClose={handleCloseOTP}
          userEmail={userEmail}
          userToken={userToken}
        />
      )}
    </div>
  );
};

export default SignupPage;
