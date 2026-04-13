"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type { Preloaded } from "convex/react"

import {
  AppStateProvider,
  type AppState,
  type BookmarkListItem,
} from "@/components/layout/app-state-context"
import { BookmarkDetail } from "@/components/detail/bookmark-detail"
import { ConvexProvider } from "@/components/providers/convex-provider"
import { SidebarPanel } from "@/components/sidebar/sidebar-panel"
import { Toolbar } from "@/components/toolbar/toolbar"
import { useViewPrefs } from "@/hooks/use-view-prefs"
import { AUTO_SYNC_INTERVAL_MS, type AppViewer } from "@/lib/app-view-model"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query"
import { api } from "@convex/_generated/api"

interface AppShellProps {
  viewer: AppViewer
  preloadedFolders: Preloaded<typeof api.folders.list>
  preloadedAllBookmarks: Preloaded<typeof api.bookmarks.list>
  children: React.ReactNode
}

export function AppShell({
  viewer,
  preloadedFolders,
  preloadedAllBookmarks,
  children,
}: AppShellProps) {
  const [activeBookmark, setActiveBookmark] = useState<BookmarkListItem | null>(
    null,
  )
  const [lightboxSignal, setLightboxSignal] = useState<{
    mediaIndex: number
    nonce: number
  } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { viewMode, sortField, sortDirection, updatePrefs } = useViewPrefs()
  const isDesktop = useMediaQuery("(min-width: 1024px)")

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

  const handleBookmarkSelect = useCallback(
    (bookmark: BookmarkListItem | null, mediaIndex?: number) => {
      setActiveBookmark(bookmark)
      if (bookmark == null) {
        setLightboxSignal(null)
      } else if (mediaIndex != null) {
        setLightboxSignal({ mediaIndex, nonce: Date.now() })
      } else {
        setLightboxSignal(null)
      }
    },
    [],
  )

  const handleCloseDetail = useCallback(() => {
    setActiveBookmark(null)
    setLightboxSignal(null)
  }, [])

  const appState = useMemo<AppState>(
    () => ({
      searchQuery,
      activeBookmark,
      onBookmarkSelect: handleBookmarkSelect,
    }),
    [searchQuery, activeBookmark, handleBookmarkSelect],
  )

  const showFeed = !activeBookmark || isDesktop

  return (
    <ConvexProvider>
      <TooltipProvider>
        <SidebarProvider>
          <SidebarPanel
            viewer={viewer}
            preloadedFolders={preloadedFolders}
            preloadedAllBookmarks={preloadedAllBookmarks}
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
                <AppStateProvider value={appState}>
                  <div className={showFeed ? "flex min-w-0 flex-1" : "hidden"}>
                    {children}
                  </div>
                </AppStateProvider>
                {activeBookmark ? (
                  <BookmarkDetail
                    key={activeBookmark._id}
                    initialBookmark={activeBookmark}
                    lightboxSignal={lightboxSignal}
                    onClose={handleCloseDetail}
                  />
                ) : null}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </ConvexProvider>
  )
}
