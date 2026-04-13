import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

const skeletonVariants = cva("animate-pulse bg-muted", {
  variants: {
    radius: {
      "2xl": "rounded-2xl",
      xl: "rounded-xl",
      lg: "rounded-lg",
      md: "rounded-md",
      sm: "rounded-sm",
      full: "rounded-full",
      none: "rounded-none",
    },
  },
  defaultVariants: {
    radius: "2xl",
  },
})

function Skeleton({
  className,
  radius = "2xl",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof skeletonVariants>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ radius }), className)}
      {...props}
    />
  )
}

export { Skeleton, skeletonVariants }
