import * as React from "react";
import { Slot as SlotPrimitive } from "radix-ui";;
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-600 text-white shadow-md hover:shadow-lg hover:bg-indigo-700 rounded-lg active:scale-[0.98] transform dark:bg-indigo-500 dark:hover:bg-indigo-600",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 rounded-lg active:scale-[0.98] transform focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800",
        outline:
          "border-2 border-primary/20 bg-background shadow-sm hover:bg-primary/5 hover:border-primary/40 hover:shadow-md rounded-lg active:scale-[0.98] transform dark:bg-card dark:border-border dark:hover:bg-muted dark:hover:border-border",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md rounded-lg active:scale-[0.98] transform dark:bg-muted dark:text-foreground dark:hover:bg-muted/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground rounded-lg active:scale-[0.98] transform dark:hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline rounded-md dark:text-indigo-400"
      },
      size: {
        default: "min-h-[44px] px-4 py-2 has-[>svg]:px-3",
        sm: "min-h-[44px] rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "min-h-[48px] rounded-lg px-6 has-[>svg]:px-4 text-base font-semibold shadow-lg hover:shadow-xl",
        icon: "size-[44px] rounded-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? SlotPrimitive.Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
