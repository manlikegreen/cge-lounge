import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-base lg:text-[1.25rem] font-bold ring-offset-background transition ease-in-out duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform transition-transform duration-300 hover:scale-110",
  {
    variants: {
      variant: {
        default:
          "border-[1.25px] border-brand bg-brand text-brand-bg hover:bg-inherit hover:text-brand-bg rounded-[8px]",
        // alternate:
        //   "border-[1.25px] border-brand-bg bg-brand text-brand-bg hover:hover:bg-inherit hover:text-brand-bg border-brand rounded-[8px]",
        secondary:
          "border-[1.25px] border-brand bg-brand text-brand-bg hover:bg-inherit hover:text-brand-bg hover:border-brand-bg rounded-[25px]",
        // link: "text-base text-[#222] dark:text-brand-ash underline-offset-4 hover:underline hover:text-brand dark:hover:text-brand rounded-[8px]",
        ghost:
          "border-[1.25px] border-brand bg-transparent rounded-[8px] shadow-[0_0_4px_0_#c3ff7d3f]",
      },
      size: {
        default: "h-9 lg:h-11 px-5 py-1 xl:px-6",
        sm: "h-7 px-3",
        lg: "h-12 px-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
