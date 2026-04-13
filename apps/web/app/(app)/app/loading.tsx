"use client"

import { BookmarkCardSkeleton } from "@/components/bookmarks/bookmark-card"
import { BookmarkGrid } from "@/components/bookmarks/bookmark-grid"
import { useViewPrefs } from "@/hooks/use-view-prefs"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { cn } from "@workspace/ui/lib/utils"

const MOODBOARD_TILE_HEIGHTS = [
  "h-64",
  "h-40",
  "h-56",
  "h-72",
  "h-48",
  "h-60",
  "h-44",
  "h-52",
  "h-64",
  "h-40",
  "h-56",
  "h-48",
]

export default function Loading() {
  const { viewMode } = useViewPrefs()

  if (viewMode === "media") {
    return (
      <div className="@container min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div
          className={cn(
            "mx-auto w-full max-w-[1560px] px-4 py-5",
            "columns-1 gap-3 @md:columns-2 @2xl:columns-3 @6xl:columns-4",
          )}
        >
          {MOODBOARD_TILE_HEIGHTS.map((height, index) => (
            <Skeleton
              key={index}
              className={cn(
                "mb-3 block w-full break-inside-avoid rounded-sm",
                height,
              )}
            />
          ))}
        </div>
      </div>
    )
  }

  const cardCount = viewMode === "list" ? 4 : 8

  return (
    <div className="@container flex min-w-0 flex-1 overflow-auto">
      <BookmarkGrid viewMode={viewMode} className="border-t border-border px-4 py-5">
        {Array.from({ length: cardCount }).map((_, index) => (
          <BookmarkCardSkeleton key={index} viewMode={viewMode} />
        ))}
      </BookmarkGrid>
    </div>
  )
}
