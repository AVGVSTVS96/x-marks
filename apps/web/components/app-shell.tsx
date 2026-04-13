"use client"

import { useEffect, useState, useTransition } from "react"

import { BookmarkDetail } from "@/components/detail/bookmark-detail"
import { BookmarkFeed } from "@/components/bookmarks/bookmark-feed"
import { ConvexProvider } from "@/components/providers/convex-provider"
import { SidebarPanel } from "@/components/sidebar/sidebar-panel"
import { Toolbar } from "@/components/toolbar/toolbar"
import { useViewPrefs } from "@/hooks/use-view-prefs"
import { AUTO_SYNC_INTERVAL_MS, type AppViewer } from "@/lib/app-view-model"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query"
import type { Id } from "@convex/_generated/dataModel"

export function AppShell({ viewer }: { viewer: AppViewer }) {
  const [activeFolderId, setActiveFolderId] = useState<Id<"folders"> | undefined>()
  const [activeBookmarkId, setActiveBookmarkId] =
    useState<Id<"bookmarks"> | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { viewMode, sortField, sortDirection, updatePrefs } = useViewPrefs()
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const [, startTransition] = useTransition()

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
    })
  }

  const handleBookmarkSelect = (bookmarkId: Id<"bookmarks"> | null) => {
    startTransition(() => {
      setActiveBookmarkId(bookmarkId)
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
                  />
                )}
                {activeBookmarkId ? (
                  <BookmarkDetail
                    bookmarkId={activeBookmarkId}
                    onClose={() => handleBookmarkSelect(null)}
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
