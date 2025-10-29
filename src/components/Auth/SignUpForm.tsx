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
import Link from "next/link";
import UserIcon from "../Icons/UserIcon";
import { signupUser, ApiError } from "@/api/auth/signup";

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  email: z.string().email({
    message: "please provide a valid email address",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 letters long",
  }),
  "save-details": z.boolean().default(false).optional(),
});

interface SignUpFormProps {
  onSignupSuccess?: (
    email: string,
    token: string,
    firstName: string,
    lastName: string
  ) => void;
}

function SignUpForm({ onSignupSuccess }: SignUpFormProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await signupUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      // Handle successful signup
      console.log("Signup successful:", result);
      console.log("User data from backend:", result.user);
      console.log("Form values:", values);

      // Extract first name from backend fullName response
      const fullName = result.user.fullName || "";
      const firstName = fullName.split(" ")[0] || "";
      const lastName = fullName.split(" ").slice(1).join(" ") || "";

      console.log("Extracted names from backend:", {
        fullName,
        firstName,
        lastName,
      });

      // Call the success callback to show OTP modal
      if (onSignupSuccess) {
        onSignupSuccess(result.user.email, result.token, firstName, lastName);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setError(apiError.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="dark:text-brand-bg space-y-4">
              <FormLabel className="text-base md:text-[1.25rem]">
                First Name
              </FormLabel>
              <FormControl>
                <div className="relative flex flex-row-reverse items-center">
                  <Input
                    placeholder="Enter your first name"
                    className="text-[0.75rem] md:text-base pl-[4.25rem] peer focus-visible:border-brand-secondary text-brand-bg"
                    // type={field.name}
                    {...field}
                  />
                  <div className="absolute left-[0.75rem] md:left-[1.75rem] text-[1rem] text-brand-bg peer-focus-visible:text-brand-secondary dark:peer-focus-visible:text-brand-bg peer-autofill:text-brand-secondary transition-all">
                    <UserIcon />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="dark:text-brand-bg space-y-4">
              <FormLabel className="text-base md:text-[1.25rem]">
                Last Name
              </FormLabel>
              <FormControl>
                <div className="relative flex flex-row-reverse items-center">
                  <Input
                    placeholder="Enter your last name"
                    className="text-[0.75rem] md:text-base pl-[4.25rem] peer focus-visible:border-brand-secondary text-brand-bg"
                    // type={field.name}
                    {...field}
                  />
                  <div className="absolute left-[0.75rem] md:left-[1.75rem] text-[1rem] text-brand-bg peer-focus-visible:text-brand-secondary dark:peer-focus-visible:text-brand-bg peer-autofill:text-brand-secondary transition-all">
                    <UserIcon />
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                    placeholder="Enter your registered email address"
                    className="text-[0.75rem] md:text-base pl-[4.25rem] peer focus-visible:border-brand-secondary text-brand-bg"
                    // type={field.name}
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
        {/* Terms and Conditions */}
        <div className="flex items-start gap-3 pt-8">
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
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SignUpForm;
