"use client"

import { useDeferredValue, useRef } from "react"
import { usePreloadedQuery, type Preloaded } from "convex/react"

import { DEFAULT_VIEW_PREFS, type SortDirection, type SortField, type ViewMode } from "@/lib/constants"
import { useBookmarkSearch, useBookmarks } from "@/hooks/use-bookmarks"
import { BookmarkCard } from "./bookmark-card"
import { BookmarkGrid } from "./bookmark-grid"
import { MediaMoodboard } from "./media-moodboard"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { compareBookmarks } from "@convex/lib/compareBookmarks"
import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"

type BookmarkList = NonNullable<ReturnType<typeof useBookmarks>>

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
  preloadedBookmarks: Preloaded<typeof api.bookmarks.list>
}

export function BookmarkFeed({
  folderId,
  searchQuery,
  viewMode,
  sortField,
  sortDirection,
  onBookmarkSelect,
  activeBookmarkId,
  preloadedBookmarks,
}: BookmarkFeedProps) {
  const preloadedAllBookmarks = usePreloadedQuery(preloadedBookmarks)
  const matchesPreloaded =
    folderId === undefined &&
    sortField === DEFAULT_VIEW_PREFS.sortField &&
    sortDirection === DEFAULT_VIEW_PREFS.sortDirection
  const dynamicBookmarks = useBookmarks({
    folderId,
    sortBy: sortField,
    sortDir: sortDirection,
  })
  const bookmarks = matchesPreloaded ? preloadedAllBookmarks : dynamicBookmarks
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const searchResults = useBookmarkSearch(deferredSearchQuery)

  const isSearching = deferredSearchQuery.trim().length > 0
  const nextDisplayedBookmarks = isSearching
    ? searchResults
        ?.slice()
        .sort((left, right) =>
          compareBookmarks(left, right, sortField, sortDirection)
        )
    : bookmarks

  const previousBookmarksRef = useRef<BookmarkList>(preloadedAllBookmarks)
  if (nextDisplayedBookmarks !== undefined) {
    previousBookmarksRef.current = nextDisplayedBookmarks
  }
  const displayedBookmarks = nextDisplayedBookmarks ?? previousBookmarksRef.current
  const isRevalidating =
    nextDisplayedBookmarks === undefined && displayedBookmarks !== undefined

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
      <div
        data-revalidating={isRevalidating || undefined}
        className="flex min-w-0 flex-1 overflow-auto transition-opacity duration-150 data-[revalidating]:opacity-60"
      >
        <MediaMoodboard
          bookmarks={displayedBookmarks}
          activeBookmarkId={activeBookmarkId}
          onBookmarkSelect={onBookmarkSelect}
        />
      </div>
    )
  }

  return (
    <div
      data-revalidating={isRevalidating || undefined}
      className="flex min-w-0 flex-1 overflow-auto transition-opacity duration-150 data-[revalidating]:opacity-60"
    >
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
