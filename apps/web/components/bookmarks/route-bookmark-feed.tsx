"use client"

import { useMemo } from "react"

import { useAppData } from "@/components/layout/app-data-context"
import { BookmarkFeed } from "./bookmark-feed"
import type { Id } from "@convex/_generated/dataModel"

interface RouteBookmarkFeedProps {
  folderId?: Id<"folders">
}

export function RouteBookmarkFeed({ folderId }: RouteBookmarkFeedProps) {
  const { allBookmarks } = useAppData()

  const bookmarks = useMemo(() => {
    if (!folderId) {
      return allBookmarks
    }

    return allBookmarks.filter((bookmark) =>
      bookmark.folders.some((folder) => folder._id === folderId),
    )
  }, [allBookmarks, folderId])

  return <BookmarkFeed bookmarks={bookmarks} />
}
