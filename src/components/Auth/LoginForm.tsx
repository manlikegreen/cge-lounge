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

const formSchema = z.object({
  email: z.string().email({
    message: "please provide a valid email address",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 letters long",
  }),
  "save-details": z.boolean().default(false).optional(),
});

function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="dark:text-brand-ash">
              <FormLabel className="text-base md:text-[1.25rem]">
                Email Address
              </FormLabel>
              <FormControl>
                <div className="relative flex flex-row-reverse items-center">
                  <Input
                    placeholder="Enter your registered email address"
                    className="text-[0.75rem] md:text-base pl-[4.25rem] peer focus-visible:border-brand-secondary"
                    // type={field.name}
                    {...field}
                  />
                  <div className="absolute left-[0.75rem] md:left-[1.75rem] text-[1rem] text-brand-ash peer-focus-visible:text-brand-secondary dark:peer-focus-visible:text-brand-bg peer-autofill:text-brand-secondary transition-all">
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
            <FormItem className="dark:text-brand-ash mt-6">
              <FormLabel className="text-base md:text-[1.25rem]">
                Password
              </FormLabel>
              <FormControl>
                <div className="relative flex flex-row-reverse items-center">
                  <Input
                    placeholder="Enter your password"
                    className="text-[0.75rem] md:text-base pl-[4.25rem] peer focus-visible:border-brand-secondary"
                    type={isPasswordVisible ? "text" : "password"}
                    {...field}
                  />
                  <div className="absolute left-[0.75rem] md:left-[1.75rem] text-[1rem] text-brand-ash peer-focus-visible:text-brand-secondary dark:peer-focus-visible:text-brand-bg peer-autofill:text-brand-secondary transition-all">
                    <PadlockIcon />
                  </div>
                  <div
                    className="absolute right-[1.3rem] md:right-[1.8rem] text-[1rem] text-brand-ash cursor-pointer"
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
        <FormField
          control={form.control}
          name="save-details"
          render={({ field }) => (
            <FormItem className="space-x-4 space-y-0 flex items-center mt-6">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-base md:text-[1.25rem] dark:text-brand-ash font-normal">
                Save log in details for future
              </FormLabel>
            </FormItem>
          )}
        />
        <div className="flex items-center justify-center">
          <Button type="submit" className="mt-14 w-1/2">
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default LoginForm;
