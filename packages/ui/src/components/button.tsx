"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import type { VariantProps } from "class-variance-authority"

import { buttonVariants } from "@workspace/ui/lib/button-variants"
import { cn } from "@workspace/ui/lib/utils"

function Button({
  className,
  variant = "default",
  size = "default",
  radius = "full",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, radius, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
