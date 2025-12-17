"use client";

import { useState, useEffect, useRef } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/Form";
import MailIcon from "@/components/Icons/MailIcon";
import EyeonIcon from "@/components/Icons/EyeonIcon";
import EyeoffIcon from "@/components/Icons/EyeoffIcon";
import PadlockIcon from "@/components/Icons/PadlockIcon";
import { sendOTP, ApiError as SendOTPApiError } from "@/api/auth/send-otp";
import {
  verifyOTP,
  ApiError as VerifyOTPApiError,
} from "@/api/auth/verify-otp";
import {
  resetPassword,
  ApiError as ResetPasswordApiError,
} from "@/api/auth/reset-password";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  preFilledEmail?: string;
}

type Step = "email" | "otp" | "reset";

const emailSchema = z.object({
  email: z.string().email({
    message: "Please provide a valid email address",
  }),
});

const resetPasswordSchema = z
  .object({
    email: z.string().email({
      message: "Please provide a valid email address",
    }),
    newPassword: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters long",
      })
      .regex(/\d/, {
        message: "Password must contain at least one number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function ForgotPasswordModal({
  isOpen,
  onClose,
  preFilledEmail = "",
}: ForgotPasswordModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState(preFilledEmail);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // OTP states
  const [otpInputs, setOtpInputs] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [resendCooldown, setResendCooldown] = useState(180); // 3 minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset password form
  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: preFilledEmail,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Update email when preFilledEmail changes
  useEffect(() => {
    if (preFilledEmail) {
      setEmail(preFilledEmail);
      resetForm.setValue("email", preFilledEmail);
    }
  }, [preFilledEmail, resetForm]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep("email");
      setError(null);
      setOtpInputs(["", "", "", ""]);
      if (!preFilledEmail) {
        setEmail("");
      }
      resetForm.reset();
    }
  }, [isOpen, preFilledEmail, resetForm]);

  // Timer for OTP step
  useEffect(() => {
    if (!isOpen || currentStep !== "otp") return;

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
  }, [isOpen, currentStep]);

  // Focus first OTP input when OTP step is shown
  useEffect(() => {
    if (currentStep === "otp" && otpInputRefs.current[0]) {
      otpInputRefs.current[0]?.focus();
    }
  }, [currentStep]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

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

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsSendingOTP(true);
    setError(null);

    try {
      await sendOTP({ email });
      setCurrentStep("otp");
      setTimeLeft(900);
      setResendCooldown(180);
    } catch (error) {
      const apiError = error as SendOTPApiError;
      setError(apiError.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleOTPInput = (
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
    if (value && index < 3 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace") {
      // Clear current input
      const newOtpInputs = [...otpInputs];
      newOtpInputs[index] = "";
      setOtpInputs(newOtpInputs);

      // Move to previous input if current is empty
      if (index > 0 && otpInputRefs.current[index - 1]) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  const isOtpComplete = otpInputs.every((digit) => digit.length === 1);

  const handleVerifyOTP = async () => {
    if (!isOtpComplete) {
      setError("Please enter the complete OTP code");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const otp = otpInputs.join("");
      await verifyOTP({
        email: email,
        otp: otp,
      });

      // OTP verified successfully, move to reset password step
      setCurrentStep("reset");
      resetForm.setValue("email", email);
    } catch (error) {
      const apiError = error as VerifyOTPApiError;
      setError(apiError.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setError(null);

    try {
      await sendOTP({ email });
      setTimeLeft(900);
      setResendCooldown(180);
      setOtpInputs(["", "", "", ""]);
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0]?.focus();
      }
    } catch (error) {
      const apiError = error as SendOTPApiError;
      setError(apiError.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleResetPassword = async (
    values: z.infer<typeof resetPasswordSchema>
  ) => {
    setIsResetting(true);
    setError(null);

    try {
      await resetPassword({
        email: values.email,
        newPassword: values.newPassword,
      });

      // Password reset successful, close modal and return to login
      onClose();
    } catch (error) {
      const apiError = error as ResetPasswordApiError;
      setError(
        apiError.message || "Failed to reset password. Please try again."
      );
    } finally {
      setIsResetting(false);
    }
  };

  const handleBackToLogin = () => {
    onClose();
  };

  const handleBackToEmail = () => {
    setCurrentStep("email");
    setError(null);
    setOtpInputs(["", "", "", ""]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackToLogin}
      />

      {/* Modal Content */}
      <div className="relative bg-brand-secondary backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {currentStep === "email"
              ? "Reset Password"
              : currentStep === "otp"
              ? "Verify OTP"
              : "Set New Password"}
          </h1>
          <p className="text-brand-bg">
            {currentStep === "email"
              ? "Enter your email address to receive a verification code"
              : currentStep === "otp"
              ? `Enter the 4-digit code sent to ${maskEmail(email)}`
              : "Enter your new password below"}
          </p>
        </div>

        {/* Email Step */}
        {currentStep === "email" && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="relative flex flex-row-reverse items-center">
              <Input
                placeholder="Enter your email address"
                className="text-[0.75rem] md:text-base pl-[4.25rem] peer focus-visible:border-brand-secondary text-brand-bg"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendOTP(e);
                  }
                }}
                autoFocus
              />
              <div className="absolute left-[0.75rem] md:left-[1.75rem] text-[1rem] text-brand-bg peer-focus-visible:text-brand-secondary dark:peer-focus-visible:text-brand-bg peer-autofill:text-brand-secondary transition-all">
                <MailIcon />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSendingOTP || !email}
                className="flex-1 bg-brand text-brand-bg hover:bg-inherit hover:text-brand-bg disabled:opacity-50"
              >
                {isSendingOTP ? "Sending..." : "Send OTP"}
              </Button>
              <Button
                type="button"
                onClick={handleBackToLogin}
                variant="ghost"
                className="flex-1"
              >
                Back to Login
              </Button>
            </div>
          </form>
        )}

        {/* OTP Step */}
        {currentStep === "otp" && (
          <div className="space-y-6">
            {/* OTP Input Fields */}
            <div className="flex justify-center gap-4">
              {otpInputs.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    otpInputRefs.current[index] = el;
                  }}
                  value={digit}
                  onChange={(e) => handleOTPInput(e, index)}
                  onKeyDown={(e) => handleOTPKeyDown(e, index)}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl border border-gray-400 rounded-lg focus:ring-1 focus:ring-brand-alt focus:outline-none text-brand-bg"
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center">
              <span className="text-brand-bg">Expires in: </span>
              <span className="text-brand-alt font-medium">
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            {/* Verify Button */}
            <Button
              type="button"
              onClick={handleVerifyOTP}
              disabled={!isOtpComplete || isVerifying}
              className="w-full bg-brand text-brand-bg hover:bg-inherit hover:text-brand-bg disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-brand-bg mb-2">
                Didn&apos;t receive the code?
              </p>
              <button
                onClick={handleResendOTP}
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

            {/* Back Button */}
            <Button
              type="button"
              onClick={handleBackToEmail}
              variant="ghost"
              className="w-full"
            >
              ← Back to Email
            </Button>
          </div>
        )}

        {/* Reset Password Step */}
        {currentStep === "reset" && (
          <Form {...resetForm}>
            <form
              onSubmit={resetForm.handleSubmit(handleResetPassword)}
              className="space-y-6"
            >
              {/* Email Field (disabled) */}
              <FormField
                control={resetForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="dark:text-brand-bg space-y-4">
                    <FormLabel className="text-base md:text-[1.25rem]">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex flex-row-reverse items-center">
                        <Input
                          placeholder="Enter your email address"
                          className="text-[0.75rem] md:text-base pl-[4.25rem] peer focus-visible:border-brand-secondary text-brand-bg"
                          type="email"
                          disabled
                          {...field}
                        />
                        <div className="absolute left-[0.75rem] md:left-[1.75rem] text-[1rem] text-brand-bg peer-focus-visible:text-brand-secondary dark:peer-focus-visible:text-brand-bg peer-autofill:text-brand-secondary transition-all">
                          <MailIcon />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password Field */}
              <FormField
                control={resetForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="dark:text-brand-bg space-y-4">
                    <FormLabel className="text-base md:text-[1.25rem]">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex flex-row-reverse items-center">
                        <Input
                          placeholder="Enter your new password"
                          className="text-[0.75rem] md:text-base pl-[4.25rem] peer focus-visible:border-brand-secondary text-brand-bg"
                          type={isNewPasswordVisible ? "text" : "password"}
                          {...field}
                        />
                        <div className="absolute left-[0.75rem] md:left-[1.75rem] text-[1rem] text-brand-bg peer-focus-visible:text-brand-secondary dark:peer-focus-visible:text-brand-bg peer-autofill:text-brand-secondary transition-all">
                          <PadlockIcon />
                        </div>
                        <div
                          className="absolute right-[1.3rem] md:right-[1.8rem] text-[1rem] text-brand-bg cursor-pointer"
                          onClick={() =>
                            setIsNewPasswordVisible((prev) => !prev)
                          }
                        >
                          {isNewPasswordVisible ? (
                            <EyeonIcon />
                          ) : (
                            <EyeoffIcon />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="dark:text-brand-bg space-y-4">
                    <FormLabel className="text-base md:text-[1.25rem]">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex flex-row-reverse items-center">
                        <Input
                          placeholder="Confirm your new password"
                          className="text-[0.75rem] md:text-base pl-[4.25rem] peer focus-visible:border-brand-secondary text-brand-bg"
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          {...field}
                        />
                        <div className="absolute left-[0.75rem] md:left-[1.75rem] text-[1rem] text-brand-bg peer-focus-visible:text-brand-secondary dark:peer-focus-visible:text-brand-bg peer-autofill:text-brand-secondary transition-all">
                          <PadlockIcon />
                        </div>
                        <div
                          className="absolute right-[1.3rem] md:right-[1.8rem] text-[1rem] text-brand-bg cursor-pointer"
                          onClick={() =>
                            setIsConfirmPasswordVisible((prev) => !prev)
                          }
                        >
                          {isConfirmPasswordVisible ? (
                            <EyeonIcon />
                          ) : (
                            <EyeoffIcon />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isResetting}
                className="w-full bg-brand text-brand-bg hover:bg-inherit hover:text-brand-bg disabled:opacity-50"
              >
                {isResetting ? "Resetting Password..." : "Reset Password"}
              </Button>

              {/* Back Button */}
              <Button
                type="button"
                onClick={handleBackToEmail}
                variant="ghost"
                className="w-full"
              >
                ← Back to Email
              </Button>
            </form>
          </Form>
        )}

        {/* Close Button - only show on email step */}
        {currentStep === "email" && (
          <button
            onClick={handleBackToLogin}
            className="absolute top-4 right-4 text-brand-bg hover:text-brand-alt transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
