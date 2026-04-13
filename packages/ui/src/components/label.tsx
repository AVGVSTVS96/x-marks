import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

const labelVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      default: "text-sm font-medium text-foreground",
      muted: "text-sm font-medium text-muted-foreground",
      eyebrow:
        "text-[10px] font-medium uppercase tracking-eyebrow text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Label({
  className,
  variant,
  ...props
}: React.ComponentProps<"label"> & VariantProps<typeof labelVariants>) {
  return (
    <label
      data-slot="label"
      className={cn(labelVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Label, labelVariants }
