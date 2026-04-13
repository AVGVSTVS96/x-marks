import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  icon?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div
          data-slot="empty-state-icon"
          className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground"
        >
          {icon}
        </div>
      )}
      {title && (
        <div
          data-slot="empty-state-title"
          className="font-heading text-base font-medium text-foreground"
        >
          {title}
        </div>
      )}
      {description && (
        <div
          data-slot="empty-state-description"
          className="max-w-sm text-sm text-muted-foreground"
        >
          {description}
        </div>
      )}
      {action && <div data-slot="empty-state-action">{action}</div>}
    </div>
  )
}

export { EmptyState }
