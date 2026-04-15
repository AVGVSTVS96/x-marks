"use client"

import { createContext, useContext } from "react"
import { usePreloadedQuery, type Preloaded } from "convex/react"

import { api } from "@convex/_generated/api"
import type { Doc } from "@convex/_generated/dataModel"

type FolderListItem = Doc<"folders"> & {
  bookmarkCount: number
}

interface AppDataValue {
  folders: FolderListItem[]
  totalBookmarks: number
}

const AppDataContext = createContext<AppDataValue | null>(null)

interface AppDataProviderProps {
  preloadedSidebarData: Preloaded<typeof api.folders.sidebarData>
  children: React.ReactNode
}

export function AppDataProvider({
  preloadedSidebarData,
  children,
}: AppDataProviderProps) {
  const sidebarData = usePreloadedQuery(preloadedSidebarData)

  return (
    <AppDataContext.Provider value={sidebarData}>
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
