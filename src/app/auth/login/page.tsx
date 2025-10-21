"use client";

import { useState } from "react";
import Link from "next/link";
import { Checkbox } from "@/components/UI/Checkbox";
import { Button } from "@/components/UI/Button";
import GoogleIcon from "@/components/Icons/socials/GoogleIcon";
import MailIcon from "@/components/Icons/MailIcon";

const LoginPage = () => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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
          {/* Login Modal */}
          <div className="bg-brand-secondary backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, gamer.
              </h1>
              <p className="text-brand-bg">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-brand-alt hover:text-brand-alt/80 transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            {/* Login Options */}
            <div className="space-y-4 mb-8">
              {/* Google Login */}
              <Button
                variant="secondary"
                className="w-full h-12 bg-brand-ash border-brand-ash hover:bg-brand-ash/80 text-brand-bg justify-center px-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <GoogleIcon />
                  </div>
                  <span>Continue with Google</span>
                </div>
              </Button>

              {/* Email Login */}
              <Button
                variant="secondary"
                className="w-full h-12 bg-brand-ash border-brand-ash hover:bg-brand-ash/80 text-brand-bg justify-center px-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <MailIcon />
                  </div>
                  <span>Continue with Email</span>
                </div>
              </Button>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <Checkbox
                checked={agreeToTerms}
                onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                className="mt-1"
              />
              <p className="text-sm text-brand-bg leading-relaxed">
                I agree to CGE{" "}
                <Link
                  href="/terms"
                  className="text-brand-alt hover:text-brand-alt/80 transition-colors"
                >
                  Terms of service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-brand-alt hover:text-brand-alt/80 transition-colors"
                >
                  Privacy policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
