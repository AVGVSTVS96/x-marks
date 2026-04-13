"use client"

import { useEffect, useState, useTransition } from "react"
import type { Preloaded } from "convex/react"

import { BookmarkDetail } from "@/components/detail/bookmark-detail"
import { BookmarkFeed } from "@/components/bookmarks/bookmark-feed"
import { BookmarkWarmer } from "@/components/bookmarks/bookmark-warmer"
import { ConvexProvider } from "@/components/providers/convex-provider"
import { SidebarPanel } from "@/components/sidebar/sidebar-panel"
import { Toolbar } from "@/components/toolbar/toolbar"
import { useViewPrefs } from "@/hooks/use-view-prefs"
import { AUTO_SYNC_INTERVAL_MS, type AppViewer } from "@/lib/app-view-model"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query"
import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"

interface AppShellProps {
  viewer: AppViewer
  preloadedFolders: Preloaded<typeof api.folders.list>
  preloadedBookmarks: Preloaded<typeof api.bookmarks.list>
}

export function AppShell({
  viewer,
  preloadedFolders,
  preloadedBookmarks,
}: AppShellProps) {
  const [activeFolderId, setActiveFolderId] = useState<Id<"folders"> | undefined>()
  const [activeBookmarkId, setActiveBookmarkId] =
    useState<Id<"bookmarks"> | null>(null)
  const [lightboxSignal, setLightboxSignal] = useState<{
    mediaIndex: number
    nonce: number
  } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [warmFolderIds, setWarmFolderIds] = useState<Array<Id<"folders">>>([])
  const { viewMode, sortField, sortDirection, updatePrefs } = useViewPrefs()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [, startTransition] = useTransition()

  const WARM_FOLDER_LIMIT = 5

  useEffect(() => {
    const runSync = async () => {
      if (typeof window === "undefined" || !navigator.onLine) {
        return
      }

      try {
        await fetch("/api/sync", { method: "POST" })
      } catch {
        return
      }
    }

    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void runSync()
      }
    }, AUTO_SYNC_INTERVAL_MS)

    void runSync()

    const onFocus = () => {
      if (document.visibilityState === "visible") {
        void runSync()
      }
    }

    window.addEventListener("focus", onFocus)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener("focus", onFocus)
    }
  }, [])

  const handleFolderSelect = (folderId: Id<"folders"> | undefined) => {
    startTransition(() => {
      setActiveFolderId(folderId)
      setActiveBookmarkId(null)
      if (folderId) {
        setWarmFolderIds((prev) => {
          const deduped = prev.filter((id) => id !== folderId)
          return [folderId, ...deduped].slice(0, WARM_FOLDER_LIMIT)
        })
      }
    })
  }

  const handleBookmarkSelect = (
    bookmarkId: Id<"bookmarks"> | null,
    mediaIndex?: number,
  ) => {
    startTransition(() => {
      setActiveBookmarkId(bookmarkId)
      if (bookmarkId == null) {
        setLightboxSignal(null)
      } else if (mediaIndex != null) {
        setLightboxSignal({ mediaIndex, nonce: Date.now() })
      }
    })
  }

  return (
    <ConvexProvider>
      <TooltipProvider>
        <SidebarProvider>
          <SidebarPanel
            activeFolderId={activeFolderId}
            onFolderSelect={handleFolderSelect}
            viewer={viewer}
            preloadedFolders={preloadedFolders}
            preloadedBookmarks={preloadedBookmarks}
          />
          <SidebarInset className="min-w-0">
            <div className="flex h-svh min-w-0 flex-col">
              <Toolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={(nextViewMode) =>
                  updatePrefs({ viewMode: nextViewMode })
                }
                sortField={sortField}
                sortDirection={sortDirection}
                onSortFieldChange={(nextSortField) =>
                  updatePrefs({ sortField: nextSortField })
                }
                onSortDirectionChange={(nextSortDirection) =>
                  updatePrefs({ sortDirection: nextSortDirection })
                }
              />
              <div className="flex min-w-0 flex-1 overflow-hidden">
                {(!activeBookmarkId || isDesktop) && (
                  <BookmarkFeed
                    folderId={activeFolderId}
                    searchQuery={searchQuery}
                    viewMode={viewMode}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onBookmarkSelect={handleBookmarkSelect}
                    activeBookmarkId={activeBookmarkId}
                    preloadedBookmarks={preloadedBookmarks}
                  />
                )}
                {activeBookmarkId ? (
                  <BookmarkDetail
                    bookmarkId={activeBookmarkId}
                    lightboxSignal={lightboxSignal}
                    onClose={() => handleBookmarkSelect(null)}
                  />
                ) : null}
              </div>
            </div>
          </SidebarInset>
          <BookmarkWarmer
            folderIds={warmFolderIds}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        </SidebarProvider>
      </TooltipProvider>
    </ConvexProvider>
  )
}
