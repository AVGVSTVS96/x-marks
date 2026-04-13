"use client"

import { useMutation, useQuery } from "convex/react"
import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"

import type { SortDirection, SortField } from "@/lib/constants"

export function useBookmarks(filters?: {
  folderId?: Id<"folders">
  sortBy?: SortField
  sortDir?: SortDirection
}) {
  return useQuery(api.bookmarks.list, {
    folderId: filters?.folderId,
    sortBy: filters?.sortBy,
    sortDir: filters?.sortDir,
  })
}

export function useBookmarkDetail(bookmarkId: Id<"bookmarks"> | null) {
  return useQuery(api.bookmarks.get, bookmarkId ? { bookmarkId } : "skip")
}

export function useBookmarkSearch(query: string) {
  return useQuery(
    api.bookmarks.search,
    query.trim() ? { query: query.trim() } : "skip",
  )
}

export function useBookmarkMutations() {
  const updateSortOrder = useMutation(api.bookmarks.updateSortOrder)
  const remove = useMutation(api.bookmarks.remove)

  return { updateSortOrder, remove }
}
