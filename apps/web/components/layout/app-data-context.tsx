"use client"

import { createContext, useContext } from "react"
import { usePreloadedQuery, type Preloaded } from "convex/react"

import { api } from "@convex/_generated/api"
import type { Doc } from "@convex/_generated/dataModel"

import type { BookmarkListItem } from "./app-state-context"

type FolderListItem = Doc<"folders"> & {
  bookmarkCount: number
}

interface AppDataValue {
  folders: FolderListItem[]
  allBookmarks: BookmarkListItem[]
}

const AppDataContext = createContext<AppDataValue | null>(null)

interface AppDataProviderProps {
  preloadedFolders: Preloaded<typeof api.folders.list>
  preloadedAllBookmarks: Preloaded<typeof api.bookmarks.list>
  children: React.ReactNode
}

export function AppDataProvider({
  preloadedFolders,
  preloadedAllBookmarks,
  children,
}: AppDataProviderProps) {
  const folders = usePreloadedQuery(preloadedFolders)
  const allBookmarks = usePreloadedQuery(preloadedAllBookmarks)

  return (
    <AppDataContext.Provider value={{ folders, allBookmarks }}>
      {children}
    </AppDataContext.Provider>
  )
}

export function useAppData() {
  const value = useContext(AppDataContext)
  if (value == null) {
    throw new Error("useAppData must be used within an AppDataProvider")
  }
  return value
}
