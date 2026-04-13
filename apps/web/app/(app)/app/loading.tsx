"use client"

import { BookmarkCardSkeleton } from "@/components/bookmarks/bookmark-card"
import { BookmarkGrid } from "@/components/bookmarks/bookmark-grid"
import {
  MOODBOARD_TILE_CLASS,
  MoodboardLayout,
} from "@/components/media/moodboard-layout"
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
      <MoodboardLayout>
        {MOODBOARD_TILE_HEIGHTS.map((height, index) => (
          <Skeleton
            key={index}
            radius="sm"
            className={cn(MOODBOARD_TILE_CLASS, height)}
          />
        ))}
      </MoodboardLayout>
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
