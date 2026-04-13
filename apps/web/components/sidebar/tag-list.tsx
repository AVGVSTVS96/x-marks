"use client"

import { useTags } from "@/hooks/use-tags"
import {
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@workspace/ui/components/sidebar"

export function TagList() {
  const tags = useTags()

  if (tags === undefined) {
    return (
      <>
        <SidebarMenuSkeleton />
        <SidebarMenuSkeleton />
      </>
    )
  }

  if (tags.length === 0) {
    return <div className="px-3 py-2 text-xs text-muted-foreground">No tags yet</div>
  }

  return (
    <>
      {tags.map((tag) => (
        <SidebarMenuItem key={tag._id}>
          <SidebarMenuButton tooltip={tag.name}>
            <span
              className="size-2 shrink-0 rounded-full border"
              style={{ backgroundColor: tag.color, borderColor: tag.color }}
            />
            <span>{tag.name}</span>
          </SidebarMenuButton>
          <SidebarMenuBadge>{tag.bookmarkCount}</SidebarMenuBadge>
        </SidebarMenuItem>
      ))}
    </>
  )
}
