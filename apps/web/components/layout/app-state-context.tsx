"use client"

import { createContext, useContext } from "react"

import type { Doc } from "@convex/_generated/dataModel"

export type BookmarkListItem = Doc<"bookmarks"> & {
  tags: Doc<"tags">[]
  folders: Doc<"folders">[]
  hasNote: boolean
}

export interface AppState {
  searchQuery: string
  activeBookmark: BookmarkListItem | null
  onBookmarkSelect: (
    bookmark: BookmarkListItem | null,
    mediaIndex?: number,
  ) => void
}

const AppStateContext = createContext<AppState | null>(null)

export const AppStateProvider = AppStateContext.Provider

export function useAppState(): AppState {
  const value = useContext(AppStateContext)
  if (value == null) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return value
}
