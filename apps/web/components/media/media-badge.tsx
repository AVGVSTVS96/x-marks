import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

export function MediaBadge({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "absolute bottom-1.5 right-1.5 rounded border border-border bg-background/80 px-1.5 py-0.5 font-heading text-[10px] leading-none text-foreground backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}
