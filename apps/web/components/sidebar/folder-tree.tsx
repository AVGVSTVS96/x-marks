"use client"

import { FolderKanban, LayoutGrid } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { usePreloadedQuery, type Preloaded } from "convex/react"

import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { api } from "@convex/_generated/api"

export function FolderTree({
  preloadedFolders,
  preloadedAllBookmarks,
}: {
  preloadedFolders: Preloaded<typeof api.folders.list>
  preloadedAllBookmarks: Preloaded<typeof api.bookmarks.list>
}) {
  const folders = usePreloadedQuery(preloadedFolders)
  const allBookmarks = usePreloadedQuery(preloadedAllBookmarks)
  const pathname = usePathname()

  const isAllActive = pathname === "/app"

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isAllActive}
          tooltip="All Bookmarks"
          render={<Link href="/app" prefetch />}
        >
          <LayoutGrid className="size-4" />
          <span>All</span>
        </SidebarMenuButton>
        <SidebarMenuBadge>{allBookmarks.length}</SidebarMenuBadge>
      </SidebarMenuItem>

      {folders.map((folder) => {
        const href = `/app/f/${folder._id}`
        const isActive = pathname === href
        return (
          <SidebarMenuItem key={folder._id}>
            <SidebarMenuButton
              isActive={isActive}
              tooltip={folder.name}
              render={<Link href={href} prefetch />}
            >
              <FolderKanban
                className="size-4"
                style={folder.color ? { color: folder.color } : undefined}
              />
              <span>{folder.name}</span>
            </SidebarMenuButton>
            <SidebarMenuBadge>{folder.bookmarkCount}</SidebarMenuBadge>
          </SidebarMenuItem>
        )
      })}
    </>
  )
}
