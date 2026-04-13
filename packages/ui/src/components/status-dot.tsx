import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

const statusDotVariants = cva("inline-block shrink-0 rounded-full", {
  variants: {
    status: {
      success: "bg-success",
      warning: "bg-warning",
      info: "bg-info",
      error: "bg-destructive",
      idle: "bg-muted-foreground/60",
    },
    size: {
      xs: "size-1",
      sm: "size-1.5",
      md: "size-2",
      lg: "size-2.5",
    },
    pulse: {
      true: "animate-pulse",
      false: "",
    },
  },
  defaultVariants: {
    status: "idle",
    size: "sm",
    pulse: false,
  },
})

function StatusDot({
  className,
  status,
  size,
  pulse,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof statusDotVariants>) {
  return (
    <span
      data-slot="status-dot"
      className={cn(statusDotVariants({ status, size, pulse }), className)}
      {...props}
    />
  )
}

export { StatusDot, statusDotVariants }
