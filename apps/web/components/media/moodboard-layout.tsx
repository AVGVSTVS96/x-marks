import type { ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"

export function MoodboardLayout({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className="@container min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
      <div
        className={cn(
          "mx-auto w-full max-w-[1560px] px-4 py-5",
          "columns-1 gap-3 @md:columns-2 @2xl:columns-3 @6xl:columns-4",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

export const MOODBOARD_TILE_CLASS =
  "mb-3 block w-full break-inside-avoid rounded-sm"
