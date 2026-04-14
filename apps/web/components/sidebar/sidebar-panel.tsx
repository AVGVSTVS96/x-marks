"use client"

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
  viewer: AppViewer
}

export function SidebarPanel({ viewer }: SidebarPanelProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarHeaderContent initialLastSyncAt={viewer.lastSyncAt} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-heading text-xs uppercase tracking-eyebrow">
            Folders
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <FolderTree />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="font-heading text-xs uppercase tracking-eyebrow">
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
