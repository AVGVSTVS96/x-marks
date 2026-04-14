"use client"

import { useMemo, useState } from "react"
import type { Preloaded } from "convex/react"

import {
  AppStateProvider,
  type AppState,
} from "@/components/layout/app-state-context"
import { BookmarkDetail } from "@/components/detail/bookmark-detail"
import { ConvexProvider } from "@/components/providers/convex-provider"
import { SidebarPanel } from "@/components/sidebar/sidebar-panel"
import { Toolbar } from "@/components/toolbar/toolbar"
import { useBookmarkSelection } from "@/hooks/use-bookmark-selection"
import { useBookmarkSync } from "@/hooks/use-bookmark-sync"
import type { AppViewer } from "@/lib/app-view-model"
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
  const [searchQuery, setSearchQuery] = useState("")
  const { activeBookmark, lightboxSignal, selectBookmark, closeDetail } =
    useBookmarkSelection()
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  useBookmarkSync()

  const appState = useMemo<AppState>(
    () => ({
      searchQuery,
      onSearchChange: setSearchQuery,
      activeBookmark,
      onBookmarkSelect: selectBookmark,
    }),
    [searchQuery, activeBookmark, selectBookmark]
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
            <AppStateProvider value={appState}>
              <div className="flex h-svh min-w-0 flex-col">
                <Toolbar />
                <main className="flex min-w-0 flex-1 overflow-hidden">
                  <div className={showFeed ? "flex min-w-0 flex-1" : "hidden"}>
                    {children}
                  </div>
                  {activeBookmark ? (
                    <BookmarkDetail
                      key={activeBookmark._id}
                      initialBookmark={activeBookmark}
                      lightboxSignal={lightboxSignal}
                      onClose={closeDetail}
                    />
                  ) : null}
                </main>
              </div>
            </AppStateProvider>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </ConvexProvider>
  )
}
