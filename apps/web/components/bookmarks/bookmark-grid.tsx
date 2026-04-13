import type { ReactNode } from "react"

import type { ViewMode } from "@/lib/constants"
import { cn } from "@workspace/ui/lib/utils"

type BookmarkGridProps = {
  viewMode: ViewMode
  className?: string
  children: ReactNode
}

export function BookmarkGrid({
  viewMode,
  className,
  children,
}: BookmarkGridProps) {
  return (
    <div
      className={cn(
        "mx-auto grid w-full gap-3",
        viewMode === "list"
          ? "max-w-5xl grid-cols-1"
          : "max-w-[1560px] grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))]",
        className,
      )}
    >
      {children}
    </div>
  )
}
