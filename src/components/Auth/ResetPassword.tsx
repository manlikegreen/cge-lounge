"use client";

import * as z from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/UI/Form";
import { Input } from "@/components/UI/Input";
import { Button } from "@/components/UI/Button";
import MailIcon from "@/components/Icons/MailIcon";
import EyeonIcon from "@/components/Icons/EyeonIcon";
import EyeoffIcon from "@/components/Icons/EyeoffIcon";
import PadlockIcon from "@/components/Icons/PadlockIcon";
import { resetPassword, ApiError } from "@/api/auth/reset-password";

const formSchema = z
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

interface ResetPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  onSuccess: () => void;
}

function ResetPassword({
  isOpen,
  onClose,
  userEmail,
  onSuccess,
}: ResetPasswordProps) {
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userEmail,
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Set email when component opens
  useEffect(() => {
    if (isOpen && userEmail) {
      form.setValue("email", userEmail);
    }
  }, [isOpen, userEmail, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await resetPassword({
        email: values.email,
        newPassword: values.newPassword,
      });

      console.log("Password reset successful:", result);
      onSuccess();
    } catch (error) {
      const apiError = error as ApiError;
      setError(
        apiError.message || "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prev) => !prev);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Reset Password Modal */}
      <div className="relative bg-brand-secondary backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700/50 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-brand-bg">Enter your new password below</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
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
              control={form.control}
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
                        onClick={toggleNewPasswordVisibility}
                      >
                        {isNewPasswordVisible ? <EyeonIcon /> : <EyeoffIcon />}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
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
                        onClick={toggleConfirmPasswordVisibility}
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
            <div className="flex items-center justify-center">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand text-brand-bg hover:bg-inherit hover:text-brand-bg disabled:opacity-50"
              >
                {isLoading ? "Resetting Password..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-bg hover:text-brand-alt transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
