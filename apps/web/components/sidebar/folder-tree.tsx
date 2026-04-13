"use client"

import { FolderKanban, LayoutGrid } from "lucide-react"

import { useBookmarks } from "@/hooks/use-bookmarks"
import { useFolders } from "@/hooks/use-folders"
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@workspace/ui/components/sidebar"
import type { Id } from "@convex/_generated/dataModel"

export function FolderTree({
  activeFolderId,
  onFolderSelect,
}: {
  activeFolderId?: Id<"folders">
  onFolderSelect: (folderId: Id<"folders"> | undefined) => void
}) {
  const folders = useFolders()
  const allBookmarks = useBookmarks()

  if (folders === undefined) {
    return (
      <>
        <SidebarMenuSkeleton showIcon />
        <SidebarMenuSkeleton showIcon />
        <SidebarMenuSkeleton showIcon />
      </>
    )
  }

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
        <SidebarMenuBadge>{allBookmarks?.length ?? 0}</SidebarMenuBadge>
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
