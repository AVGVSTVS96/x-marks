"use client"

import type { Id } from "@convex/_generated/dataModel"

import type { AppViewer } from "@/lib/app-view-model"
import { FolderTree } from "./folder-tree"
import { SidebarHeaderContent } from "./sidebar-header"
import { TagList } from "./tag-list"
import { UserMenu } from "./user-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarSeparator,
} from "@workspace/ui/components/sidebar"

interface SidebarPanelProps {
  activeFolderId?: Id<"folders">
  onFolderSelect: (folderId: Id<"folders"> | undefined) => void
  viewer: AppViewer
}

export function SidebarPanel({
  activeFolderId,
  onFolderSelect,
  viewer,
}: SidebarPanelProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarHeaderContent initialLastSyncAt={viewer.lastSyncAt} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-heading text-[10px] uppercase tracking-[0.15em]">
            Folders
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <FolderTree
                activeFolderId={activeFolderId}
                onFolderSelect={onFolderSelect}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="font-heading text-[10px] uppercase tracking-[0.15em]">
            Tags
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <TagList />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu viewer={viewer} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
