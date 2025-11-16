"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";
import { verifyOTP, ApiError } from "@/api/auth/verify-otp";
import { sendOTP } from "@/api/auth/send-otp";
import ProfileSetup from "@/components/Profile/Profile";
import ApiClient from "@/lib/ApiClient";

interface VerifyOTPProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userToken: string;
  userFirstName?: string;
  userLastName?: string;
}

export default function VerifyOTP({
  isOpen,
  onClose,
  userEmail,
  userToken,
  userFirstName,
  userLastName,
}: VerifyOTPProps) {
  const [otpInputs, setOtpInputs] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [resendCooldown, setResendCooldown] = useState(180); // 3 minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Mask email function
  const maskEmail = (email: string) => {
    if (!email) return "No email provided";
    try {
      const [username, domain] = email.split("@");
      if (!username || !domain) return email;

      const maskedUsername =
        username.charAt(0) +
        "*".repeat(Math.max(0, username.length - 2)) +
        (username.length > 1 ? username.charAt(username.length - 1) : "");

      const [domainName, tld] = domain.split(".");
      if (!domainName || !tld) return email;

      const maskedDomain =
        domainName.charAt(0) +
        "*".repeat(Math.max(0, domainName.length - 2)) +
        (domainName.length > 1 ? domainName.charAt(domainName.length - 1) : "");

      return `${maskedUsername}@${maskedDomain}.${tld}`;
    } catch (error) {
      console.error("Error masking email:", error);
      return email;
    }
  };

  const maskedEmail = maskEmail(userEmail);

  const isOtpComplete = otpInputs.every((digit) => digit.length === 1);

  // Timer effects
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const resendTimer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 0) {
          clearInterval(resendTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(resendTimer);
    };
  }, [isOpen]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = event.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      event.target.value = "";
      return;
    }

    // Update the OTP array
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);

    // Move to next input if value is entered
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace") {
      // Clear current input
      const newOtpInputs = [...otpInputs];
      newOtpInputs[index] = "";
      setOtpInputs(newOtpInputs);

      // Move to previous input if current is empty
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    if (!isOtpComplete) {
      console.log("OTP not complete, cannot verify");
      return;
    }

    console.log("Starting OTP verification...");
    setIsVerifying(true);
    setError(null);

    try {
      const otp = otpInputs.join("");
      console.log("Verifying OTP for email:", userEmail, "OTP:", otp);

      // Call the verify OTP API
      const result = await verifyOTP({
        email: userEmail,
        otp: otp,
      });

      console.log("OTP verification result:", result);

      // If we get here, the OTP was verified successfully
      // The backend may have set a new token in cookies after OTP verification
      // Check for token in cookies first (backend might set it there)
      console.log("🔐 Checking for token in cookies after OTP verification...");
      const cookieToken =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("session.token="))
          ?.split("=")[1] ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1] ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

      // Use token from cookie if available, otherwise use the one from signup
      const finalToken = cookieToken || userToken;

      console.log(
        "🔐 Token source:",
        cookieToken ? "Cookie (from backend)" : "Signup prop"
      );
      console.log(
        "🔐 Token value:",
        finalToken ? `${finalToken.substring(0, 20)}...` : "NOT FOUND"
      );

      if (!finalToken) {
        console.error("❌ CRITICAL: No token found after OTP verification!");
        throw new Error("Authentication token not received. Please try again.");
      }

      // Store the user data and token
      console.log("VerifyOTP - User data being stored:");
      console.log("userEmail:", userEmail);
      console.log("userFirstName:", userFirstName);
      console.log("userLastName:", userLastName);

      const userData = {
        email: userEmail,
        firstName: userFirstName || userEmail.split("@")[0], // Use actual firstName or fallback to email
        lastName: userLastName,
        // Add other user data as needed
      };

      console.log("Final user data to store:", userData);

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", finalToken);
      console.log("✅ Token stored in localStorage");

      // Set token in ApiClient to ensure it's available for subsequent API calls
      console.log("🔐 Setting token in ApiClient...");
      const apiClient = ApiClient.getInstance();
      apiClient.setAccessToken(finalToken);
      console.log("✅ Token set in ApiClient successfully");

      // Verify token is actually set
      const verifyToken = localStorage.getItem("token");
      console.log(
        "🔍 Verification: Token in localStorage:",
        verifyToken ? "Found" : "NOT FOUND"
      );

      // Show profile setup modal instead of redirecting
      setShowProfileSetup(true);
      // Don't close OTP modal immediately - let ProfileSetup modal show first
      // The ProfileSetup modal will handle closing when user completes profile
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError(null);

    try {
      // Call the send OTP API
      await sendOTP({
        email: userEmail,
      });

      // If we get here, the OTP was resent successfully
      // Reset timers
      setTimeLeft(900);
      setResendCooldown(180);
      setOtpInputs(["", "", "", ""]);

      // Focus first input
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect - hide when ProfileSetup is showing */}
      {!showProfileSetup && (
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* OTP Modal - hide when ProfileSetup is showing */}
      {!showProfileSetup && (
        <div className="relative bg-brand-secondary backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 w-full max-w-md mx-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Verify OTP</h1>
            <p className="text-brand-bg">
              Enter the 4-digit code sent to{" "}
              <span className="text-brand-alt font-medium">{maskedEmail}</span>
            </p>
          </div>

          {/* OTP Input Fields */}
          <div className="flex justify-center gap-4 mb-6">
            {otpInputs.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                type="text"
                maxLength={1}
                className="w-12 h-12 text-center text-xl border border-gray-400 rounded-lg focus:ring-1 focus:ring-brand-alt focus:outline-none"
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <span className="text-brand-bg">Expires in: </span>
            <span className="text-brand-alt font-medium">
              {formatTime(timeLeft)}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Verify Button */}
          <Button
            type="button"
            onClick={handleVerify}
            disabled={!isOtpComplete || isVerifying}
            className="w-full bg-brand text-brand-bg hover:bg-inherit hover:text-brand-bg disabled:opacity-50 mb-4"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-sm text-brand-bg mb-2">
              Didn&apos;t receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="text-brand-alt hover:text-brand-alt/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending
                ? "Sending..."
                : resendCooldown > 0
                ? `Resend Code (${formatTime(resendCooldown)})`
                : "Resend Code"}
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-brand-bg hover:text-brand-alt transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Profile Setup Modal */}
      <ProfileSetup
        isOpen={showProfileSetup}
        onClose={() => {
          setShowProfileSetup(false);
          onClose(); // Also close the Verify-OTP modal
        }}
        userEmail={userEmail}
        onComplete={() => {
          setShowProfileSetup(false);
          onClose(); // Close Verify-OTP modal
          window.location.href = "/dashboard";
        }}
      />
    </div>
  );
}
