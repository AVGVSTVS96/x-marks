"use client"

import { useEffect, useMemo, useState } from "react"

import { useAppState } from "@/components/layout/app-state-context"
import { useBookmarkSearch } from "@/hooks/use-bookmarks"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useViewPrefs } from "@/hooks/use-view-prefs"
import { BookmarkCard } from "./bookmark-card"
import { BookmarkFeedLoading } from "./bookmark-feed-loading"
import { BookmarkGrid } from "./bookmark-grid"
import { MediaMoodboard } from "@/components/media/media-moodboard"
import { EmptyState } from "@workspace/ui/components/empty-state"
import { compareBookmarks } from "@convex/lib/compareBookmarks"
import type { BookmarkListItem } from "@/components/layout/app-state-context"

interface BookmarkFeedProps {
  bookmarks: BookmarkListItem[]
}

export function BookmarkFeed({ bookmarks }: BookmarkFeedProps) {
  const { viewMode, sortField, sortDirection } = useViewPrefs()
  const { searchQuery, activeBookmark, onBookmarkSelect } = useAppState()

  const searchTerm = searchQuery.trim()
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 150)
  const searchResults = useBookmarkSearch(debouncedSearchTerm)
  const isSearching = searchTerm.length > 0
  const [lastResolvedSearchResults, setLastResolvedSearchResults] = useState<
    BookmarkListItem[] | null
  >(null)

  useEffect(() => {
    if (searchResults === undefined) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setLastResolvedSearchResults((previous) =>
        previous === searchResults ? previous : searchResults,
      )
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [searchResults])

  const visibleBookmarks = useMemo(() => {
    if (!isSearching) {
      return bookmarks
    }

    return searchResults ?? lastResolvedSearchResults ?? []
  }, [bookmarks, isSearching, lastResolvedSearchResults, searchResults])

  const displayedBookmarks = useMemo(() => {
    return visibleBookmarks
      .slice()
      .sort((left, right) =>
        compareBookmarks(left, right, sortField, sortDirection),
      )
  }, [sortDirection, sortField, visibleBookmarks])

  const activeBookmarkId = activeBookmark?._id ?? null
  const isSearchLoading =
    isSearching &&
    searchResults === undefined &&
    lastResolvedSearchResults == null

  if (isSearchLoading) {
    return <BookmarkFeedLoading />
  }

  if (displayedBookmarks.length === 0) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-1 items-center justify-center"
      >
        <EmptyState
          title={
            <span className="font-heading text-sm uppercase tracking-wider">
              {isSearching ? "No results" : "No bookmarks"}
            </span>
          }
          description={
            isSearching
              ? "Try a different search term"
              : "Sync your bookmarks from X to get started"
          }
          className="gap-2 px-0 py-0"
        />
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
