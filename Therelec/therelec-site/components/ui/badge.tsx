import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#04599c] text-white",
        secondary: "bg-gray-100 text-gray-700",
        accent: "bg-[#FFB800] text-[#0A1628]",
        success: "bg-[#10B981] text-white",
        urgent: "bg-[#F97316] text-white",
        cyan: "bg-[#00B4D8] text-white",
        outline: "border border-gray-300 text-gray-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
