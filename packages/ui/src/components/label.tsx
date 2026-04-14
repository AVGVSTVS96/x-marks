"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

const labelVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      default: "text-sm font-medium text-foreground",
      muted: "text-sm font-medium text-muted-foreground",
      eyebrow:
        "font-heading text-xs font-medium uppercase tracking-eyebrow text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Label({
  className,
  variant,
  render,
  ...props
}: useRender.ComponentProps<"label"> & VariantProps<typeof labelVariants>) {
  return useRender({
    defaultTagName: "label",
    props: mergeProps<"label">(
      {
        className: cn(labelVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "label",
      variant,
    },
  })
}

export { Label, labelVariants }
