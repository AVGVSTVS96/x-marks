"use client"

import { useDeferredValue } from "react"
import { useConvexAuth, usePreloadedQuery, type Preloaded } from "convex/react"

import { api } from "@convex/_generated/api"
import { BookmarkFeed } from "./bookmark-feed"

interface RouteBookmarkFeedProps {
  preloaded: Preloaded<typeof api.bookmarks.list>
}

export function RouteBookmarkFeed({ preloaded }: RouteBookmarkFeedProps) {
  const bookmarks = usePreloadedQuery(preloaded)
  const deferredBookmarks = useDeferredValue(bookmarks)
  const { isLoading: isConvexAuthLoading } = useConvexAuth()

  const visibleBookmarks =
    isConvexAuthLoading &&
    bookmarks.length === 0 &&
    deferredBookmarks.length > 0
      ? deferredBookmarks
      : bookmarks

  return <BookmarkFeed bookmarks={visibleBookmarks} />
}
