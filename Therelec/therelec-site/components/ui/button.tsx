"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#04599c] text-white hover:bg-[#034882] focus-visible:ring-[#04599c] shadow-md hover:shadow-lg",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
        outline:
          "border-2 border-[#04599c] text-[#04599c] hover:bg-[#04599c] hover:text-white focus-visible:ring-[#04599c]",
        secondary:
          "bg-[#0A1628] text-white hover:bg-[#142038] focus-visible:ring-[#0A1628]",
        accent:
          "bg-[#FFB800] text-[#0A1628] hover:bg-[#E5A600] focus-visible:ring-[#FFB800] shadow-md hover:shadow-lg font-bold",
        urgent:
          "bg-[#F97316] text-white hover:bg-[#EA6C0A] focus-visible:ring-[#F97316] shadow-md hover:shadow-lg animate-pulse",
        ghost:
          "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
        link:
          "text-[#04599c] underline-offset-4 hover:underline p-0 h-auto",
        white:
          "bg-white text-[#04599c] hover:bg-gray-100 shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-11 px-6 py-2.5 text-sm",
        sm: "h-9 px-4 py-2 text-sm",
        lg: "h-13 px-8 py-3.5 text-base",
        xl: "h-14 px-10 py-4 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
