"use client"

import { useDeferredValue } from "react"

import type { SortDirection, SortField, ViewMode } from "@/lib/constants"
import { useBookmarkSearch, useBookmarks } from "@/hooks/use-bookmarks"
import { BookmarkCard } from "./bookmark-card"
import { BookmarkGrid } from "./bookmark-grid"
import { MediaMoodboard } from "./media-moodboard"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { compareBookmarks } from "@convex/lib/compareBookmarks"
import type { Id } from "@convex/_generated/dataModel"

interface BookmarkFeedProps {
  folderId?: Id<"folders">
  searchQuery: string
  viewMode: ViewMode
  sortField: SortField
  sortDirection: SortDirection
  onBookmarkSelect: (
    bookmarkId: Id<"bookmarks"> | null,
    mediaIndex?: number,
  ) => void
  activeBookmarkId: Id<"bookmarks"> | null
}

export function BookmarkFeed({
  folderId,
  searchQuery,
  viewMode,
  sortField,
  sortDirection,
  onBookmarkSelect,
  activeBookmarkId,
}: BookmarkFeedProps) {
  const bookmarks = useBookmarks({
    folderId,
    sortBy: sortField,
    sortDir: sortDirection,
  })
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const searchResults = useBookmarkSearch(deferredSearchQuery)

  const isSearching = deferredSearchQuery.trim().length > 0
  const displayedBookmarks = isSearching
    ? searchResults
        ?.slice()
        .sort((left, right) =>
          compareBookmarks(left, right, sortField, sortDirection)
        )
    : bookmarks

  if (displayedBookmarks === undefined) {
    return (
      <div className="flex min-w-0 flex-1 overflow-auto">
        <BookmarkGrid viewMode={viewMode} className="border-t border-border px-4 py-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-lg border border-border p-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-8 rounded-lg" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-24 rounded-lg" />
                    <Skeleton className="h-3 w-16 rounded-lg" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full rounded-lg" />
                <div className="flex gap-3">
                  <Skeleton className="h-3 w-12 rounded-lg" />
                  <Skeleton className="h-3 w-12 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </BookmarkGrid>
      </div>
    )
  }

  if (displayedBookmarks.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
            {isSearching ? "No results" : "No bookmarks"}
          </p>
          <p className="text-xs text-muted-foreground">
            {isSearching
              ? "Try a different search term"
              : "Sync your bookmarks from X to get started"}
          </p>
        </div>
      </div>
    )
  }

  if (viewMode === "media") {
    return (
      <MediaMoodboard
        bookmarks={displayedBookmarks}
        activeBookmarkId={activeBookmarkId}
        onBookmarkSelect={onBookmarkSelect}
      />
    )
  }

  return (
    <div className="flex min-w-0 flex-1 overflow-auto">
      <BookmarkGrid viewMode={viewMode} className="border-t border-border px-4 py-5">
        {displayedBookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark._id}
            bookmark={bookmark}
            viewMode={viewMode}
            isActive={activeBookmarkId === bookmark._id}
            onClick={() => onBookmarkSelect(bookmark._id)}
          />
        ))}
      </BookmarkGrid>
    </div>
  )
}
