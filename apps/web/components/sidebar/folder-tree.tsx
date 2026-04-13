"use client"

import { FolderKanban, LayoutGrid } from "lucide-react"
import { usePreloadedQuery, type Preloaded } from "convex/react"

import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { api } from "@convex/_generated/api"
import type { Id } from "@convex/_generated/dataModel"

export function FolderTree({
  activeFolderId,
  onFolderSelect,
  preloadedFolders,
  preloadedBookmarks,
}: {
  activeFolderId?: Id<"folders">
  onFolderSelect: (folderId: Id<"folders"> | undefined) => void
  preloadedFolders: Preloaded<typeof api.folders.list>
  preloadedBookmarks: Preloaded<typeof api.bookmarks.list>
}) {
  const folders = usePreloadedQuery(preloadedFolders)
  const allBookmarks = usePreloadedQuery(preloadedBookmarks)

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={activeFolderId === undefined}
          onClick={() => onFolderSelect(undefined)}
          tooltip="All Bookmarks"
        >
          <LayoutGrid className="size-4" />
          <span>All</span>
        </SidebarMenuButton>
        <SidebarMenuBadge>{allBookmarks.length}</SidebarMenuBadge>
      </SidebarMenuItem>

      {folders.map((folder) => (
        <SidebarMenuItem key={folder._id}>
          <SidebarMenuButton
            isActive={activeFolderId === folder._id}
            onClick={() => onFolderSelect(folder._id)}
            tooltip={folder.name}
          >
            <FolderKanban
              className="size-4"
              style={folder.color ? { color: folder.color } : undefined}
            />
            <span>{folder.name}</span>
          </SidebarMenuButton>
          <SidebarMenuBadge>{folder.bookmarkCount}</SidebarMenuBadge>
        </SidebarMenuItem>
      ))}
    </>
  )
}
