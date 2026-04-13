"use client"

import { useDeferredValue, useMemo } from "react"
import { usePreloadedQuery, type Preloaded } from "convex/react"

import { useAppState } from "@/components/app-state-context"
import { useBookmarkSearch } from "@/hooks/use-bookmarks"
import { useViewPrefs } from "@/hooks/use-view-prefs"
import { BookmarkCard } from "./bookmark-card"
import { BookmarkGrid } from "./bookmark-grid"
import { MediaMoodboard } from "./media-moodboard"
import { compareBookmarks } from "@convex/lib/compareBookmarks"
import { api } from "@convex/_generated/api"

interface BookmarkFeedProps {
  preloadedBookmarks: Preloaded<typeof api.bookmarks.list>
}

export function BookmarkFeed({ preloadedBookmarks }: BookmarkFeedProps) {
  const bookmarks = usePreloadedQuery(preloadedBookmarks)
  const { viewMode, sortField, sortDirection } = useViewPrefs()
  const { searchQuery, activeBookmark, onBookmarkSelect } = useAppState()

  const deferredSearchQuery = useDeferredValue(searchQuery)
  const searchResults = useBookmarkSearch(deferredSearchQuery)
  const isSearching = deferredSearchQuery.trim().length > 0

  const displayedBookmarks = useMemo(() => {
    const source = isSearching ? searchResults : bookmarks
    if (!source) return undefined
    return source
      .slice()
      .sort((left, right) =>
        compareBookmarks(left, right, sortField, sortDirection),
      )
  }, [bookmarks, isSearching, searchResults, sortField, sortDirection])

  const activeBookmarkId = activeBookmark?._id ?? null

  if (displayedBookmarks === undefined || displayedBookmarks.length === 0) {
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
      <div className="@container flex min-w-0 flex-1 overflow-auto">
        <MediaMoodboard
          bookmarks={displayedBookmarks}
          activeBookmarkId={activeBookmarkId}
          onBookmarkSelect={onBookmarkSelect}
        />
      </div>
    )
  }

  return (
    <div className="@container flex min-w-0 flex-1 overflow-auto">
      <BookmarkGrid viewMode={viewMode} className="border-t border-border px-4 py-5">
        {displayedBookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark._id}
            bookmark={bookmark}
            viewMode={viewMode}
            isActive={activeBookmarkId === bookmark._id}
            onClick={() => onBookmarkSelect(bookmark)}
          />
        ))}
      </BookmarkGrid>
    </div>
  )
}
