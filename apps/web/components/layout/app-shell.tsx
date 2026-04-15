"use client"

import { useMemo, useState } from "react"
import type { Preloaded } from "convex/react"

import { AppDataProvider } from "@/components/layout/app-data-context"
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
import { ViewPrefsProvider } from "@/hooks/use-view-prefs"
import type { AppViewer } from "@/lib/app-view-model"
import type { ViewPrefs } from "@/lib/view-prefs"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { TooltipProvider } from "@workspace/ui/components/tooltip"
import { useMediaQuery } from "@workspace/ui/hooks/use-media-query"
import { api } from "@convex/_generated/api"

interface AppShellProps {
  viewer: AppViewer
  initialViewPrefs: ViewPrefs
  preloadedSidebarData: Preloaded<typeof api.folders.sidebarData>
  children: React.ReactNode
}

export function AppShell({
  viewer,
  initialViewPrefs,
  preloadedSidebarData,
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
    [searchQuery, activeBookmark, selectBookmark],
  )

  const showFeed = !activeBookmark || isDesktop

  return (
    <ConvexProvider>
      <ViewPrefsProvider initialPrefs={initialViewPrefs}>
        <AppDataProvider preloadedSidebarData={preloadedSidebarData}>
          <TooltipProvider>
            <SidebarProvider>
              <SidebarPanel viewer={viewer} />
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
        </AppDataProvider>
      </ViewPrefsProvider>
    </ConvexProvider>
  )
}
