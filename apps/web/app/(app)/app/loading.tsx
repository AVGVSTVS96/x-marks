"use client"

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

  return (
    <div className="@container flex min-w-0 flex-1 overflow-auto">
      <BookmarkGrid viewMode={viewMode} className="border-t border-border px-4 py-5">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex h-24 flex-col gap-2 overflow-hidden rounded-lg border border-border p-3"
          >
            <div className="flex items-center gap-2">
              <Skeleton className="size-7 rounded-lg" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-2.5 w-24 rounded-lg" />
                <Skeleton className="h-2.5 w-16 rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-4 w-full rounded-lg" />
            <div className="mt-auto flex gap-3">
              <Skeleton className="h-2.5 w-12 rounded-lg" />
              <Skeleton className="h-2.5 w-12 rounded-lg" />
            </div>
          </div>
        ))}
      </BookmarkGrid>
    </div>
  )
}
