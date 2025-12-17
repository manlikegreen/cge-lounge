"use client";

import * as z from "zod";
import { useState } from "react";
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
import { Checkbox } from "@/components/UI/Checkbox";
import MailIcon from "@/components/Icons/MailIcon";
import EyeonIcon from "@/components/Icons/EyeonIcon";
import EyeoffIcon from "@/components/Icons/EyeoffIcon";
import PadlockIcon from "@/components/Icons/PadlockIcon";
import { loginUser, ApiError } from "@/api/auth/sign-in";
import ForgotPasswordModal from "@/components/Auth/ForgotPasswordModal";

const formSchema = z.object({
  email: z.string().email({
    message: "Please provide a valid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  "save-details": z.boolean().default(false).optional(),
});

interface LoginFormProps {
  onLoginSuccess?: (email: string, token: string, firstName: string) => void;
}

function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [saveDetails, setSaveDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser({
        email: values.email,
        password: values.password,
      });

      // Handle successful login
      console.log("Login successful:", result);
      console.log("User data from backend:", result.user);

      // Extract first name from backend fullName response
      const fullName = result.user.fullName || "";
      const firstName = fullName.split(" ")[0] || "";

      console.log("Extracted firstName from backend:", firstName);

      // Call the success callback
      if (onLoginSuccess) {
        onLoginSuccess(result.user.email, result.access_token, firstName);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPasswordModal(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="dark:text-brand-bg space-y-4">
              <FormLabel className="text-base md:text-[1.25rem]">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative flex flex-row-reverse items-center">
                  <Input
                    placeholder="Enter your password"
                    className="text-[0.75rem] md:text-base pl-[4.25rem] peer focus-visible:border-brand-secondary text-brand-bg"
                    type={isPasswordVisible ? "text" : "password"}
                    {...field}
                  />
                  <div className="absolute left-[0.75rem] md:left-[1.75rem] text-[1rem] text-brand-bg peer-focus-visible:text-brand-secondary dark:peer-focus-visible:text-brand-bg peer-autofill:text-brand-secondary transition-all">
                    <PadlockIcon />
                  </div>
                  <div
                    className="absolute right-[1.3rem] md:right-[1.8rem] text-[1rem] text-brand-bg cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? <EyeonIcon /> : <EyeoffIcon />}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Save Details Checkbox */}
        <div className="flex items-start gap-3 pt-8">
          <Checkbox
            checked={saveDetails}
            onCheckedChange={(checked) => setSaveDetails(checked === true)}
            className="mt-1"
          />
          <p className="text-sm text-brand-bg leading-relaxed">Remember me</p>
        </div>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={handleForgotPasswordClick}
            className="text-brand-alt hover:text-brand-alt/80 transition-colors text-sm"
          >
            Forgot Password?
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="mt-14 w-1/2 bg-brand text-brand-bg hover:bg-inherit hover:text-brand-bg disabled:opacity-50"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        preFilledEmail={form.getValues("email")}
      />
    </Form>
  );
}

export default LoginForm;
