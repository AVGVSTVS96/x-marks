import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

const cardVariants = cva("flex flex-col text-card-foreground", {
  variants: {
    variant: {
      default: "border border-border bg-card",
      muted: "border border-border bg-muted/30",
      ghost: "bg-transparent",
    },
    radius: {
      "2xl": "rounded-2xl",
      xl: "rounded-xl",
      lg: "rounded-lg",
      md: "rounded-md",
      none: "rounded-none",
    },
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
    gap: {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
    },
  },
  defaultVariants: {
    variant: "default",
    radius: "lg",
    padding: "md",
    gap: "md",
  },
})

function Card({
  className,
  variant,
  radius,
  padding,
  gap,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, radius, padding, gap }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-heading text-base font-medium leading-none", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  cardVariants,
}
